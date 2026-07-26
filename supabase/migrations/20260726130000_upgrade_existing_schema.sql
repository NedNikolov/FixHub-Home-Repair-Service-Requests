-- FixHub upgrade for the existing repair_requests, repair_request_images, and user_roles tables.
-- Run this INSTEAD OF the initial_schema migration in an existing Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) <= 120)
);

-- Backfill profiles for accounts created before this migration.
insert into public.profiles (id, full_name, avatar_url, created_at, updated_at)
select
  id,
  coalesce(raw_user_meta_data ->> 'fullName', raw_user_meta_data ->> 'name', ''),
  raw_user_meta_data ->> 'avatar_url',
  coalesce(created_at, now()),
  now()
from auth.users
on conflict (id) do nothing;

-- Normalize and strengthen the existing role table without removing role records.
alter table public.user_roles add column if not exists created_at timestamptz not null default now();
alter table public.user_roles add column if not exists updated_at timestamptz not null default now();
alter table public.user_roles alter column role set default 'user';
update public.user_roles set role = lower(role) where role is not null;

insert into public.user_roles (user_id, role)
select p.id, 'user'
from public.profiles p
where not exists (select 1 from public.user_roles r where r.user_id = p.id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.user_roles'::regclass and contype = 'p'
  ) then
    alter table public.user_roles add primary key (user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.user_roles'::regclass and conname = 'user_roles_role_check') then
    alter table public.user_roles add constraint user_roles_role_check check (role in ('user', 'admin'));
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.user_roles'::regclass and conname = 'user_roles_user_id_fkey') then
    alter table public.user_roles add constraint user_roles_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
end;
$$;

-- Retain existing request rows and add production constraints/audit data.
alter table public.repair_requests add column if not exists updated_at timestamptz not null default now();
do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_requests'::regclass and conname = 'repair_requests_user_id_fkey') then
    alter table public.repair_requests add constraint repair_requests_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_requests'::regclass and conname = 'repair_requests_status_check') then
    alter table public.repair_requests add constraint repair_requests_status_check check (status in ('Pending', 'In Progress', 'Completed', 'Cancelled', 'Rejected'));
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_requests'::regclass and conname = 'repair_requests_title_length') then
    alter table public.repair_requests add constraint repair_requests_title_length check (char_length(title) between 1 and 160);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_requests'::regclass and conname = 'repair_requests_category_length') then
    alter table public.repair_requests add constraint repair_requests_category_length check (char_length(category) between 1 and 80);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_requests'::regclass and conname = 'repair_requests_description_length') then
    alter table public.repair_requests add constraint repair_requests_description_length check (char_length(description) between 1 and 5000);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_requests'::regclass and conname = 'repair_requests_address_length') then
    alter table public.repair_requests add constraint repair_requests_address_length check (char_length(address) between 1 and 500);
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_requests'::regclass and conname = 'repair_requests_id_user_id_key') then
    alter table public.repair_requests add constraint repair_requests_id_user_id_key unique (id, user_id);
  end if;
end;
$$;

-- Align the existing image table with the application’s production table name.
do $$
begin
  if to_regclass('public.repair_request_images') is not null and to_regclass('public.repair_images') is null then
    alter table public.repair_request_images rename to repair_images;
  end if;
end;
$$;
alter table public.repair_images alter column image_url drop not null;
do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_images'::regclass and conname = 'repair_images_user_id_fkey') then
    alter table public.repair_images add constraint repair_images_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_images'::regclass and conname = 'repair_images_request_owner_fkey') then
    alter table public.repair_images add constraint repair_images_request_owner_fkey foreign key (request_id, user_id) references public.repair_requests(id, user_id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'public.repair_images'::regclass and conname = 'repair_images_storage_path_key') then
    alter table public.repair_images add constraint repair_images_storage_path_key unique (storage_path);
  end if;
end;
$$;

create index if not exists repair_requests_user_created_at_idx on public.repair_requests (user_id, created_at desc);
create index if not exists repair_requests_status_created_at_idx on public.repair_requests (status, created_at desc);
create index if not exists repair_images_request_created_at_idx on public.repair_images (request_id, created_at asc);
create index if not exists repair_images_user_id_idx on public.repair_images (user_id);
create index if not exists user_roles_role_idx on public.user_roles (role);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
drop trigger if exists user_roles_set_updated_at on public.user_roles;
drop trigger if exists repair_requests_set_updated_at on public.repair_requests;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger user_roles_set_updated_at before update on public.user_roles for each row execute function public.set_updated_at();
create trigger repair_requests_set_updated_at before update on public.repair_requests for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'fullName', new.raw_user_meta_data ->> 'name', ''), new.raw_user_meta_data ->> 'avatar_url');
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.repair_requests enable row level security;
alter table public.repair_images enable row level security;

-- Replace any earlier policies on these FixHub tables so old permissive policies cannot bypass ownership rules.
do $$
declare policy_record record;
begin
  for policy_record in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'user_roles', 'repair_requests', 'repair_images')
  loop
    execute format('drop policy if exists %I on public.%I', policy_record.policyname, policy_record.tablename);
  end loop;
end;
$$;

create policy "fixhub_profiles_select" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "fixhub_profiles_update" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
create policy "fixhub_profiles_admin" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "fixhub_roles_select" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "fixhub_roles_admin" on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "fixhub_requests_select" on public.repair_requests for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "fixhub_requests_insert" on public.repair_requests for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "fixhub_requests_update" on public.repair_requests for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "fixhub_requests_delete" on public.repair_requests for delete to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "fixhub_images_select" on public.repair_images for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "fixhub_images_insert" on public.repair_images for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "fixhub_images_update" on public.repair_images for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "fixhub_images_delete" on public.repair_images for delete to authenticated using (user_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public)
values ('repair-images', 'repair-images', false), ('profile-images', 'profile-images', true)
on conflict (id) do update set public = excluded.public;

create policy "fixhub_repair_files_insert" on storage.objects for insert to authenticated
with check ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "fixhub_repair_files_select" on storage.objects for select to authenticated
using ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "fixhub_repair_files_update" on storage.objects for update to authenticated
using ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin())
with check ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "fixhub_repair_files_delete" on storage.objects for delete to authenticated
using ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "fixhub_profile_files_manage" on storage.objects for all to authenticated
using ((bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin())
with check ((bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
