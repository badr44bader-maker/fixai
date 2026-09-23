create table public.profiles (id uuid primary key references auth.users on delete cascade, display_name text, preferred_language text default 'en', created_at timestamptz default now());
create function public.new_profile() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles(id) values (new.id); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function public.new_profile();

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  language text not null, object_name text, brand text, model text, confidence real,
  summary text, hazard text default 'low', safety_warning text,
  needs_more_information boolean default false, additional_information jsonb default '[]',
  thumbnail text, created_at timestamptz default now());
create index on public.analyses(user_id, created_at desc);
create table public.analysis_steps (id uuid primary key default gen_random_uuid(), analysis_id uuid not null references public.analyses on delete cascade, number int not null, instruction text not null, warning text);
create table public.feedback (id uuid primary key default gen_random_uuid(), analysis_id uuid not null references public.analyses on delete cascade, user_id uuid not null references auth.users on delete cascade, helpful boolean not null, comment text check (char_length(comment) <= 1000), created_at timestamptz default now());

alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.analysis_steps enable row level security;
alter table public.feedback enable row level security;
create policy own_profile on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy own_analyses on public.analyses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_steps on public.analysis_steps for all using (exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid())) with check (exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid()));
create policy own_feedback on public.feedback for all using (user_id = auth.uid()) with check (user_id = auth.uid());
