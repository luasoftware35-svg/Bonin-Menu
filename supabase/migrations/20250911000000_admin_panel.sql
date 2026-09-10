-- Admin panel: tenant_admins, RLS for CRUD, public menu-images bucket

create table if not exists public.tenant_admins (
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

alter table public.tenant_admins enable row level security;

create policy "users read own tenant admin rows"
  on public.tenant_admins
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_tenant_admin (tid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tenant_admins
    where tenant_id = tid
      and user_id = auth.uid()
  );
$$;

revoke all on function public.is_tenant_admin (uuid) from public;
grant execute on function public.is_tenant_admin (uuid) to authenticated;

-- Products: admins see unavailable items and can mutate
create policy "tenant admin read all products"
  on public.products
  for select
  to authenticated
  using (public.is_tenant_admin (tenant_id));

create policy "tenant admin manage products"
  on public.products
  for all
  to authenticated
  using (public.is_tenant_admin (tenant_id))
  with check (public.is_tenant_admin (tenant_id));

create policy "tenant admin read product translations"
  on public.product_translations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_translations.product_id
        and public.is_tenant_admin (p.tenant_id)
    )
  );

create policy "tenant admin manage product translations"
  on public.product_translations
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_translations.product_id
        and public.is_tenant_admin (p.tenant_id)
    )
  )
  with check (
    exists (
      select 1
      from public.products p
      where p.id = product_translations.product_id
        and public.is_tenant_admin (p.tenant_id)
    )
  );

create policy "tenant admin read tenant"
  on public.tenants
  for select
  to authenticated
  using (public.is_tenant_admin (id));

create policy "tenant admin update tenant"
  on public.tenants
  for update
  to authenticated
  using (public.is_tenant_admin (id))
  with check (public.is_tenant_admin (id));

insert into storage.buckets (id, name, public)
values ('menu', 'menu', true)
on conflict (id) do update
set public = excluded.public;

create policy "public read menu bucket"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'menu');

create policy "tenant admin insert menu images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'menu'
    and (storage.foldername (name))[1] is not null
    and public.is_tenant_admin (((storage.foldername (name))[1])::uuid)
  );

create policy "tenant admin update menu images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'menu'
    and (storage.foldername (name))[1] is not null
    and public.is_tenant_admin (((storage.foldername (name))[1])::uuid)
  );

create policy "tenant admin delete menu images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'menu'
    and (storage.foldername (name))[1] is not null
    and public.is_tenant_admin (((storage.foldername (name))[1])::uuid)
  );
