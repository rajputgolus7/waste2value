-- Waste2Market MySQL Relational Database Schema
-- Idempotent DDL for Standalone MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS waste2market CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE waste2market;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  icon VARCHAR(60),
  co2_factor_per_kg DECIMAL(5, 2) DEFAULT 1.20,
  avg_market_price_inr DECIMAL(12, 2) DEFAULT 0.00,
  description TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(150) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  about TEXT,
  is_verified TINYINT DEFAULT 0,
  verification_docs TEXT,
  rating DECIMAL(3, 2) DEFAULT 4.50,
  materials_generated TEXT,
  materials_required TEXT,
  phone VARCHAR(50),
  email VARCHAR(150) NOT NULL UNIQUE,
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('seller', 'buyer', 'admin') NOT NULL,
  company_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unique_code VARCHAR(50) NOT NULL UNIQUE,
  seller_company_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  description TEXT,
  quantity DECIMAL(12, 2) NOT NULL,
  unit ENUM('tonne', 'kg', 'litre') NOT NULL,
  price_per_unit_inr DECIMAL(12, 2) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  quality_grade ENUM('Grade A', 'Grade B', 'Industrial Reusable') NOT NULL,
  availability_date DATE NOT NULL,
  image_url VARCHAR(500),
  expected_use TEXT,
  status ENUM('ACTIVE', 'IN_NEGOTIATION', 'SOLD', 'SUSPENDED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS buyer_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  buyer_company_id INT NOT NULL,
  category_id INT NOT NULL,
  material_name VARCHAR(200) NOT NULL,
  min_quantity DECIMAL(12, 2) NOT NULL,
  max_quantity DECIMAL(12, 2) NOT NULL,
  unit ENUM('tonne', 'kg', 'litre') NOT NULL,
  max_budget_per_unit_inr DECIMAL(12, 2) NOT NULL,
  preferred_states VARCHAR(255),
  min_quality_grade VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  buyer_company_id INT NOT NULL,
  seller_company_id INT NOT NULL,
  offered_quantity DECIMAL(12, 2) NOT NULL,
  offered_price_per_unit_inr DECIMAL(12, 2) NOT NULL,
  total_amount_inr DECIMAL(14, 2) NOT NULL,
  logistics_preference ENUM('BUYER_PICKUP', 'SELLER_DELIVER') DEFAULT 'BUYER_PICKUP',
  message TEXT,
  status ENUM('OFFER_SENT', 'NEGOTIATION', 'ACCEPTED', 'REJECTED', 'COUNTERED') DEFAULT 'OFFER_SENT',
  counter_price_inr DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS deals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deal_code VARCHAR(50) NOT NULL UNIQUE,
  offer_id INT NOT NULL,
  listing_id INT NOT NULL,
  buyer_company_id INT NOT NULL,
  seller_company_id INT NOT NULL,
  agreed_quantity DECIMAL(12, 2) NOT NULL,
  agreed_price_per_unit_inr DECIMAL(12, 2) NOT NULL,
  total_deal_value_inr DECIMAL(14, 2) NOT NULL,
  status ENUM('ACCEPTED', 'LOGISTICS_ARRANGED', 'PROCESSING', 'COMPLETED') DEFAULT 'ACCEPTED',
  timeline_events JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS impact_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deal_id INT,
  waste_diverted_kg DECIMAL(12, 2) NOT NULL,
  co2_avoided_kg DECIMAL(12, 2) NOT NULL,
  economic_value_inr DECIMAL(14, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_company_id INT NOT NULL,
  to_company_id INT NOT NULL,
  deal_id INT,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (to_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read TINYINT DEFAULT 0,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
