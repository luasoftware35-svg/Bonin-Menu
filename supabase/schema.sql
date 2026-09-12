-- Bonin QR menu — multi-tenant, i18n-ready schema
-- Apply in the Supabase SQL editor (or as a migration) on a dedicated project.

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  slogan text,
  logo_url text,
  address text,
  hours text,
  instagram text,
  maps_url text,
  currency text not null default 'EUR',
  default_locale text not null default 'tr',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slug text not null,
  sort_order int not null default 0,
  unique (tenant_id, slug)
);

create table if not exists public.category_translations (
  category_id uuid not null references public.categories(id) on delete cascade,
  locale text not null,
  name text not null,
  primary key (category_id, locale)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null,
  price_cents int not null check (price_cents >= 0),
  image_url text,
  allergens text[] not null default '{}',
  portion_note text,
  energy_kcal int check (energy_kcal is null or energy_kcal >= 0),
  is_available boolean not null default true,
  sort_order int not null default 0,
  unique (tenant_id, slug)
);

create table if not exists public.product_translations (
  product_id uuid not null references public.products(id) on delete cascade,
  locale text not null,
  name text not null,
  description text,
  ingredients_note text,
  primary key (product_id, locale)
);

create index if not exists categories_tenant_sort_idx
  on public.categories (tenant_id, sort_order);

create index if not exists products_tenant_category_sort_idx
  on public.products (tenant_id, category_id, sort_order);

alter table public.tenants enable row level security;
alter table public.categories enable row level security;
alter table public.category_translations enable row level security;
alter table public.products enable row level security;
alter table public.product_translations enable row level security;

create policy "public read active tenants"
  on public.tenants for select
  to anon, authenticated
  using (is_active = true);

create policy "public read categories of active tenants"
  on public.categories for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.tenants t
      where t.id = categories.tenant_id and t.is_active = true
    )
  );

create policy "public read category translations"
  on public.category_translations for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.categories c
      join public.tenants t on t.id = c.tenant_id
      where c.id = category_translations.category_id and t.is_active = true
    )
  );

create policy "public read available products"
  on public.products for select
  to anon, authenticated
  using (
    is_available = true
    and exists (
      select 1 from public.tenants t
      where t.id = products.tenant_id and t.is_active = true
    )
  );

create policy "public read product translations"
  on public.product_translations for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products p
      join public.tenants t on t.id = p.tenant_id
      where p.id = product_translations.product_id
        and p.is_available = true
        and t.is_active = true
    )
  );
