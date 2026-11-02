-- Waste2Market Relational Database Schema
-- Compatible with SQLite and MySQL

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  co2_factor_per_kg REAL DEFAULT 1.2,
  avg_market_price_inr REAL DEFAULT 0,
  description TEXT
);

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  about TEXT,
  is_verified INTEGER DEFAULT 0,
  verification_docs TEXT,
  rating REAL DEFAULT 4.5,
  materials_generated TEXT, -- JSON or comma separated
  materials_required TEXT,  -- JSON or comma separated
  phone TEXT,
  email TEXT NOT NULL UNIQUE,
  website TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('seller', 'buyer', 'admin')),
  company_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unique_code TEXT NOT NULL UNIQUE,
  seller_company_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  description TEXT,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL, -- 'tonne', 'kg', 'litre'
  price_per_unit_inr REAL NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  quality_grade TEXT NOT NULL, -- 'Grade A', 'Grade B', 'Industrial Reusable'
  availability_date TEXT NOT NULL,
  image_url TEXT,
  expected_use TEXT,
  status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'IN_NEGOTIATION', 'SOLD', 'SUSPENDED')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS buyer_requirements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_company_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  material_name TEXT NOT NULL,
  min_quantity REAL NOT NULL,
  max_quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  max_budget_per_unit_inr REAL NOT NULL,
  preferred_states TEXT, -- JSON or comma separated
  min_quality_grade TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL,
  buyer_company_id INTEGER NOT NULL,
  seller_company_id INTEGER NOT NULL,
  offered_quantity REAL NOT NULL,
  offered_price_per_unit_inr REAL NOT NULL,
  total_amount_inr REAL NOT NULL,
  logistics_preference TEXT DEFAULT 'BUYER_PICKUP' CHECK(logistics_preference IN ('BUYER_PICKUP', 'SELLER_DELIVER')),
  message TEXT,
  status TEXT DEFAULT 'OFFER_SENT' CHECK(status IN ('OFFER_SENT', 'NEGOTIATION', 'ACCEPTED', 'REJECTED', 'COUNTERED')),
  counter_price_inr REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deal_code TEXT NOT NULL UNIQUE,
  offer_id INTEGER NOT NULL,
  listing_id INTEGER NOT NULL,
  buyer_company_id INTEGER NOT NULL,
  seller_company_id INTEGER NOT NULL,
  agreed_quantity REAL NOT NULL,
  agreed_price_per_unit_inr REAL NOT NULL,
  total_deal_value_inr REAL NOT NULL,
  status TEXT DEFAULT 'ACCEPTED' CHECK(status IN ('ACCEPTED', 'LOGISTICS_ARRANGED', 'PROCESSING', 'COMPLETED')),
  timeline_events TEXT, -- JSON array of events
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS impact_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deal_id INTEGER,
  waste_diverted_kg REAL NOT NULL,
  co2_avoided_kg REAL NOT NULL,
  economic_value_inr REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_company_id INTEGER NOT NULL,
  to_company_id INTEGER NOT NULL,
  deal_id INTEGER,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (to_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read INTEGER DEFAULT 0,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
