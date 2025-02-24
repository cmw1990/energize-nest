-- Create enum types
CREATE TYPE blocking_mode AS ENUM ('strict', 'moderate', 'gentle', 'monitor');
CREATE TYPE platform_type AS ENUM ('web', 'desktop', 'mobile', 'browser_extension');
CREATE TYPE schedule_type AS ENUM ('always', 'scheduled', 'smart');
CREATE TYPE blocking_rule_type AS ENUM ('domain', 'app', 'keyword', 'category', 'custom_regex');
CREATE TYPE ad_blocking_level AS ENUM ('basic', 'aggressive', 'custom');

-- Blocking rules table
CREATE TABLE blocking_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    priority INTEGER CHECK (priority >= 0 AND priority <= 100),
    
    -- Schedule configuration
    schedule_type schedule_type NOT NULL,
    start_time TIME,
    end_time TIME,
    days TEXT[], -- Array of weekday names
    smart_triggers TEXT[], -- Array of trigger types
    
    blocking_mode blocking_mode NOT NULL,
    platforms platform_type[] NOT NULL,
    
    -- Blocking rules configuration
    blocking_rules JSONB NOT NULL DEFAULT '[]',
    
    -- Ad blocking configuration
    ad_blocking JSONB NOT NULL DEFAULT '{
        "enabled": true,
        "level": "basic",
        "customRules": [],
        "allowlist": []
    }',
    
    -- Notifications configuration
    notifications JSONB NOT NULL DEFAULT '{
        "enabled": true,
        "types": ["block_activated", "block_attempt"]
    }',
    
    -- Analytics configuration
    analytics JSONB NOT NULL DEFAULT '{
        "trackAttempts": true,
        "trackOverrides": true,
        "trackProductivity": true
    }',
    
    -- Override configuration
    override JSONB NOT NULL DEFAULT '{
        "allowedCount": 3,
        "cooldownMinutes": 60,
        "requireReason": true,
        "notifyAccountability": false
    }',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_schedule CHECK (
        (schedule_type = 'scheduled' AND start_time IS NOT NULL AND end_time IS NOT NULL) OR
        (schedule_type != 'scheduled')
    )
);

-- Distraction metrics table
CREATE TABLE distraction_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    block_attempts INTEGER DEFAULT 0,
    successful_blocks INTEGER DEFAULT 0,
    overrides_used INTEGER DEFAULT 0,
    most_blocked_domains JSONB DEFAULT '[]',
    most_blocked_apps JSONB DEFAULT '[]',
    productivity_score DECIMAL CHECK (productivity_score >= 0 AND productivity_score <= 100),
    focus_minutes INTEGER DEFAULT 0,
    distraction_minutes INTEGER DEFAULT 0
);

-- Ad blocking statistics table
CREATE TABLE ad_blocking_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ads_blocked INTEGER DEFAULT 0,
    trackers_blocked INTEGER DEFAULT 0,
    bandwidth_saved BIGINT DEFAULT 0, -- in bytes
    times_saved INTEGER DEFAULT 0, -- in seconds
    by_domain JSONB DEFAULT '[]'
);

-- Smart blocking triggers table
CREATE TABLE smart_blocking_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    condition JSONB NOT NULL,
    action JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_blocking_rules_user ON blocking_rules(user_id);
CREATE INDEX idx_blocking_rules_enabled ON blocking_rules(is_enabled);
CREATE INDEX idx_distraction_metrics_user_time ON distraction_metrics(user_id, timestamp);
CREATE INDEX idx_ad_blocking_stats_user_time ON ad_blocking_stats(user_id, timestamp);
CREATE INDEX idx_smart_triggers_user ON smart_blocking_triggers(user_id);

-- Add RLS policies
ALTER TABLE blocking_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE distraction_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_blocking_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_blocking_triggers ENABLE ROW LEVEL SECURITY;

-- Policies for blocking_rules
CREATE POLICY "Users can view their own blocking rules"
    ON blocking_rules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blocking rules"
    ON blocking_rules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blocking rules"
    ON blocking_rules FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocking rules"
    ON blocking_rules FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for distraction_metrics
CREATE POLICY "Users can view their own metrics"
    ON distraction_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
    ON distraction_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies for ad_blocking_stats
CREATE POLICY "Users can view their own ad blocking stats"
    ON ad_blocking_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ad blocking stats"
    ON ad_blocking_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies for smart_blocking_triggers
CREATE POLICY "Users can view their own triggers"
    ON smart_blocking_triggers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own triggers"
    ON smart_blocking_triggers FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_blocking_rules_updated_at
    BEFORE UPDATE ON blocking_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_triggers_updated_at
    BEFORE UPDATE ON smart_blocking_triggers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
