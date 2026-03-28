export type UserRole = 'client' | 'organizer' | 'admin'
export type EventStatus = 'draft' | 'pending' | 'published' | 'cancelled'
export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'refunded'
export type TransportMode = 'ferry' | 'navette' | 'vol'
export type Island = 'guadeloupe' | 'martinique' | 'marie-galante' | 'les-saintes' | 'metropole'

export interface Profile {
  id: string
  role: UserRole
  first_name: string
  last_name: string
  email?: string
  phone?: string
  island?: Island
  newsletter_opt_in: boolean
  created_at: string
  updated_at?: string
}

export interface Event {
  id: string
  organizer_id: string
  title: string
  slug: string
  category: string
  subcategory?: string
  island: Island
  venue: string
  starts_at: string
  ends_at?: string
  description?: string
  cover_image_url?: string
  status: EventStatus
  created_at: string
  packages?: Package[]
  organizer?: Profile
}

export interface Package {
  id: string
  event_id: string
  name: string
  transport_mode?: TransportMode
  transport_operator?: string
  includes_accommodation: boolean
  accommodation_type?: string
  price_cents: number
  stock: number
  is_promo: boolean
  is_diaspora: boolean
  created_at: string
  departure_points?: DeparturePoint[]
}

export interface DeparturePoint {
  id: string
  package_id: string
  label: string
  city: string
  island: Island
  departure_time: string
  return_time?: string
}

export interface Order {
  id: string
  user_id: string
  package_id: string
  departure_point_id?: string
  status: OrderStatus
  total_cents: number
  participant_count: number
  stripe_payment_intent_id?: string
  created_at: string
  package?: Package
  departure_point?: DeparturePoint
  participants?: OrderParticipant[]
}

export interface OrderParticipant {
  id: string
  order_id: string
  first_name: string
  last_name: string
  birth_date?: string
  ticket_qr_code: string
  ticket_pdf_url?: string
  checked_in: boolean
  checked_in_at?: string
}
