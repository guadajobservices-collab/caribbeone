-- CaribbeOne MVP — Schéma dédié caribbeone
-- Pour éviter les conflits avec les autres projets sur ce DB partagé

CREATE SCHEMA IF NOT EXISTS caribbeone;

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS caribbeone.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'organizer', 'admin')),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text,
  island text CHECK (island IN ('guadeloupe', 'martinique', 'marie-galante', 'les-saintes', 'metropole')),
  newsletter_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE caribbeone.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cb_profiles_select_own" ON caribbeone.profiles;
DROP POLICY IF EXISTS "cb_profiles_update_own" ON caribbeone.profiles;
DROP POLICY IF EXISTS "cb_profiles_insert_own" ON caribbeone.profiles;
DROP POLICY IF EXISTS "cb_profiles_admin_all" ON caribbeone.profiles;

CREATE POLICY "cb_profiles_select_own" ON caribbeone.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "cb_profiles_update_own" ON caribbeone.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "cb_profiles_insert_own" ON caribbeone.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "cb_profiles_admin_all" ON caribbeone.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM caribbeone.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION caribbeone.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO caribbeone.profiles (id, first_name, last_name, role)
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

DROP TRIGGER IF EXISTS on_auth_user_created_caribbeone ON auth.users;
CREATE TRIGGER on_auth_user_created_caribbeone
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION caribbeone.handle_new_user();

-- ============================================================
-- events
-- ============================================================
CREATE TABLE IF NOT EXISTS caribbeone.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES caribbeone.profiles(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS cb_events_status_idx ON caribbeone.events(status);
CREATE INDEX IF NOT EXISTS cb_events_island_idx ON caribbeone.events(island);
CREATE INDEX IF NOT EXISTS cb_events_starts_at_idx ON caribbeone.events(starts_at);
CREATE INDEX IF NOT EXISTS cb_events_slug_idx ON caribbeone.events(slug);

ALTER TABLE caribbeone.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cb_events_public_read" ON caribbeone.events;
DROP POLICY IF EXISTS "cb_events_organizer_own" ON caribbeone.events;
DROP POLICY IF EXISTS "cb_events_organizer_insert" ON caribbeone.events;

CREATE POLICY "cb_events_public_read" ON caribbeone.events FOR SELECT USING (status = 'published');
CREATE POLICY "cb_events_organizer_own" ON caribbeone.events FOR ALL USING (
  auth.uid() = organizer_id OR
  EXISTS (SELECT 1 FROM caribbeone.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "cb_events_organizer_insert" ON caribbeone.events FOR INSERT WITH CHECK (
  auth.uid() = organizer_id
);

-- ============================================================
-- packages
-- ============================================================
CREATE TABLE IF NOT EXISTS caribbeone.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES caribbeone.events(id) ON DELETE CASCADE,
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

ALTER TABLE caribbeone.packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cb_packages_public_read" ON caribbeone.packages;
DROP POLICY IF EXISTS "cb_packages_organizer_manage" ON caribbeone.packages;

CREATE POLICY "cb_packages_public_read" ON caribbeone.packages FOR SELECT USING (
  EXISTS (SELECT 1 FROM caribbeone.events WHERE id = caribbeone.packages.event_id AND status = 'published')
);
CREATE POLICY "cb_packages_organizer_manage" ON caribbeone.packages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM caribbeone.events e
    JOIN caribbeone.profiles p ON p.id = auth.uid()
    WHERE e.id = caribbeone.packages.event_id AND (e.organizer_id = auth.uid() OR p.role = 'admin')
  )
);

-- ============================================================
-- departure_points
-- ============================================================
CREATE TABLE IF NOT EXISTS caribbeone.departure_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES caribbeone.packages(id) ON DELETE CASCADE,
  label text NOT NULL,
  city text NOT NULL,
  island text NOT NULL CHECK (island IN ('guadeloupe', 'martinique', 'marie-galante', 'les-saintes', 'metropole')),
  departure_time time NOT NULL,
  return_time time
);

