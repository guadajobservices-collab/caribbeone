-- CaribbeOne MVP — Initial Schema
-- Migration 001

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'organizer', 'admin')),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text,
  island text CHECK (island IN ('guadeloupe', 'martinique', 'marie-galante', 'les-saintes', 'metropole')),
  newsletter_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- events
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('musique', 'culture', 'gastronomie', 'carnaval', 'sport', 'arts')),
  subcategory text,
  island text NOT NULL CHECK (island IN ('guadeloupe', 'martinique', 'marie-galante', 'les-saintes', 'metropole')),
  venue text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  description text,
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_status_idx ON events(status);
CREATE INDEX IF NOT EXISTS events_island_idx ON events(island);
CREATE INDEX IF NOT EXISTS events_starts_at_idx ON events(starts_at);
CREATE INDEX IF NOT EXISTS events_slug_idx ON events(slug);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_public_read" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "events_organizer_own" ON events FOR ALL USING (
  auth.uid() = organizer_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "events_organizer_insert" ON events FOR INSERT WITH CHECK (
  auth.uid() = organizer_id
);

-- ============================================================
-- packages
-- ============================================================
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  transport_mode text CHECK (transport_mode IN ('ferry', 'navette', 'vol')),
  transport_operator text,
  includes_accommodation boolean NOT NULL DEFAULT false,
  accommodation_type text CHECK (accommodation_type IN ('gite', 'hotel', 'bungalow')),
  price_cents integer NOT NULL CHECK (price_cents > 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_promo boolean NOT NULL DEFAULT false,
  is_diaspora boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "packages_public_read" ON packages FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE id = packages.event_id AND status = 'published')
);
CREATE POLICY "packages_organizer_manage" ON packages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN profiles p ON p.id = auth.uid()
    WHERE e.id = packages.event_id AND (e.organizer_id = auth.uid() OR p.role = 'admin')
  )
);

-- ============================================================
-- departure_points
-- ============================================================
CREATE TABLE IF NOT EXISTS departure_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  label text NOT NULL,
  city text NOT NULL,
  island text NOT NULL CHECK (island IN ('guadeloupe', 'martinique', 'marie-galante', 'les-saintes', 'metropole')),
  departure_time time NOT NULL,
  return_time time
);

ALTER TABLE departure_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departure_points_public_read" ON departure_points FOR SELECT USING (true);
CREATE POLICY "departure_points_organizer_manage" ON departure_points FOR ALL USING (
  EXISTS (
    SELECT 1 FROM packages pk
    JOIN events e ON e.id = pk.event_id
    WHERE pk.id = departure_points.package_id
    AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  )
);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
  departure_point_id uuid REFERENCES departure_points(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  total_cents integer NOT NULL CHECK (total_cents > 0),
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_user_own" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "orders_organizer_read" ON orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM packages pk
    JOIN events e ON e.id = pk.event_id
    WHERE pk.id = orders.package_id AND e.organizer_id = auth.uid()
  )
);
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- order_participants
-- ============================================================
CREATE TABLE IF NOT EXISTS order_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date,
  ticket_qr_code text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  ticket_pdf_url text,
  checked_in boolean NOT NULL DEFAULT false,
  checked_in_at timestamptz
);

CREATE INDEX IF NOT EXISTS order_participants_order_id_idx ON order_participants(order_id);
CREATE INDEX IF NOT EXISTS order_participants_qr_idx ON order_participants(ticket_qr_code);

ALTER TABLE order_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participants_user_own" ON order_participants FOR ALL USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_participants.order_id AND user_id = auth.uid())
);
CREATE POLICY "participants_organizer_scan" ON order_participants FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN packages pk ON pk.id = o.package_id
    JOIN events e ON e.id = pk.event_id
    WHERE o.id = order_participants.order_id AND e.organizer_id = auth.uid()
  )
);
CREATE POLICY "participants_organizer_read" ON order_participants FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN packages pk ON pk.id = o.package_id
    JOIN events e ON e.id = pk.event_id
    WHERE o.id = order_participants.order_id AND e.organizer_id = auth.uid()
  )
);

-- ============================================================
-- Seed: demo data (organizer + events)
-- ============================================================

-- Insérer un événement de démo (sans organizer_id réel pour le moment)
-- Les vrais événements seront créés via le back-office

