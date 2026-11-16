create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_plov_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;

create table if not exists public.menu_items (
  id text primary key,
  item jsonb not null,
  position integer not null default 0
);

create table if not exists public.site_visitors (
  visitor_id uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  ordered boolean not null default false
);

create table if not exists public.orders (
  order_number text primary key,
  visitor_id uuid,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.menu_items enable row level security;
alter table public.site_visitors enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public can read menu" on public.menu_items;
create policy "Public can read menu" on public.menu_items for select to anon, authenticated using (true);
drop policy if exists "Admins manage menu" on public.menu_items;
create policy "Admins manage menu" on public.menu_items for all to authenticated using (public.is_plov_admin()) with check (public.is_plov_admin());
drop policy if exists "Admins read visits" on public.site_visitors;
create policy "Admins read visits" on public.site_visitors for select to authenticated using (public.is_plov_admin());
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all to authenticated using (public.is_plov_admin()) with check (public.is_plov_admin());

create or replace function public.record_visit(visitor uuid)
returns void language plpgsql security definer set search_path = public
as $$ begin
  insert into public.site_visitors(visitor_id) values (visitor)
  on conflict (visitor_id) do update set last_seen = now();
end; $$;

create or replace function public.record_order(payload jsonb, visitor uuid)
returns void language plpgsql security definer set search_path = public
as $$ begin
  if coalesce(payload->>'orderNumber', '') = '' then raise exception 'Order number is required'; end if;
  insert into public.orders(order_number, visitor_id, payload)
  values (payload->>'orderNumber', visitor, payload)
  on conflict (order_number) do nothing;
  update public.site_visitors set ordered = true, last_seen = now() where visitor_id = visitor;
end; $$;

create or replace function public.save_menu(items jsonb)
returns void language plpgsql security definer set search_path = public
as $$ begin
  if not public.is_plov_admin() then raise exception 'Admin access required'; end if;
  delete from public.menu_items;
  insert into public.menu_items(id, item, position)
  select entry->>'id', entry, ordinality::integer
  from jsonb_array_elements(items) with ordinality as rows(entry, ordinality)
  where coalesce(entry->>'id', '') <> '';
end; $$;

create or replace function public.admin_stats()
returns jsonb language plpgsql security definer set search_path = public
as $$ declare total_visitors integer; ordered_visitors integer; total_orders integer;
begin
  if not public.is_plov_admin() then raise exception 'Admin access required'; end if;
  select count(*), count(*) filter (where ordered) into total_visitors, ordered_visitors from public.site_visitors;
  select count(*) into total_orders from public.orders;
  return jsonb_build_object('visitors', total_visitors, 'orderedVisitors', ordered_visitors,
    'browsingOnly', total_visitors - ordered_visitors, 'orders', total_orders);
end; $$;

grant execute on function public.record_visit(uuid) to anon, authenticated;
grant execute on function public.record_order(jsonb, uuid) to anon, authenticated;
grant execute on function public.save_menu(jsonb) to authenticated;
grant execute on function public.admin_stats() to authenticated;
grant select on public.menu_items to anon, authenticated;
grant select on public.orders, public.site_visitors to authenticated;
grant delete on public.orders to authenticated;
grant insert, update, delete on public.menu_items to authenticated;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view menu images" on storage.objects;
create policy "Public can view menu images" on storage.objects for select using (bucket_id = 'menu-images');
drop policy if exists "Admins upload menu images" on storage.objects;
create policy "Admins upload menu images" on storage.objects for insert to authenticated with check (bucket_id = 'menu-images' and public.is_plov_admin());
drop policy if exists "Admins update menu images" on storage.objects;
create policy "Admins update menu images" on storage.objects for update to authenticated using (bucket_id = 'menu-images' and public.is_plov_admin()) with check (bucket_id = 'menu-images' and public.is_plov_admin());
