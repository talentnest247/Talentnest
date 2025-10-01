-- Enhanced TalentNest Marketplace Database Schema
-- This extends the existing schema with full marketplace functionality

-- Add columns to existing profiles table for enhanced features
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_images TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_videos TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_links TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'offline';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_for_learning BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_on_campus TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills_offered TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specializations TEXT[];

-- Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    parent_category_id UUID REFERENCES service_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table (what providers offer)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES service_categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price_type VARCHAR(20) DEFAULT 'fixed', -- fixed, hourly, negotiable
    base_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    delivery_time INTEGER, -- in days
    images TEXT[],
    tags TEXT[],
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Requests/Bookings Table
CREATE TABLE IF NOT EXISTS service_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES services(id),
    seeker_id UUID REFERENCES profiles(id),
    provider_id UUID REFERENCES profiles(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10,2),
    deadline DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, in_progress, completed, cancelled, disputed
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, escrowed, released, refunded
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- In-App Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES service_bookings(id),
    sender_id UUID REFERENCES profiles(id),
    receiver_id UUID REFERENCES profiles(id),
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file, system
    content TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Reviews Table (replacing simple reviews)
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES service_bookings(id),
    reviewer_id UUID REFERENCES profiles(id),
    reviewee_id UUID REFERENCES profiles(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    helpful_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet/Payment System
CREATE TABLE IF NOT EXISTS wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) UNIQUE,
    balance DECIMAL(12,2) DEFAULT 0.00,
    total_earned DECIMAL(12,2) DEFAULT 0.00,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction History
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id),
    booking_id UUID REFERENCES service_bookings(id),
    transaction_type VARCHAR(50), -- topup, escrow, release, refund, commission
    amount DECIMAL(12,2) NOT NULL,
    fee DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    reference VARCHAR(100) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Sessions (for mentorship/training)
CREATE TABLE IF NOT EXISTS learning_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID REFERENCES profiles(id),
    student_id UUID REFERENCES profiles(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    skill_category VARCHAR(100),
    session_type VARCHAR(50), -- one-on-one, group, workshop
    duration INTEGER, -- in minutes
    price DECIMAL(10,2),
    scheduled_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    location VARCHAR(200),
    meeting_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Endorsements (peer skills validation)
CREATE TABLE IF NOT EXISTS endorsements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endorser_id UUID REFERENCES profiles(id),
    endorsee_id UUID REFERENCES profiles(id),
    skill VARCHAR(100) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(endorser_id, endorsee_id, skill)
);

-- Notifications System
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    type VARCHAR(50), -- booking, message, payment, review, endorsement, system
    title VARCHAR(200) NOT NULL,
    content TEXT,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disputes/Reports
CREATE TABLE IF NOT EXISTS disputes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES service_bookings(id),
    complainant_id UUID REFERENCES profiles(id),
    respondent_id UUID REFERENCES profiles(id),
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT[], -- file URLs
    status VARCHAR(50) DEFAULT 'open', -- open, investigating, resolved, closed
    admin_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search Analytics (for recommendations)
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    search_query TEXT,
    category_searched UUID REFERENCES service_categories(id),
    filters_applied JSONB,
    results_count INTEGER,
    clicked_provider_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default service categories
INSERT INTO service_categories (name, description, icon) VALUES
('Digital Services', 'Web design, graphic design, programming, content creation', 'monitor'),
('Artisan Services', 'Fashion design, tailoring, crafts, repairs', 'scissors'),
('Academic Support', 'Tutoring, assignment help, research assistance', 'book-open'),
('Beauty & Wellness', 'Hair styling, makeup, fitness training', 'heart'),
('Photography & Video', 'Event photography, video editing, photo retouching', 'camera'),
('Writing & Translation', 'Content writing, editing, translation services', 'pen-tool'),
('Business Services', 'Marketing, consulting, data entry', 'briefcase'),
('Music & Arts', 'Music lessons, art creation, performance', 'music'),
('Tech Support', 'Computer repair, software installation, tech tutorials', 'cpu'),
('Event Services', 'Event planning, decoration, MC services', 'calendar')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_seeker ON service_bookings(seeker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON service_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- Add triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON service_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();