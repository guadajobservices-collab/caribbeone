-- CaribbeOne — Base dédiée PostgreSQL 18
-- Pas de schema Supabase, pas de auth.users — Auth géré par Supabase Auth externe

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================================
-- profiles (synchro depuis Supabase Auth via webhook ou à la demande)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY,  -- = auth.users.id côté Supabase
  role        text NOT NULL DEFAULT 'client'
                CHECK (role IN ('client', 'organizer', 'admin')),
  first_name  text NOT NULL DEFAULT '',
  last_name   text NOT NULL DEFAULT '',
  email       citext UNIQUE,
  phone       text,
  island      text CHECK (island IN ('guadeloupe','martinique','marie-galante','les-saintes','metropole')),
  newsletter_opt_in boolean NOT NULL DEFAULT false,
  stripe_account_id text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx  ON profiles(role);

-- ============================================================
-- events
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title          text NOT NULL,
  slug           text NOT NULL UNIQUE,
  category       text NOT NULL
    CHECK (category IN ('musique','culture','gastronomie','carnaval','sport','arts')),
  subcategory    text,
  island         text NOT NULL
    CHECK (island IN ('guadeloupe','martinique','marie-galante','les-saintes','metropole')),
  venue          text NOT NULL,
  starts_at      timestamptz NOT NULL,
  ends_at        timestamptz,
  description    text,
  cover_image_url text,
  status         text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','pending','published','cancelled')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_status_idx    ON events(status);
CREATE INDEX IF NOT EXISTS events_island_idx    ON events(island);
CREATE INDEX IF NOT EXISTS events_starts_at_idx ON events(starts_at);
CREATE INDEX IF NOT EXISTS events_organizer_idx ON events(organizer_id);

-- ============================================================
-- packages
-- ============================================================
CREATE TABLE IF NOT EXISTS packages (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id              uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name                  text NOT NULL,
  transport_mode        text CHECK (transport_mode IN ('ferry','navette','vol')),
  transport_operator    text,
  includes_accommodation boolean NOT NULL DEFAULT false,
  accommodation_type    text CHECK (accommodation_type IN ('gite','hotel','bungalow')),
  price_cents           integer NOT NULL CHECK (price_cents > 0),
  stock                 integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_promo              boolean NOT NULL DEFAULT false,
  is_diaspora           boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS packages_event_idx ON packages(event_id);

-- ============================================================
-- departure_points
-- ============================================================
CREATE TABLE IF NOT EXISTS departure_points (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id     uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  label          text NOT NULL,
  city           text NOT NULL,
  island         text NOT NULL
    CHECK (island IN ('guadeloupe','martinique','marie-galante','les-saintes','metropole')),
  departure_time time NOT NULL,
  return_time    time
);

CREATE INDEX IF NOT EXISTS departure_points_pkg_idx ON departure_points(package_id);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  package_id                uuid NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
  departure_point_id        uuid REFERENCES departure_points(id),
  status                    text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','cancelled','refunded')),
  total_cents               integer NOT NULL CHECK (total_cents > 0),
  participant_count         integer NOT NULL DEFAULT 1,
  stripe_payment_intent_id  text,
  stripe_checkout_session_id text UNIQUE,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_idx     ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx   ON orders(status);
CREATE INDEX IF NOT EXISTS orders_session_idx  ON orders(stripe_checkout_session_id);

-- ============================================================
-- order_participants
-- ============================================================
CREATE TABLE IF NOT EXISTS order_participants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  first_name      text NOT NULL,
  last_name       text NOT NULL,
  birth_date      date,
  ticket_qr_code  text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  ticket_pdf_url  text,
  checked_in      boolean NOT NULL DEFAULT false,
  checked_in_at   timestamptz
);

CREATE INDEX IF NOT EXISTS participants_order_idx ON order_participants(order_id);
CREATE INDEX IF NOT EXISTS participants_qr_idx    ON order_participants(ticket_qr_code);

-- ============================================================
-- updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at') THEN
    CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_events_updated_at') THEN
    CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_orders_updated_at') THEN
    CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION trigger_updated_at();
  END IF;
END $$;

SELECT 'CaribbeOne dedicated DB ready ✅' AS status;
