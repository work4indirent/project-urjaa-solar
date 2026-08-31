-- URJAA migration 003: photos, customers/portal, calculator settings, storage (idempotent)

alter table public.products add column if not exists image_url text;
alter table public.projects add column if not exists image_url text;
alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u where p.id = u.id and p.email is null;

create table if not exists public.customers(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  notes text,
  profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.quotations add column if not exists customer_id uuid references public.customers(id) on delete set null;
alter table public.projects add column if not exists customer_id uuid references public.customers(id) on delete set null;
alter table public.service_requests add column if not exists customer_id uuid references public.customers(id) on delete set null;

-- signup trigger now also stores email and links waiting customer records
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, full_name, email, role)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    new.email,
    case when lower(new.email) = 'urjaasolarenergy@gmail.com' then 'admin'::public.user_role else 'customer'::public.user_role end
  )
  on conflict (id) do nothing;
  update public.customers set profile_id = new.id
  where profile_id is null and email is not null and lower(email) = lower(new.email);
  return new;
end; $$;

-- when staff add/update a customer, auto-link to an existing account with the same email
create or replace function public.link_customer_profile()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.profile_id is null and new.email is not null then
    select id into new.profile_id from public.profiles where lower(email) = lower(new.email) limit 1;
  end if;
  return new;
end; $$;

drop trigger if exists on_customer_link on public.customers;
create trigger on_customer_link before insert or update on public.customers
for each row execute procedure public.link_customer_profile();

grant select, insert, update, delete on public.customers to authenticated;
grant select on public.site_settings to anon, authenticated;

alter table public.customers enable row level security;

drop policy if exists "staff manage customers" on public.customers;
create policy "staff manage customers" on public.customers for all
using (public.is_staff()) with check (public.is_staff());

drop policy if exists "own customer record" on public.customers;
create policy "own customer record" on public.customers for select using (profile_id = auth.uid());

drop policy if exists "customer own quotations" on public.quotations;
create policy "customer own quotations" on public.quotations for select
using (customer_id in (select id from public.customers where profile_id = auth.uid()));

drop policy if exists "customer own projects" on public.projects;
create policy "customer own projects" on public.projects for select
using (customer_id in (select id from public.customers where profile_id = auth.uid()));

drop policy if exists "customer own services" on public.service_requests;
create policy "customer own services" on public.service_requests for select
using (customer_id in (select id from public.customers where profile_id = auth.uid()));

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);

-- storage buckets for product/project photos
insert into storage.buckets(id, name, public) values
  ('products','products',true),
  ('projects','projects',true)
on conflict (id) do nothing;

drop policy if exists "public media read" on storage.objects;
create policy "public media read" on storage.objects for select
using (bucket_id in ('products','projects'));

drop policy if exists "staff upload media" on storage.objects;
create policy "staff upload media" on storage.objects for insert
with check (public.is_staff() and bucket_id in ('products','projects'));

drop policy if exists "staff update media" on storage.objects;
create policy "staff update media" on storage.objects for update
using (public.is_staff() and bucket_id in ('products','projects'));

drop policy if exists "staff delete media" on storage.objects;
create policy "staff delete media" on storage.objects for delete
using (public.is_staff() and bucket_id in ('products','projects'));
