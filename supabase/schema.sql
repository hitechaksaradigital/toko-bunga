-- Schema for Toko Bunga (Supabase PostgreSQL)

create extension if not exists "pgcrypto";

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone_number text,
  address text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

-- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric not null,
  stock integer not null default 0,
  images text[],
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  total_price numeric not null,
  recipient_name text not null,
  recipient_phone text not null,
  delivery_address text not null,
  delivery_date date not null,
  greeting_card_message text,
  created_at timestamptz not null default now()
);

-- order_items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  price_at_purchase numeric not null
);

-- RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles policies
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (
    auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- categories policies
create policy "categories_public_select" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- products policies
create policy "products_public_select" on public.products
  for select using (true);
create policy "products_admin_write" on public.products
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- orders policies
create policy "orders_select_own_or_admin" on public.orders
  for select using (
    auth.uid() = user_id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "orders_insert_authenticated" on public.orders
  for insert with check (auth.uid() is not null);

-- order_items policies
create policy "order_items_select_via_order" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')))
  );
create policy "order_items_insert_authenticated" on public.order_items
  for insert with check (auth.uid() is not null);

-- profile auto-create trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product_images_admin_write" on storage.objects
  for insert with check (
    bucket_id = 'product-images' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "product_images_admin_update" on storage.objects
  for update using (
    bucket_id = 'product-images' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "product_images_admin_delete" on storage.objects
  for delete using (
    bucket_id = 'product-images' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
