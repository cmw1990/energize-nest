-- Create quit_smoking_stats table
CREATE TABLE IF NOT EXISTS quit_smoking_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    days_smoke_free INTEGER DEFAULT 0,
    cigarettes_avoided INTEGER DEFAULT 0,
    money_saved DECIMAL(10,2) DEFAULT 0.00,
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create quit_smoking_progress table
CREATE TABLE IF NOT EXISTS quit_smoking_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    cravings INTEGER DEFAULT 0,
    cigarettes_avoided INTEGER DEFAULT 0,
    energy_level INTEGER DEFAULT 5,
    mood_score INTEGER DEFAULT 3,
    mood TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create quit_smoking_settings table
CREATE TABLE IF NOT EXISTS quit_smoking_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_cigarettes INTEGER DEFAULT 0,
    cost_per_pack DECIMAL(10,2) DEFAULT 0.00,
    notification_enabled BOOLEAN DEFAULT true,
    reminder_time TIME DEFAULT '09:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create nicotine_consumption_log table for detailed tracking
CREATE TABLE IF NOT EXISTS nicotine_consumption_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consumption_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    product_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(5,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    trigger TEXT,
    location TEXT,
    mood TEXT,
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    review_text TEXT,
    pros TEXT[],
    cons TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    website_url TEXT,
    description TEXT,
    logo_url TEXT,
    has_online_store BOOLEAN DEFAULT FALSE,
    shipping_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create nrt_products table
CREATE TABLE IF NOT EXISTS nrt_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    description TEXT,
    strength_options TEXT[],
    price_range TEXT,
    pros TEXT[],
    cons TEXT[],
    best_for TEXT[],
    image_url TEXT,
    available BOOLEAN DEFAULT TRUE,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create product_vendors table (junction table)
CREATE TABLE IF NOT EXISTS product_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES nrt_products(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    product_url TEXT,
    price DECIMAL(10,2),
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(product_id, vendor_id)
);

-- Add RLS policies
ALTER TABLE quit_smoking_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quit_smoking_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quit_smoking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nicotine_consumption_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE nrt_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_vendors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own stats" ON quit_smoking_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON quit_smoking_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress" ON quit_smoking_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON quit_smoking_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON quit_smoking_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON quit_smoking_progress
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own settings" ON quit_smoking_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON quit_smoking_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON quit_smoking_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all community posts" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own community posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own consumption logs" ON nicotine_consumption_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consumption logs" ON nicotine_consumption_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consumption logs" ON nicotine_consumption_log
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consumption logs" ON nicotine_consumption_log
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all product reviews" ON product_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own product reviews" ON product_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product reviews" ON product_reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product reviews" ON product_reviews
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all NRT products" ON nrt_products
    FOR SELECT USING (true);

CREATE POLICY "Users can view all vendors" ON vendors
    FOR SELECT USING (true);

CREATE POLICY "Users can view all product vendors" ON product_vendors
    FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quit_smoking_stats_user_id ON quit_smoking_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_quit_smoking_progress_user_id_date ON quit_smoking_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_quit_smoking_settings_user_id ON quit_smoking_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nicotine_consumption_log_user_id ON nicotine_consumption_log(user_id);
CREATE INDEX IF NOT EXISTS idx_nicotine_consumption_log_date ON nicotine_consumption_log(consumption_date DESC);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_nrt_products_type ON nrt_products(type);
CREATE INDEX IF NOT EXISTS idx_product_vendors_product_id ON product_vendors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_vendors_vendor_id ON product_vendors(vendor_id);
