-- QR menü taramaları (faturalama / ay sonu raporu)

create table if not exists public.qr_scan_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  scanned_at timestamptz not null default now()
);

create index if not exists qr_scan_events_tenant_time_idx
  on public.qr_scan_events (tenant_id, scanned_at desc);

alter table public.qr_scan_events enable row level security;

-- Herkese açık menü: sadece RPC ile kayıt (spam için doğrudan insert yok)
create or replace function public.record_qr_scan (p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
begin
  select id into tid
  from public.tenants
  where slug = p_slug
    and is_active = true
  limit 1;

  if tid is null then
    return;
  end if;

  insert into public.qr_scan_events (tenant_id)
  values (tid);
end;
$$;

revoke all on function public.record_qr_scan (text) from public;
grant execute on function public.record_qr_scan (text) to anon, authenticated;

create policy "tenant admin read qr scans"
  on public.qr_scan_events
  for select
  to authenticated
  using (public.is_tenant_admin (tenant_id));