ALTER TABLE caribbeone.departure_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cb_departure_points_public_read" ON caribbeone.departure_points;
DROP POLICY IF EXISTS "cb_departure_points_organizer_manage" ON caribbeone.departure_points;

CREATE POLICY "cb_departure_points_public_read" ON caribbeone.departure_points FOR SELECT USING (true);
CREATE POLICY "cb_departure_points_organizer_manage" ON caribbeone.departure_points FOR ALL USING (
  EXISTS (
    SELECT 1 FROM caribbeone.packages pk
    JOIN caribbeone.events e ON e.id = pk.event_id
    WHERE pk.id = caribbeone.departure_points.package_id
    AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM caribbeone.profiles WHERE id = auth.uid() AND role = 'admin'))
  )
);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS caribbeone.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES caribbeone.profiles(id) ON DELETE RESTRICT,
  package_id uuid NOT NULL REFERENCES caribbeone.packages(id) ON DELETE RESTRICT,
  departure_point_id uuid REFERENCES caribbeone.departure_points(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  total_cents integer NOT NULL CHECK (total_cents > 0),
  participant_count integer NOT NULL DEFAULT 1,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cb_orders_user_id_idx ON caribbeone.orders(user_id);
CREATE INDEX IF NOT EXISTS cb_orders_status_idx ON caribbeone.orders(status);

ALTER TABLE caribbeone.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cb_orders_user_own" ON caribbeone.orders;
DROP POLICY IF EXISTS "cb_orders_organizer_read" ON caribbeone.orders;
DROP POLICY IF EXISTS "cb_orders_admin_all" ON caribbeone.orders;

CREATE POLICY "cb_orders_user_own" ON caribbeone.orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "cb_orders_organizer_read" ON caribbeone.orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM caribbeone.packages pk
    JOIN caribbeone.events e ON e.id = pk.event_id
    WHERE pk.id = caribbeone.orders.package_id AND e.organizer_id = auth.uid()
  )
);
CREATE POLICY "cb_orders_admin_all" ON caribbeone.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM caribbeone.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- order_participants
-- ============================================================
CREATE TABLE IF NOT EXISTS caribbeone.order_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES caribbeone.orders(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date,
  ticket_qr_code text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  ticket_pdf_url text,
  checked_in boolean NOT NULL DEFAULT false,
  checked_in_at timestamptz
);

CREATE INDEX IF NOT EXISTS cb_order_participants_order_id_idx ON caribbeone.order_participants(order_id);
CREATE INDEX IF NOT EXISTS cb_order_participants_qr_idx ON caribbeone.order_participants(ticket_qr_code);

ALTER TABLE caribbeone.order_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cb_participants_user_own" ON caribbeone.order_participants;
DROP POLICY IF EXISTS "cb_participants_organizer_scan" ON caribbeone.order_participants;
DROP POLICY IF EXISTS "cb_participants_organizer_read" ON caribbeone.order_participants;

CREATE POLICY "cb_participants_user_own" ON caribbeone.order_participants FOR ALL USING (
  EXISTS (SELECT 1 FROM caribbeone.orders WHERE id = caribbeone.order_participants.order_id AND user_id = auth.uid())
);
CREATE POLICY "cb_participants_organizer_read_scan" ON caribbeone.order_participants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM caribbeone.orders o
    JOIN caribbeone.packages pk ON pk.id = o.package_id
    JOIN caribbeone.events e ON e.id = pk.event_id
    WHERE o.id = caribbeone.order_participants.order_id AND e.organizer_id = auth.uid()
  )
);

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA caribbeone TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA caribbeone TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA caribbeone TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA caribbeone TO anon, authenticated, service_role;

-- ============================================================
-- Seed data de démonstration
-- ============================================================
-- Organizer admin de démo (sera créé via UI mais pour tester le catalogue)
-- On insère directement via service_role

SELECT 'CaribbeOne schema created successfully' AS status;
