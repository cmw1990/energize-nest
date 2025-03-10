-- Care8 Connector Tables Migration
-- This file creates the necessary tables for the Care Connector visitor-facing tools

-- Care8 Caregivers Table
CREATE TABLE IF NOT EXISTS care8_caregivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  location VARCHAR(255) NOT NULL,
  distance VARCHAR(50),
  specialties TEXT[] NOT NULL,
  hourly_rate VARCHAR(50) NOT NULL,
  availability VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care8 Companions Table
CREATE TABLE IF NOT EXISTS care8_companions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  location VARCHAR(255) NOT NULL,
  distance VARCHAR(50),
  interests TEXT[] NOT NULL,
  hourly_rate VARCHAR(50) NOT NULL,
  availability VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care8 Legal Experts Table
CREATE TABLE IF NOT EXISTS care8_legal_experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  location VARCHAR(255) NOT NULL,
  distance VARCHAR(50),
  specialties TEXT[] NOT NULL,
  rate VARCHAR(50) NOT NULL,
  consultation_types TEXT[] NOT NULL,
  years_experience INTEGER NOT NULL,
  bio TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care8 Care Facilities Table
CREATE TABLE IF NOT EXISTS care8_care_facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  image VARCHAR(255),
  address VARCHAR(255) NOT NULL,
  distance VARCHAR(50),
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  price_range VARCHAR(100) NOT NULL,
  beds INTEGER NOT NULL,
  available_beds INTEGER NOT NULL DEFAULT 0,
  amenities TEXT[] NOT NULL,
  medical_services TEXT[] NOT NULL,
  description TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care8 Care Products Table
CREATE TABLE IF NOT EXISTS care8_care_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(255),
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  features TEXT[] NOT NULL,
  description TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  free_shipping BOOLEAN NOT NULL DEFAULT false,
  popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for Care8 Caregivers
INSERT INTO care8_caregivers (name, avatar, rating, review_count, location, distance, specialties, hourly_rate, availability, bio, verified)
VALUES
  ('Sarah Johnson', '', 4.9, 26, 'San Francisco, CA', '3.2 miles', ARRAY['Elderly Care', 'Medication Management'], '$25-30', 'Weekdays, Evenings', 'Certified caregiver with 8 years of experience specializing in elderly care and chronic conditions.', true),
  ('Michael Rodriguez', '', 4.7, 19, 'Oakland, CA', '5.8 miles', ARRAY['Disability Support', 'Physical Therapy'], '$28-35', 'Weekends, Mornings', 'Physical therapist assistant with training in mobility support and rehabilitation exercises.', true),
  ('Emily Chen', '', 4.8, 32, 'San Jose, CA', '12.4 miles', ARRAY['Dementia Care', 'Hospice Support'], '$30-40', 'Full-time', 'Specialized in dementia and Alzheimer''s care with compassionate approach to end-of-life care.', true),
  ('David Washington', '', 4.6, 14, 'Berkeley, CA', '7.1 miles', ARRAY['Post-Surgery Care', 'Wound Care'], '$32-38', 'Flexible', 'Former nurse assistant with extensive experience in post-operative care and recovery support.', false);

-- Insert sample data for Care8 Companions
INSERT INTO care8_companions (name, avatar, rating, review_count, location, distance, interests, hourly_rate, availability, bio, verified)
VALUES
  ('James Wilson', '', 4.9, 32, 'San Francisco, CA', '2.8 miles', ARRAY['Reading', 'Board Games', 'Walks'], '$22-25', 'Weekday afternoons, Weekends', 'Retired teacher who enjoys meaningful conversations and helping seniors stay socially active.', true),
  ('Sophia Martinez', '', 4.8, 24, 'Oakland, CA', '6.2 miles', ARRAY['Cooking', 'Gardening', 'Movies'], '$20-24', 'Flexible Schedule', 'Compassionate companion with experience in memory care and engaging activities for seniors.', true),
  ('Robert Taylor', '', 4.7, 18, 'Daly City, CA', '8.5 miles', ARRAY['Music', 'Chess', 'History'], '$22-26', 'Mornings and Evenings', 'Former musician who specializes in bringing joy through music therapy and memory exercises.', false),
  ('Emma Johnson', '', 5.0, 16, 'San Jose, CA', '14.3 miles', ARRAY['Art', 'Crafts', 'Nature'], '$24-28', 'Weekends, Evenings', 'Art therapist with a passion for helping seniors express themselves through creative activities.', true);

-- Insert sample data for Care8 Legal Experts
INSERT INTO care8_legal_experts (name, avatar, rating, review_count, location, distance, specialties, rate, consultation_types, years_experience, bio, verified)
VALUES
  ('Amanda Chen, Esq.', '', 4.9, 42, 'San Francisco, CA', '1.4 miles', ARRAY['Elder Law', 'Estate Planning'], '$200-250/hr', ARRAY['In-person', 'Virtual'], 15, 'Specialized in elder law and estate planning with focus on ensuring seniors receive proper care and financial protection.', true),
  ('Richard Thompson, J.D.', '', 4.8, 37, 'Oakland, CA', '7.3 miles', ARRAY['Healthcare Law', 'Medicare/Medicaid'], '$225-275/hr', ARRAY['Virtual', 'Phone'], 20, 'Expert in healthcare law and navigating the complex Medicare/Medicaid systems for seniors and their families.', true),
  ('Lisa Hernandez, Esq.', '', 5.0, 29, 'San Mateo, CA', '11.8 miles', ARRAY['Guardianship', 'Elder Abuse'], '$180-220/hr', ARRAY['In-person', 'Virtual', 'Phone'], 12, 'Passionate advocate for elder rights with extensive experience in guardianship matters and elder abuse cases.', true),
  ('Marcus Williams, J.D.', '', 4.7, 31, 'Palo Alto, CA', '18.5 miles', ARRAY['Estate Planning', 'Trusts'], '$250-300/hr', ARRAY['Virtual'], 25, 'Specializing in complex estate planning and trust creation with a focus on asset protection and tax efficiency.', false);

