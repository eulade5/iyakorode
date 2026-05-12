-- ═══════════════════════════════════════════════════════
-- AMAZING TOOLS COMPANY — SUPABASE SQL SETUP
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════
-- 4. ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- PUBLIC: anyone can read active products and categories
CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public read active products"
  ON products FOR SELECT USING (active = true);

-- AUTHENTICATED (admin): full access
CREATE POLICY "Admin full access categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access products"
  ON products FOR ALL USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════
-- 5. STORAGE BUCKET
-- Run in Supabase Dashboard → Storage → New Bucket
-- Name: product-images
-- Public: YES
-- ═══════════════════════════════════════════════════════

-- Storage policy (run after creating bucket in Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════
-- 6. SEED DATA — One product per category
-- ═══════════════════════════════════════════════════════

-- Categories
INSERT INTO categories (name, description) VALUES
  ('Bathroom Fixtures', 'Luxury taps, showers, baths and sanitary ware'),
  ('Tiles', 'Premium ceramic, porcelain and natural stone tiles'),
  ('Lighting', 'Architectural and decorative lighting solutions'),
  ('Kitchens', 'Bespoke kitchen fittings and accessories'),
  ('Mirrors', 'Decorative and functional mirror solutions'),
  ('Accessories', 'Premium hardware and finishing accessories'),
  ('Industrial Finishes', 'Professional-grade coating and finishing solutions')
ON CONFLICT (name) DO NOTHING;

-- Products (one per category)
INSERT INTO products (name, description, category_id, active)
SELECT
  'Rainfall Shower System',
  'A premium ceiling-mounted rainfall shower system with 300mm stainless steel head, thermostatic valve, and brushed gold finish. Perfect for luxury bathrooms.',
  id, true
FROM categories WHERE name = 'Bathroom Fixtures';

INSERT INTO products (name, description, category_id, active)
SELECT
  'Carrara Marble Effect Porcelain Tile',
  'Large format 600×1200mm porcelain tile with authentic Carrara marble veining. Suitable for floors and walls. Available in polished and matt finishes.',
  id, true
FROM categories WHERE name = 'Tiles';

INSERT INTO products (name, description, category_id, active)
SELECT
  'Sputnik Pendant Chandelier',
  'Mid-century modern inspired sputnik chandelier with 12 adjustable arms and Edison bulbs. Available in brushed brass and matte black finishes.',
  id, true
FROM categories WHERE name = 'Lighting';

INSERT INTO products (name, description, category_id, active)
SELECT
  'Handleless Kitchen Door Pull System',
  'Integrated J-profile aluminium handleless system for a seamless modern kitchen look. Compatible with all standard cabinet configurations. Available in silver, gold, and black.',
  id, true
FROM categories WHERE name = 'Kitchens';

INSERT INTO products (name, description, category_id, active)
SELECT
  'Frameless Backlit LED Mirror',
  'Smart frameless bathroom mirror with integrated LED strip lighting, anti-fog function, and touch dimmer control. Available in sizes from 60×80cm to 120×90cm.',
  id, true
FROM categories WHERE name = 'Mirrors';

INSERT INTO products (name, description, category_id, active)
SELECT
  'Brushed Gold Towel Rail Set',
  'Premium 5-piece bathroom accessory set including towel rail, toilet paper holder, robe hook, and more. PVD brushed gold coating — resistant to tarnish and corrosion.',
  id, true
FROM categories WHERE name = 'Accessories';

INSERT INTO products (name, description, category_id, active)
SELECT
  'Epoxy Floor Coating System',
  'Professional-grade two-component epoxy floor coating for garages, warehouses, and commercial spaces. High-gloss, chemical resistant, available in 12 colours.',
  id, true
FROM categories WHERE name = 'Industrial Finishes';
