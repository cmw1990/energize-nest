-- Create professionals schema
CREATE SCHEMA IF NOT EXISTS professionals;

-- Enable RLS
ALTER SCHEMA professionals ENABLE ROW LEVEL SECURITY;

-- Create professionals table
CREATE TABLE professionals.professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('therapist', 'nutritionist', 'dietitian')),
    full_name TEXT NOT NULL,
    title TEXT NOT NULL,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    certifications TEXT[] NOT NULL DEFAULT '{}',
    education JSONB NOT NULL DEFAULT '[]',
    years_of_experience INTEGER NOT NULL DEFAULT 0,
    languages TEXT[] NOT NULL DEFAULT '{}',
    bio TEXT,
    profile_image TEXT,
    consultation_fee DECIMAL(10,2) NOT NULL,
    available_slots JSONB NOT NULL DEFAULT '[]',
    insurance_networks TEXT[] NOT NULL DEFAULT '{}',
    rating DECIMAL(3,2) NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create consultations table
CREATE TABLE professionals.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals.professionals(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('initial', 'follow_up', 'emergency')),
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    consultation_mode TEXT NOT NULL CHECK (consultation_mode IN ('video', 'audio', 'chat')),
    consultation_fee DECIMAL(10,2) NOT NULL,
    insurance_claim JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create treatments table
CREATE TABLE professionals.treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals.professionals(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('prescription', 'advice', 'todo', 'recipe')),
    content JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
    start_date DATE NOT NULL,
    end_date DATE,
    progress INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE professionals.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals.professionals(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES professionals.consultations(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    anonymous BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create messages table
CREATE TABLE professionals.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES professionals.consultations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create insurance_claims table
CREATE TABLE professionals.insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES professionals.consultations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    policy_number TEXT NOT NULL,
    claim_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ,
    documents TEXT[] NOT NULL DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create availability table
CREATE TABLE professionals.availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals.professionals(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create consultation_packages table
CREATE TABLE professionals.consultation_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals.professionals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sessions INTEGER NOT NULL,
    validity_days INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create client_progress table
CREATE TABLE professionals.client_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals.professionals(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES professionals.consultations(id) ON DELETE CASCADE,
    metrics JSONB NOT NULL,
    notes TEXT,
    next_steps TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_professionals_type ON professionals.professionals(type);
CREATE INDEX idx_professionals_rating ON professionals.professionals(rating DESC);
CREATE INDEX idx_consultations_status ON professionals.consultations(status);
CREATE INDEX idx_consultations_scheduled_at ON professionals.consultations(scheduled_at);
CREATE INDEX idx_treatments_status ON professionals.treatments(status);
CREATE INDEX idx_messages_consultation_id ON professionals.messages(consultation_id);
CREATE INDEX idx_insurance_claims_status ON professionals.insurance_claims(status);
CREATE INDEX idx_availability_professional_id ON professionals.availability(professional_id);

-- Create RLS policies
ALTER TABLE professionals.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.consultation_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals.client_progress ENABLE ROW LEVEL SECURITY;

-- Professionals can view and edit their own profiles
CREATE POLICY "Professionals can view their own profiles"
    ON professionals.professionals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Professionals can update their own profiles"
    ON professionals.professionals FOR UPDATE
    USING (auth.uid() = user_id);

-- Clients can view professional profiles
CREATE POLICY "Clients can view professional profiles"
    ON professionals.professionals FOR SELECT
    USING (true);

-- Consultations policies
CREATE POLICY "Users can view their consultations"
    ON professionals.consultations FOR SELECT
    USING (auth.uid() IN (professional_id, client_id));

CREATE POLICY "Users can update their consultations"
    ON professionals.consultations FOR UPDATE
    USING (auth.uid() IN (professional_id, client_id));

-- Similar policies for other tables...

-- Create functions for common operations
CREATE OR REPLACE FUNCTION professionals.search_professionals(
    search_term TEXT,
    professional_type TEXT DEFAULT NULL,
    specializations TEXT[] DEFAULT NULL,
    min_rating DECIMAL DEFAULT NULL,
    insurance_network TEXT DEFAULT NULL
) RETURNS SETOF professionals.professionals AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM professionals.professionals p
    WHERE (
        search_term IS NULL OR
        p.full_name ILIKE '%' || search_term || '%' OR
        p.bio ILIKE '%' || search_term || '%'
    )
    AND (professional_type IS NULL OR p.type = professional_type)
    AND (specializations IS NULL OR p.specializations && specializations)
    AND (min_rating IS NULL OR p.rating >= min_rating)
    AND (insurance_network IS NULL OR insurance_network = ANY(p.insurance_networks))
    ORDER BY p.rating DESC, p.review_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate professional rating
CREATE OR REPLACE FUNCTION professionals.calculate_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE professionals.professionals
    SET rating = (
        SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
        FROM professionals.reviews
        WHERE professional_id = NEW.professional_id
    ),
    review_count = (
        SELECT COUNT(*)
        FROM professionals.reviews
        WHERE professional_id = NEW.professional_id
    )
    WHERE id = NEW.professional_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rating calculation
CREATE TRIGGER update_professional_rating
    AFTER INSERT OR UPDATE OR DELETE ON professionals.reviews
    FOR EACH ROW
    EXECUTE FUNCTION professionals.calculate_professional_rating();
