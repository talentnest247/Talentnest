-- =====================================================
-- TalentNest Database Setup - PRD-Aligned Schema
-- =====================================================
-- Run this script in your Supabase SQL editor
-- This schema follows the PRD requirements exactly

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DROP EXISTING TABLES (if any)
-- =====================================================
DROP TABLE IF EXISTS public.portfolio CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.verification_requests CASCADE;
DROP TABLE IF EXISTS public.contact_requests CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.providers CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'provider', 'admin')),
    profile_image TEXT,
    student_id VARCHAR(20), -- For student verification
    department VARCHAR(100),
    level VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'rejected')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table (for student-specific data)
CREATE TABLE public.students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    year_of_study INTEGER,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table (for organizing providers by type of service)
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    provider_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Providers table (service providers - the main focus of the platform)
CREATE TABLE public.providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    bio TEXT,
    specialization TEXT[] NOT NULL, -- Array of categories they work in
    experience_years INTEGER DEFAULT 0,
    location VARCHAR(200) NOT NULL,
    
    -- Ratings and reviews
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_evidence TEXT[], -- URLs to uploaded evidence
    certificates TEXT[], -- URLs to uploaded certificates
    verification_reviewed_at TIMESTAMP WITH TIME ZONE,
    verification_reviewed_by UUID REFERENCES public.users(id),
    verification_notes TEXT,
    
    -- Availability (key PRD requirement)
    is_available BOOLEAN DEFAULT TRUE,
    available_for_work BOOLEAN DEFAULT TRUE,
    available_for_learning BOOLEAN DEFAULT FALSE, -- Toggle for offering training
    response_time VARCHAR(100) DEFAULT 'Usually responds within 24 hours',
    
    -- Pricing
    service_rate DECIMAL(10,2),
    learning_rate DECIMAL(10,2), -- Rate for training/teaching
    currency VARCHAR(10) DEFAULT 'NGN',
    
    -- Contact
    whatsapp_number VARCHAR(20) NOT NULL, -- For WhatsApp CTA
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio table (showcase work - key PRD requirement)
CREATE TABLE public.portfolio (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    images TEXT[] NOT NULL, -- Array of image URLs
    category VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE, -- For highlighting best work
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table (for tracking service requests)
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
    service_type VARCHAR(20) DEFAULT 'direct_service' CHECK (service_type IN ('direct_service', 'training')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (for ratings and feedback - key PRD requirement)
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    student_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_type VARCHAR(20) DEFAULT 'direct_service' CHECK (service_type IN ('direct_service', 'training')),
    verified BOOLEAN DEFAULT TRUE, -- All reviews are verified since users must be students
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification requests table (for admin verification process)
CREATE TABLE public.verification_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    evidence_files TEXT[] NOT NULL, -- URLs to uploaded evidence
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.users(id)
);

-- Contact requests table (for tracking WhatsApp contacts)
CREATE TABLE public.contact_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
    service_type VARCHAR(20) DEFAULT 'direct_service' CHECK (service_type IN ('direct_service', 'training')),
    contact_method VARCHAR(20) DEFAULT 'whatsapp',
    message_preview TEXT,
    contacted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_received BOOLEAN DEFAULT FALSE,
    booking_completed BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_student_id ON public.users(student_id);

CREATE INDEX idx_providers_verified ON public.providers(verified);
CREATE INDEX idx_providers_available ON public.providers(is_available);
CREATE INDEX idx_providers_location ON public.providers(location);
CREATE INDEX idx_providers_rating ON public.providers(rating);
CREATE INDEX idx_providers_specialization ON public.providers USING GIN(specialization);

CREATE INDEX idx_portfolio_provider_id ON public.portfolio(provider_id);
CREATE INDEX idx_portfolio_featured ON public.portfolio(featured);

CREATE INDEX idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

CREATE INDEX idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Providers policies
CREATE POLICY "Providers are viewable by everyone" ON public.providers
    FOR SELECT USING (true);

CREATE POLICY "Providers can update own profile" ON public.providers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Providers can insert own profile" ON public.providers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Portfolio policies
CREATE POLICY "Portfolio is viewable by everyone" ON public.portfolio
    FOR SELECT USING (true);

CREATE POLICY "Providers can manage own portfolio" ON public.portfolio
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.providers WHERE id = provider_id));

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Students can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = (SELECT user_id FROM public.providers WHERE id = provider_id));

CREATE POLICY "Students can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Admin policies (for verification)
CREATE POLICY "Admins can manage verification" ON public.verification_requests
    FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update provider rating when reviews are added
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.providers 
    SET 
        rating = (SELECT AVG(rating) FROM public.reviews WHERE provider_id = NEW.provider_id),
        total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE provider_id = NEW.provider_id)
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_provider_rating_trigger 
    AFTER INSERT ON public.reviews 
    FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Function to update category provider count
CREATE OR REPLACE FUNCTION update_category_provider_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update counts for affected categories
    UPDATE public.categories 
    SET provider_count = (
        SELECT COUNT(DISTINCT p.id) 
        FROM public.providers p 
        WHERE p.specialization && ARRAY[categories.name]
    );
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_category_count_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.providers 
    FOR EACH STATEMENT EXECUTE FUNCTION update_category_provider_count();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert categories (more inclusive and comprehensive)
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Creative Services', 'creative-services', 'Graphic design, photography, content creation, and artistic services', 'Palette', '#EC4899'),
('Tech & Digital', 'tech-digital', 'Web development, app creation, digital marketing, and tech support', 'Laptop', '#3B82F6'),
('Beauty & Wellness', 'beauty-wellness', 'Hair styling, makeup, skincare, and personal wellness services', 'Sparkles', '#8B5CF6'),
('Fashion & Style', 'fashion-style', 'Clothing design, tailoring, styling, and fashion consultation', 'Scissors', '#F59E0B'),
('Home Services', 'home-services', 'Cleaning, organization, maintenance, and home improvement', 'Home', '#10B981'),
('Food & Catering', 'food-catering', 'Cooking, baking, meal prep, and event catering services', 'ChefHat', '#F97316'),
('Tutoring & Education', 'tutoring-education', 'Academic tutoring, skill teaching, and educational support', 'BookOpen', '#6366F1'),
('Event Services', 'event-services', 'Event planning, decoration, photography, and entertainment', 'Calendar', '#84CC16'),
('Writing & Content', 'writing-content', 'Copywriting, editing, translation, and content creation', 'PenTool', '#059669'),
('Business Support', 'business-support', 'Virtual assistance, data entry, social media management', 'Briefcase', '#6B7280'),
('Fitness & Sports', 'fitness-sports', 'Personal training, sports coaching, and fitness consultation', 'Dumbbell', '#EF4444'),
('Other Services', 'other-services', 'Miscellaneous services and specialized offerings', 'MoreHorizontal', '#64748B');

-- Note: Sample users and providers should be added through the application
-- to ensure proper authentication and password hashing