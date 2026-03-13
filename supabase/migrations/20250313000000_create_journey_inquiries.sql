-- Journey inquiry submissions from the Return to Roots website
create table if not exists public.journey_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  preferred_dates text,
  duration text,
  interests text,
  message text,
  created_at timestamptz not null default now()
);

-- Allow anonymous inserts (public form submission)
alter table public.journey_inquiries enable row level security;

grant usage on schema public to anon;
grant insert on public.journey_inquiries to anon;

create policy "Allow anonymous insert for journey inquiries"
  on public.journey_inquiries
  for insert
  to anon
  with check (true);

-- Optional: restrict read to authenticated users or service role only
create policy "No public read"
  on public.journey_inquiries
  for select
  to authenticated
  using (true);

comment on table public.journey_inquiries is 'Landing page journey inquiry form submissions';
