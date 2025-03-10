-- Create auth schema extensions and enable RLS
create extension if not exists "uuid-ossp";

-- Create tables with proper column names and constraints
create table if not exists user_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade unique not null,
    theme varchar(20) default 'system',
    notifications_enabled boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists user_preferences (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade unique not null,
    focus_preferences jsonb default '{}'::jsonb,
    sleep_preferences jsonb default '{}'::jsonb,
    exercise_preferences jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists activities (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    activity_type varchar(50) not null,
    title varchar(255) not null,
    description text,
    duration_minutes integer,
    energy_impact integer,
    timestamp timestamptz default now(),
    created_at timestamptz default now()
);

create table if not exists energy_metrics (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    energy_level integer check (energy_level between 1 and 10),
    focus_score integer check (focus_score between 1 and 10),
    stress_level integer check (stress_level between 1 and 10),
    mood varchar(50),
    notes text,
    timestamp timestamptz default now(),
    created_at timestamptz default now()
);

create table if not exists user_roles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade unique not null,
    role varchar(50) default 'user',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table user_settings enable row level security;
alter table user_preferences enable row level security;
alter table activities enable row level security;
alter table energy_metrics enable row level security;
alter table user_roles enable row level security;

-- Create RLS policies
create policy "Users can view own settings"
    on user_settings for select
    using (auth.uid() = user_id);

create policy "Users can update own settings"
    on user_settings for update
    using (auth.uid() = user_id);

create policy "Users can view own preferences"
    on user_preferences for select
    using (auth.uid() = user_id);

create policy "Users can update own preferences"
    on user_preferences for update
    using (auth.uid() = user_id);

create policy "Users can view own activities"
    on activities for select
    using (auth.uid() = user_id);

create policy "Users can insert own activities"
    on activities for insert
    with check (auth.uid() = user_id);

create policy "Users can view own energy metrics"
    on energy_metrics for select
    using (auth.uid() = user_id);

create policy "Users can insert own energy metrics"
    on energy_metrics for insert
    with check (auth.uid() = user_id);

create policy "Users can view own role"
    on user_roles for select
    using (auth.uid() = user_id);

-- Create functions for handling user settings
create or replace function handle_new_user() 
returns trigger as $$
begin
    insert into user_settings (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    insert into user_preferences (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    insert into user_roles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure handle_new_user();
