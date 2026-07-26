-- FixHub production schema. Apply with: supabase db push
create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'admin');
create type public.repair_request_status as enum ('Pending', 'In Progress', 'Completed', 'Cancelled', 'Rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) <= 120)
);

create table public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.repair_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  address text not null,
  preferred_date date,
  status public.repair_request_status not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint repair_requests_title_length check (char_length(title) between 1 and 160),
  constraint repair_requests_category_length check (char_length(category) between 1 and 80),
  constraint repair_requests_description_length check (char_length(description) between 1 and 5000),
  constraint repair_requests_address_length check (char_length(address) between 1 and 500),
  unique (id, user_id)
);

create table public.repair_images (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  image_url text,
  created_at timestamptz not null default now(),
  constraint repair_images_storage_path_length check (char_length(storage_path) between 1 and 1024),
  constraint repair_images_request_owner_fkey foreign key (request_id, user_id)
    references public.repair_requests(id, user_id) on delete cascade
);

create index repair_requests_user_created_at_idx on public.repair_requests (user_id, created_at desc);
create index repair_requests_status_created_at_idx on public.repair_requests (status, created_at desc);
create index repair_images_request_created_at_idx on public.repair_images (request_id, created_at asc);
create index repair_images_user_id_idx on public.repair_images (user_id);
create index user_roles_role_idx on public.user_roles (role);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger user_roles_set_updated_at before update on public.user_roles for each row execute function public.set_updated_at();
create trigger repair_requests_set_updated_at before update on public.repair_requests for each row execute function public.set_updated_at();

-- This SECURITY DEFINER helper prevents recursive RLS evaluation in admin policies.
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

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.repair_requests enable row level security;
alter table public.repair_images enable row level security;

create policy "Users view own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "Users update own profile" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "Users view own role" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Users view own requests" on public.repair_requests for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "Users create own requests" on public.repair_requests for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "Users update own requests" on public.repair_requests for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "Users delete own requests" on public.repair_requests for delete to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "Users view own images" on public.repair_images for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "Users add own images" on public.repair_images for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "Users update own images" on public.repair_images for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "Users delete own images" on public.repair_images for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- Private Storage buckets. Repair object paths use: <user-id>/<request-id>/<file-name>.
insert into storage.buckets (id, name, public)
values ('repair-images', 'repair-images', false), ('profile-images', 'profile-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Users upload own repair files" on storage.objects for insert to authenticated
with check ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "Users read own repair files" on storage.objects for select to authenticated
using ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "Users update own repair files" on storage.objects for update to authenticated
using ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin())
with check ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "Users delete own repair files" on storage.objects for delete to authenticated
using ((bucket_id = 'repair-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
create policy "Users manage own profile picture" on storage.objects for all to authenticated
using ((bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin())
with check ((bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text) or public.is_admin());
