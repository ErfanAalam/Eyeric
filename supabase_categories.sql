-- Table for product categories by gender, type, and shape
create table if not exists categories (
  id serial primary key,
  name text not null,
  category_type text not null check (category_type in ('gender', 'type', 'shape')),
  created_at timestamp with time zone default now()
);

-- Default gender categories
insert into categories (name, category_type) values
  ('men', 'gender'),
  ('women', 'gender'),
  ('kids', 'gender'),
  ('unisex', 'gender')
  on conflict do nothing;

-- Default type categories
insert into categories (name, category_type) values
  ('sunglasses', 'type'),
  ('eyeglasses', 'type'),
  ('computerglasses', 'type'),
  ('powered sunglasses', 'type')
  on conflict do nothing;

-- Default shape categories
insert into categories (name, category_type) values
  ('round', 'shape'),
  ('cat-eye', 'shape'),
  ('aviator', 'shape'),
  ('wayfarer', 'shape'),
  ('oval', 'shape'),
  ('rectangle', 'shape'),
  ('square', 'shape')
  on conflict do nothing; 