-- Insert sample data for Care8 Care Facilities
INSERT INTO care8_care_facilities (name, type, image, address, distance, rating, review_count, price_range, beds, available_beds, amenities, medical_services, description, phone)
VALUES
  ('Sunshine Senior Living', 'Assisted Living', '/images/facility1.jpg', '123 Care Lane, San Francisco, CA', '3.2 miles', 4.8, 56, '$3,500 - $5,200/month', 120, 5, ARRAY['24/7 Staff', 'Memory Care', 'Dining', 'Activities', 'Transportation', 'Housekeeping'], ARRAY['Medication Management', 'Physical Therapy', 'Nurse on Staff'], 'Upscale assisted living facility with a focus on active retirement and personalized care plans.', '(415) 555-1234'),
  ('Golden Years Memory Care', 'Memory Care', '/images/facility2.jpg', '456 Elder Ave, Oakland, CA', '7.8 miles', 4.9, 41, '$5,800 - $7,500/month', 60, 2, ARRAY['Secure Environment', 'Specialized Staff', 'Memory Activities', 'Private Rooms', 'Gardens'], ARRAY['Memory Care Specialists', 'Nursing Staff 24/7', 'Medication Management', 'Behavior Management'], 'Specialized memory care facility with secure environments and trained staff for Alzheimer''s and dementia care.', '(510) 555-6789'),
  ('Peaceful Pines Nursing Home', 'Nursing Home', '/images/facility3.jpg', '789 Care Drive, San Jose, CA', '12.5 miles', 4.6, 38, '$7,200 - $9,800/month', 90, 8, ARRAY['Private & Shared Rooms', 'Dining Services', 'Social Activities', 'Gardens', 'Lounge Areas'], ARRAY['24/7 Nursing Care', 'Rehabilitation Services', 'Pain Management', 'Post-Hospital Care', 'Long-term Care'], 'Full-service nursing home providing skilled nursing care and rehabilitation services in a comfortable setting.', '(408) 555-9012'),
  ('Independent Living Estates', 'Independent Living', '/images/facility4.jpg', '101 Freedom Lane, Palo Alto, CA', '15.3 miles', 4.7, 62, '$2,800 - $4,200/month', 150, 12, ARRAY['Private Apartments', 'Recreational Activities', 'Fitness Center', 'Community Events', 'Transportation', 'Dining Options'], ARRAY['Optional Care Services', 'Wellness Programs', 'Emergency Call System'], 'Independent living community offering maintenance-free living with amenities and optional support services.', '(650) 555-3456');

-- Insert sample data for Care8 Care Products
INSERT INTO care8_care_products (name, type, category, image, rating, review_count, price, features, description, in_stock, free_shipping, popular)
VALUES
  ('Mobility Pro Walker', 'Mobility', 'Walkers', '/images/walker.jpg', 4.8, 125, 89.99, ARRAY['Adjustable height', 'Foldable design', 'Built-in seat', 'Storage basket', '300lb weight capacity'], 'Premium walker with seat for seniors and those with limited mobility. Features an easy-fold design for transport and storage.', true, true, true),
  ('Automatic Pill Dispenser', 'Medication', 'Dispensers', '/images/pill-dispenser.jpg', 4.6, 89, 129.99, ARRAY['Programmable alarms', '14-day capacity', 'Lockable design', 'Battery backup', 'Medication alerts'], 'Automatic pill dispenser with alarms and 14 daily compartments to ensure medication is taken on schedule.', true, true, false),
  ('Digital Blood Pressure Monitor', 'Health Monitoring', 'Vitals', '/images/bp-monitor.jpg', 4.7, 213, 59.99, ARRAY['Large display', 'Memory for 60 readings', 'Irregular heartbeat detection', 'Cuff fits arms 8.7" to 16.5"', 'Portable design'], 'Easy-to-use digital blood pressure monitor with large display and memory function for tracking readings over time.', true, false, true),
  ('Premium Bed Rail', 'Bedroom', 'Safety', '/images/bed-rail.jpg', 4.5, 78, 79.99, ARRAY['Tool-free assembly', 'Adjustable length', 'Padded handle', 'Fits most beds', 'Folds down when not in use'], 'Adjustable bed rail that provides support when getting in and out of bed. Features a padded handle for comfort.', false, true, false);

-- Create indexes for better query performance
CREATE INDEX idx_care8_caregivers_specialties ON care8_caregivers USING GIN(specialties);
CREATE INDEX idx_care8_companions_interests ON care8_companions USING GIN(interests);
CREATE INDEX idx_care8_legal_experts_specialties ON care8_legal_experts USING GIN(specialties);
CREATE INDEX idx_care8_care_facilities_type ON care8_care_facilities(type);
CREATE INDEX idx_care8_care_products_type ON care8_care_products(type);
CREATE INDEX idx_care8_care_products_category ON care8_care_products(category); 