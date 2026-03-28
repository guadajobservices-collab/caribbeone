import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

// Singleton pour éviter trop de connexions en dev
const globalForDb = globalThis as unknown as { _db: ReturnType<typeof postgres> | undefined }

export const db = globalForDb._db ?? postgres(connectionString, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
  ssl: false,
})

if (process.env.NODE_ENV !== 'production') globalForDb._db = db

// ============================================================
// Helpers typés
// ============================================================
import type { Event, Package, DeparturePoint, Order, OrderParticipant, Profile } from '@/types'

export async function getPublishedEvents(filters?: {
  island?: string
  category?: string
  date?: string
  q?: string
}): Promise<(Event & { packages: Package[] })[]> {
  let query = `
    SELECT e.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id, 'name', p.name, 'price_cents', p.price_cents,
            'transport_mode', p.transport_mode, 'stock', p.stock,
            'is_promo', p.is_promo, 'is_diaspora', p.is_diaspora,
            'includes_accommodation', p.includes_accommodation
          ) ORDER BY p.price_cents
        ) FILTER (WHERE p.id IS NOT NULL), '[]'
      ) AS packages
    FROM events e
    LEFT JOIN packages p ON p.event_id = e.id
    WHERE e.status = 'published'
  `
  const params: unknown[] = []
  let i = 1

  if (filters?.island) { query += ` AND e.island = $${i++}`; params.push(filters.island) }
  if (filters?.category) { query += ` AND e.category = $${i++}`; params.push(filters.category) }
  if (filters?.date) { query += ` AND e.starts_at >= $${i++}`; params.push(filters.date) }
  if (filters?.q) { query += ` AND e.title ILIKE $${i++}`; params.push(`%${filters.q}%`) }

  query += ` GROUP BY e.id ORDER BY e.starts_at ASC`

  const rows = await db.unsafe(query, params as string[])
  return rows as unknown as (Event & { packages: Package[] })[]
}

export async function getEventBySlug(slug: string): Promise<(Event & {
  packages: (Package & { departure_points: DeparturePoint[] })[]
}) | null> {
  const rows = await db`
    SELECT e.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', p.id, 'name', p.name, 'price_cents', p.price_cents,
            'transport_mode', p.transport_mode, 'transport_operator', p.transport_operator,
            'stock', p.stock, 'is_promo', p.is_promo, 'is_diaspora', p.is_diaspora,
            'includes_accommodation', p.includes_accommodation, 'accommodation_type', p.accommodation_type,
            'departure_points', COALESCE((
              SELECT json_agg(json_build_object(
                'id', dp.id, 'label', dp.label, 'city', dp.city, 'island', dp.island,
                'departure_time', dp.departure_time, 'return_time', dp.return_time
              )) FROM departure_points dp WHERE dp.package_id = p.id
            ), '[]')
          ) ORDER BY p.price_cents
        ) FILTER (WHERE p.id IS NOT NULL), '[]'
      ) AS packages
    FROM events e
    LEFT JOIN packages p ON p.event_id = e.id
    WHERE e.slug = ${slug} AND e.status = 'published'
    GROUP BY e.id
    LIMIT 1
  `
  return rows[0] as unknown as (Event & { packages: (Package & { departure_points: DeparturePoint[] })[] }) ?? null
}

export async function getEventById(id: string) {
  const rows = await db`SELECT * FROM events WHERE id = ${id} LIMIT 1`
  return rows[0] as unknown as Event ?? null
}

export async function getEventsByOrganizer(organizerId: string) {
  const rows = await db`
    SELECT e.*,
      COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') AS packages,
      COUNT(DISTINCT o.id) AS total_orders,
      COALESCE(SUM(o.total_cents) FILTER (WHERE o.status = 'paid'), 0) AS total_revenue_cents
    FROM events e
    LEFT JOIN packages p ON p.event_id = e.id
    LEFT JOIN orders o ON o.package_id = p.id
    WHERE e.organizer_id = ${organizerId}
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `
  return rows as unknown as (Event & { packages: Package[]; total_orders: number; total_revenue_cents: number })[]
}

export async function getOrdersByUser(userId: string): Promise<(Order & {
  package: Package & { event: Event }
  participants: OrderParticipant[]
})[]> {
  const rows = await db`
    SELECT o.*,
      json_build_object(
        'id', p.id, 'name', p.name, 'price_cents', p.price_cents,
        'event', json_build_object(
          'id', e.id, 'title', e.title, 'slug', e.slug,
          'venue', e.venue, 'starts_at', e.starts_at, 'island', e.island,
          'cover_image_url', e.cover_image_url
        )
      ) AS package,
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', op.id, 'first_name', op.first_name, 'last_name', op.last_name,
          'ticket_qr_code', op.ticket_qr_code, 'ticket_pdf_url', op.ticket_pdf_url,
          'checked_in', op.checked_in
        )) FROM order_participants op WHERE op.order_id = o.id
      ), '[]') AS participants
    FROM orders o
    JOIN packages p ON p.id = o.package_id
    JOIN events e ON e.id = p.event_id
    WHERE o.user_id = ${userId}
    ORDER BY o.created_at DESC
  `
  return rows as unknown as (Order & { package: Package & { event: Event }; participants: OrderParticipant[] })[]
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const rows = await db`SELECT * FROM profiles WHERE id = ${userId} LIMIT 1`
  return rows[0] as unknown as Profile ?? null
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  await db`
    INSERT INTO profiles ${db(profile)}
    ON CONFLICT (id) DO UPDATE SET ${db(profile)}, updated_at = now()
  `
}

export async function getAllEvents() {
  return await db`
    SELECT e.*, p.first_name, p.last_name,
      COUNT(DISTINCT pk.id) AS package_count
    FROM events e
    LEFT JOIN profiles p ON p.id = e.organizer_id
    LEFT JOIN packages pk ON pk.event_id = e.id
    GROUP BY e.id, p.first_name, p.last_name
    ORDER BY e.created_at DESC
  ` as unknown as (Event & { first_name: string; last_name: string; package_count: number })[]
}
