CREATE TABLE IF NOT EXISTS landing_pages (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL DEFAULT '',
  store_name   TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT '',
  catch_copy   TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  business_hours TEXT NOT NULL DEFAULT '',
  closed_days  TEXT NOT NULL DEFAULT '',
  address      TEXT NOT NULL DEFAULT '',
  phone        TEXT NOT NULL DEFAULT '',
  instagram_url TEXT,
  line_url     TEXT,
  main_image_url TEXT,
  cta_label    TEXT NOT NULL DEFAULT 'お問い合わせ',
  cta_link     TEXT NOT NULL DEFAULT '',
  template_key TEXT NOT NULL DEFAULT 'default',
  slug         TEXT NOT NULL UNIQUE,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS services (
  id              SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  price_text      TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notices (
  id              SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  body            TEXT,
  published_date  DATE,
  sort_order      INTEGER NOT NULL DEFAULT 0
);
