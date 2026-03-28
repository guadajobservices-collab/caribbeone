import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import EventEditor from '@/components/organisateur/EventEditor'

interface Props { params: Promise<{ id: string }> }

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const rows = await db`
    SELECT e.*,
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', p.id, 'name', p.name, 'price_cents', p.price_cents,
          'transport_mode', p.transport_mode, 'transport_operator', p.transport_operator,
          'includes_accommodation', p.includes_accommodation, 'accommodation_type', p.accommodation_type,
          'stock', p.stock, 'is_promo', p.is_promo, 'is_diaspora', p.is_diaspora,
          'departure_points', COALESCE((
            SELECT json_agg(json_build_object(
              'id', dp.id, 'label', dp.label, 'city', dp.city, 'island', dp.island,
              'departure_time', dp.departure_time, 'return_time', dp.return_time
            )) FROM departure_points dp WHERE dp.package_id = p.id
          ), '[]')
        )) FROM packages p WHERE p.event_id = e.id
      ), '[]') AS packages
    FROM events e
    WHERE e.id = ${id} AND e.organizer_id = ${user.id}
    LIMIT 1
  `.catch(() => [])

  const event = rows[0]
  if (!event) notFound()

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a1a1a] mb-8">Éditer l&apos;événement</h1>
      <EventEditor event={event as Parameters<typeof EventEditor>[0]['event']} />
    </div>
  )
}
