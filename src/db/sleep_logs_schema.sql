-- Sleep Logs Table
create table if not exists public.sleep_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    date date not null,
    bed_time time not null,
    wake_time time not null,
    sleep_duration_minutes integer not null,
    sleep_quality integer not null,
    deep_sleep_percentage numeric,
    rem_sleep_percentage numeric,
    light_sleep_percentage numeric,
    awake_sleep_percentage numeric,
    total_sleep_cycles integer,
    time_to_fall_asleep integer,
    night_wakings integer,
    sleep_efficiency numeric,
    sleep_disruptions text[],
    caffeine_mg numeric,
    alcohol_drinks numeric,
    exercise_minutes integer,
    stress_level integer,
    mood_rating integer,
    screen_time_minutes integer,
    sleep_factors text[],
    pre_sleep_notes text,
    notes text,
    is_night_shift_sleep boolean default false,
    room_temperature numeric,
    room_brightness integer,
    room_noise_level integer,
    recovery_score integer,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    
    -- Ensure only one log per user per date
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

-- Create indexes for faster queries
create index if not exists sleep_logs_user_id_idx on public.sleep_logs(user_id);
create index if not exists sleep_logs_date_idx on public.sleep_logs(date);
create index if not exists sleep_logs_sleep_quality_idx on public.sleep_logs(sleep_quality);
create index if not exists sleep_logs_sleep_efficiency_idx on public.sleep_logs(sleep_efficiency);
create index if not exists sleep_logs_recovery_score_idx on public.sleep_logs(recovery_score);

-- Create trigger for updated_at
create or replace function update_sleep_logs_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger sleep_logs_updated_at
    before update on public.sleep_logs
    for each row
    execute function update_sleep_logs_updated_at();
