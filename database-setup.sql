-- =====================================================
-- TalentNest Database Setup - Complete SQL Schema
-- =====================================================
-- Run this script in your Supabase SQL editor
-- Make sure to enable RLS (Row Level Security) in your project settings

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DROP EXISTING TABLES (if any)
-- =====================================================
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.artisan_skills CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.artisans CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'artisan', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'rejected')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE public.students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    student_id VARCHAR(20) UNIQUE,
    department VARCHAR(100),
    level VARCHAR(20),
    year_of_study INTEGER,
    skills_learned TEXT[], -- Array of skill names
    total_courses INTEGER DEFAULT 0,
    completed_courses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price_range_min DECIMAL(10,2) DEFAULT 0,
    price_range_max DECIMAL(10,2) DEFAULT 0,
    duration_hours INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    prerequisites TEXT[],
    learning_outcomes TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artisans table
CREATE TABLE public.artisans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name VARCHAR(200),
    bio TEXT,
    years_experience INTEGER DEFAULT 0,
    specialization VARCHAR(200),
    location VARCHAR(200),
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_documents TEXT[], -- URLs to verification documents
    portfolio_images TEXT[], -- URLs to portfolio images
    certificates TEXT[], -- URLs to certificate images
    available_days VARCHAR(50)[], -- Array like ['monday', 'tuesday', etc.]
    available_hours VARCHAR(100), -- e.g., "9:00 AM - 5:00 PM"
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artisan Skills junction table
CREATE TABLE public.artisan_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    proficiency_level VARCHAR(20) DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_teaching INTEGER DEFAULT 0,
    price_per_hour DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(artisan_id, skill_id)
);

-- Enrollments table
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_completion_date TIMESTAMP WITH TIME ZONE,
    actual_completion_date TIMESTAMP WITH TIME ZONE,
    total_hours_planned INTEGER DEFAULT 0,
    total_hours_completed INTEGER DEFAULT 0,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,2) DEFAULT 1.0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
    location VARCHAR(200),
    notes TEXT,
    amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_students_user_id ON public.students(user_id);
CREATE INDEX idx_artisans_user_id ON public.artisans(user_id);
CREATE INDEX idx_artisans_verification_status ON public.artisans(verification_status);
CREATE INDEX idx_artisans_rating ON public.artisans(rating DESC);
CREATE INDEX idx_skills_category_id ON public.skills(category_id);
CREATE INDEX idx_skills_slug ON public.skills(slug);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_artisan_id ON public.enrollments(artisan_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_bookings_booking_date ON public.bookings(booking_date);
CREATE INDEX idx_reviews_artisan_id ON public.reviews(artisan_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow viewing basic profile info for verified artisans (needed for marketplace)
CREATE POLICY "Public can view verified artisan profiles" ON public.profiles
    FOR SELECT USING (
        role = 'artisan' AND 
        id IN (SELECT user_id FROM public.artisans WHERE verification_status = 'verified')
    );

-- Students policies
CREATE POLICY "Students can view their own data" ON public.students
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Students can update their own data" ON public.students
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Students can insert their own data" ON public.students
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (TRUE);

-- Skills policies (public read)
CREATE POLICY "Skills are viewable by everyone" ON public.skills
    FOR SELECT USING (TRUE);

-- Artisans policies
CREATE POLICY "Artisans can view their own data" ON public.artisans
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Artisans can update their own data" ON public.artisans
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Artisans can insert their own data" ON public.artisans
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Verified artisans are viewable by everyone" ON public.artisans
    FOR SELECT USING (verification_status = 'verified');

-- Artisan skills policies
CREATE POLICY "Artisan skills are viewable by everyone" ON public.artisan_skills
    FOR SELECT USING (TRUE);

CREATE POLICY "Artisans can manage their own skills" ON public.artisan_skills
    FOR ALL USING (
        artisan_id IN (
            SELECT id FROM public.artisans WHERE user_id = auth.uid()
        )
    );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        artisan_id IN (SELECT id FROM public.artisans WHERE user_id = auth.uid())
    );

CREATE POLICY "Students can create enrollments" ON public.enrollments
    FOR INSERT WITH CHECK (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update their own enrollments" ON public.enrollments
    FOR UPDATE USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        artisan_id IN (SELECT id FROM public.artisans WHERE user_id = auth.uid())
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        artisan_id IN (SELECT id FROM public.artisans WHERE user_id = auth.uid())
    );

CREATE POLICY "Students can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
        artisan_id IN (SELECT id FROM public.artisans WHERE user_id = auth.uid())
    );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (TRUE);

CREATE POLICY "Students can create reviews for their enrollments" ON public.reviews
    FOR INSERT WITH CHECK (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    );

CREATE POLICY "Students can update their own reviews" ON public.reviews
    FOR UPDATE USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update artisan rating when new review is added
CREATE OR REPLACE FUNCTION update_artisan_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.artisans
    SET 
        rating = (
            SELECT ROUND(AVG(rating::DECIMAL), 2)
            FROM public.reviews
            WHERE artisan_id = NEW.artisan_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE artisan_id = NEW.artisan_id
        )
    WHERE id = NEW.artisan_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating artisan rating
