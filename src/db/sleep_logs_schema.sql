
-- Sleep Logs Table
create table if not exists public.sleep_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    date date not null,
    sleep_duration numeric not null,
    deep_sleep_percentage numeric not null,
    rem_sleep_percentage numeric not null,
    light_sleep_percentage numeric not null,
    sleep_score integer not null,
    sleep_onset_minutes integer not null,
    wakeups integer not null,
    efficiency_percentage numeric not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    
    constraint sleep_logs_user_date_unique unique (user_id, date)
);

-- Add RLS policies
alter table public.sleep_logs enable row level security;

create policy "Users can view their own sleep logs"
  on public.sleep_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sleep logs"
  on public.sleep_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sleep logs"
  on public.sleep_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sleep logs"
  on public.sleep_logs for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists sleep_logs_user_id_idx on public.sleep_logs(user_id);
create index if not exists sleep_logs_date_idx on public.sleep_logs(date);
