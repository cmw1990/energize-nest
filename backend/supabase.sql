-- Create diagrams table
create table diagrams (
  id text primary key,
  nodes jsonb,
  edges jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table diagrams enable row level security;

-- Create policies
create policy "Enable read access for all users" on diagrams for select using (true);
create policy "Enable insert for authenticated users only" on diagrams for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on diagrams for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on diagrams for delete using (auth.role() = 'authenticated');
