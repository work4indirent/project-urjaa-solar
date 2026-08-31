-- URJAA SOLAR ENERGY consolidated platform migration (idempotent, safe to re-run)
create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('admin','staff','customer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_status as enum ('new','contacted','qualified','site_survey','quotation_sent','negotiation','won','lost','follow_up');
exception when duplicate_object then null; end $$;

-- ============ TABLES ============
create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  created_at timestamptz default now()
);

create table if not exists public.leads(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  city text,
  state text,
  district text,
  property_type text,
  monthly_bill text,
  solution text,
  message text,
  source text default 'website',
  status public.lead_status not null default 'new',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  category text default 'Solar Panels',
  capacity text,
  warranty text,
  price numeric,
  description text,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.projects(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  state text,
  district text,
  capacity text,
  system_type text,
  description text,
  status text default 'planned',
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.subsidy_programs(
  id uuid primary key default gen_random_uuid(),
  program_name text not null,
  state text,
  benefit text,
  eligibility text,
  description text,
  official_source text,
  status text default 'draft',
  last_verified_at date,
  created_at timestamptz default now()
);

create table if not exists public.quotations(
  id uuid primary key default gen_random_uuid(),
  quote_ref text,
  name text not null,
  phone text not null,
  email text,
  state text,
  district text,
  city text,
  address text,
  property_type text default 'Home',
  monthly_bill numeric,
  roof_area numeric,
  system_size_kw numeric,
  panel_type text,
  estimated_cost numeric,
  estimated_subsidy numeric,
  customer_payable numeric,
  status text not null default 'requested',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.quotation_items(
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid references public.quotations(id) on delete cascade,
  label text not null,
  quantity numeric default 1,
  unit_price numeric default 0,
  total numeric default 0
);

create table if not exists public.service_requests(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  city text,
  service_type text not null,
  description text,
  status text not null default 'open',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.site_settings(
  key text primary key,
  value jsonb default '{}',
  updated_at timestamptz default now()
);

-- ============ AUTH TRIGGER (auto-admin for company email) ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, full_name, role)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    case when lower(new.email) = 'urjaasolarenergy@gmail.com' then 'admin'::public.user_role else 'customer'::public.user_role end
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Promote the company account if it already exists
update public.profiles p set role='admin'
from auth.users u where p.id=u.id and lower(u.email)='urjaasolarenergy@gmail.com';

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','staff'));
$$;

-- ============ GRANTS ============
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant insert on public.leads, public.quotations, public.service_requests to anon;
grant select on public.products, public.projects, public.subsidy_programs to anon;

-- ============ RLS ============
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.subsidy_programs enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
alter table public.service_requests enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (id=auth.uid() or public.is_staff());

drop policy if exists "public can create leads" on public.leads;
create policy "public can create leads" on public.leads for insert
with check (length(trim(name)) between 1 and 200 and length(trim(phone)) between 6 and 20);

drop policy if exists "staff manage leads" on public.leads;
create policy "staff manage leads" on public.leads for all
using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public can request quotation" on public.quotations;
create policy "public can request quotation" on public.quotations for insert
with check (length(trim(name)) between 1 and 200 and length(trim(phone)) between 6 and 20);

drop policy if exists "staff manage quotations" on public.quotations;
create policy "staff manage quotations" on public.quotations for all
using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff manage quotation items" on public.quotation_items;
create policy "staff manage quotation items" on public.quotation_items for all
using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public can request service" on public.service_requests;
create policy "public can request service" on public.service_requests for insert
with check (length(trim(name)) between 1 and 200 and length(trim(phone)) between 6 and 20);

drop policy if exists "staff manage services" on public.service_requests;
create policy "staff manage services" on public.service_requests for all
using (public.is_staff()) with check (public.is_staff());

drop policy if exists "published products" on public.products;
create policy "published products" on public.products for select using (is_published = true or public.is_staff());
drop policy if exists "staff manage products" on public.products;
create policy "staff manage products" on public.products for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "published projects" on public.projects;
create policy "published projects" on public.projects for select using (is_published = true or public.is_staff());
drop policy if exists "staff manage projects" on public.projects;
create policy "staff manage projects" on public.projects for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "published subsidies" on public.subsidy_programs;
create policy "published subsidies" on public.subsidy_programs for select using (status = 'published' or public.is_staff());
drop policy if exists "staff manage subsidies" on public.subsidy_programs;
create policy "staff manage subsidies" on public.subsidy_programs for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff manage settings" on public.site_settings;
create policy "staff manage settings" on public.site_settings for all using (public.is_staff()) with check (public.is_staff());