CREATE OR REPLACE TRIGGER update_artisan_rating_trigger
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_artisan_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON public.artisans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Fashion Design', 'fashion-design', 'Traditional and modern clothing design and tailoring', 'Shirt', '#8B5CF6'),
('Tailoring', 'tailoring', 'Professional clothing alterations and custom tailoring', 'Scissors', '#EF4444'),
('Crafts & Arts', 'crafts-arts', 'Traditional crafts, pottery, and artistic creations', 'Palette', '#F59E0B'),
('Beauty & Wellness', 'beauty-wellness', 'Hair styling, makeup, and wellness services', 'Heart', '#EC4899'),
('Food & Culinary', 'food-culinary', 'Cooking, baking, and culinary arts', 'ChefHat', '#10B981'),
('Technology', 'technology', 'Computer skills, web development, and digital literacy', 'Monitor', '#3B82F6'),
('Agriculture', 'agriculture', 'Farming techniques, gardening, and agricultural practices', 'Leaf', '#22C55E'),
('Business & Entrepreneurship', 'business-entrepreneurship', 'Business skills, marketing, and entrepreneurship', 'Briefcase', '#6366F1');

-- Insert sample skills
INSERT INTO public.skills (name, slug, description, category_id, price_range_min, price_range_max, duration_hours, difficulty_level, prerequisites, learning_outcomes) VALUES
('Traditional Agbada Design', 'traditional-agbada-design', 'Learn to design and create traditional Nigerian Agbada with modern touches', (SELECT id FROM public.categories WHERE slug = 'fashion-design'), 5000, 15000, 40, 'intermediate', ARRAY['Basic sewing skills', 'Pattern reading'], ARRAY['Create professional Agbada designs', 'Understand traditional measurements', 'Modern styling techniques']),
('Professional Tailoring', 'professional-tailoring', 'Master the art of professional clothing alterations and custom fits', (SELECT id FROM public.categories WHERE slug = 'tailoring'), 3000, 10000, 30, 'beginner', ARRAY[]::text[], ARRAY['Professional alteration techniques', 'Custom fitting skills', 'Quality finishing methods']),
('Adire Fabric Design', 'adire-fabric-design', 'Traditional tie-dye and resist dyeing techniques for creating beautiful fabrics', (SELECT id FROM public.categories WHERE slug = 'crafts-arts'), 2000, 8000, 25, 'beginner', ARRAY[]::text[], ARRAY['Traditional dyeing techniques', 'Pattern creation', 'Color theory application']),
('Gele Styling', 'gele-styling', 'Professional head wrap styling for various occasions and face shapes', (SELECT id FROM public.categories WHERE slug = 'beauty-wellness'), 1500, 5000, 15, 'beginner', ARRAY[]::text[], ARRAY['Various gele styles', 'Face shape analysis', 'Occasion-appropriate styling']),
('Nigerian Cuisine Mastery', 'nigerian-cuisine-mastery', 'Learn to prepare authentic Nigerian dishes with modern presentation', (SELECT id FROM public.categories WHERE slug = 'food-culinary'), 4000, 12000, 35, 'intermediate', ARRAY['Basic cooking skills'], ARRAY['Authentic recipe preparation', 'Modern plating techniques', 'Ingredient sourcing']),
('Web Development Basics', 'web-development-basics', 'Introduction to HTML, CSS, and JavaScript for beginners', (SELECT id FROM public.categories WHERE slug = 'technology'), 8000, 25000, 60, 'beginner', ARRAY[]::text[], ARRAY['Build responsive websites', 'Understand web technologies', 'Deploy web applications']),
('Organic Farming', 'organic-farming', 'Sustainable farming practices and organic crop production', (SELECT id FROM public.categories WHERE slug = 'agriculture'), 3500, 12000, 45, 'intermediate', ARRAY['Basic agriculture knowledge'], ARRAY['Organic farming techniques', 'Soil management', 'Pest control methods']),
('Small Business Management', 'small-business-management', 'Essential skills for starting and managing a small business', (SELECT id FROM public.categories WHERE slug = 'business-entrepreneurship'), 6000, 20000, 50, 'intermediate', ARRAY[]::text[], ARRAY['Business planning', 'Financial management', 'Marketing strategies']);

-- Note: Admin users and other profiles will be created through the authentication system
-- The triggers will automatically create profile records when users sign up
-- To create an admin user:
-- 1. Register normally through the app
-- 2. Then manually update the role in the database: UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@domain.com';

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('portfolios', 'portfolios', true),
('certificates', 'certificates', true),
('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Portfolio images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolios');
CREATE POLICY "Artisans can upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolios' AND auth.role() = 'authenticated');
CREATE POLICY "Artisans can update their portfolio images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Artisans can delete their portfolio images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Certificate images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Artisans can upload certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');
CREATE POLICY "Artisans can update their certificates" ON storage.objects FOR UPDATE USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Artisans can delete their certificates" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Documents are private" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload their own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own documents" ON storage.objects FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Database setup complete!
-- Next steps:
-- 1. Go to Authentication > Settings and enable email confirmations if desired
-- 2. Configure your authentication providers (Google, etc.)
-- 3. Set up your storage buckets in the Storage section
-- 4. Test the database connection from your application
-- =====================================================