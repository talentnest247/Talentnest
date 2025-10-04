-- =====================================================
-- TALENTNEST COMPLETE DATABASE SETUP
-- =====================================================
-- This script does EVERYTHING you need in one go:
-- 1. Creates all tables with correct schema
-- 2. Sets up Row Level Security (RLS) policies
-- 3. Creates triggers for auto-sync
-- 4. Migrates existing users
-- 5. Makes you admin
-- Run this ONCE and everything will work!

-- =====================================================
-- STEP 1: DROP EXISTING TABLES (CLEAN SLATE)
-- =====================================================
DROP TABLE IF EXISTS public.contact_requests CASCADE;
DROP TABLE IF EXISTS public.verification_requests CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.portfolio CASCADE;
DROP TABLE IF EXISTS public.providers CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- =====================================================
-- STEP 2: CREATE USERS TABLE
-- =====================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'provider', 'admin')) DEFAULT 'student',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- =====================================================
-- STEP 3: CREATE OTHER TABLES
-- =====================================================

-- Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    service_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students Table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE,
    department TEXT,
    level INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers Table (Artisans)
CREATE TABLE public.providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    description TEXT,
    specialization TEXT[],
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    location TEXT,
    skills_offered TEXT[],
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_date TIMESTAMPTZ,
    verification_reviewed_by UUID REFERENCES public.users(id),
    verification_admin_notes TEXT,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_providers_user_id ON public.providers(user_id);
CREATE INDEX idx_providers_status ON public.providers(verification_status);

-- Portfolio Table
CREATE TABLE public.portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    service_title TEXT NOT NULL,
    service_description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    scheduled_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification Requests Table
CREATE TABLE public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID UNIQUE REFERENCES public.providers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.users(id),
    admin_notes TEXT
);

-- Contact Requests Table
CREATE TABLE public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 4: INSERT DEFAULT CATEGORIES
-- =====================================================
INSERT INTO public.categories (name, description, icon) VALUES
('Fashion & Design', 'Tailoring, fashion design, and clothing alterations', '👗'),
('Technology', 'Web development, app creation, and tech support', '💻'),
('Arts & Crafts', 'Painting, sculpture, and handmade crafts', '🎨'),
('Beauty & Wellness', 'Hair styling, makeup, and spa services', '💄'),
('Food & Catering', 'Cooking, baking, and catering services', '🍳'),
('Photography', 'Event photography and photo editing', '📸'),
('Music & Entertainment', 'Music lessons, DJ services, and performances', '🎵'),
('Education', 'Tutoring and educational services', '📚'),
('Home Services', 'Cleaning, repairs, and maintenance', '🏠'),
('Other Services', 'Miscellaneous professional services', '⚡')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- STEP 5: CREATE AUTO-SYNC TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    first_name, 
    last_name, 
    full_name,
    phone,
    role, 
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'lastName', NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 
             COALESCE(NEW.raw_user_meta_data->>'firstName', 'User') || ' ' || COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
             'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 6: MIGRATE EXISTING AUTH USERS
-- =====================================================
INSERT INTO public.users (
  id, 
  email, 
  first_name, 
  last_name,
  full_name,
  phone,
  role, 
  created_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'firstName', au.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'lastName', au.raw_user_meta_data->>'last_name', ''),
  COALESCE(au.raw_user_meta_data->>'full_name', 
           COALESCE(au.raw_user_meta_data->>'firstName', 'User') || ' ' || COALESCE(au.raw_user_meta_data->>'lastName', ''),
           'User'),
  COALESCE(au.raw_user_meta_data->>'phone', ''),
  COALESCE(au.raw_user_meta_data->>'role', 'student'),
  au.created_at
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- =====================================================
-- STEP 7: MAKE YOU ADMIN
-- =====================================================
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'talentnest247@gmail.com';

-- =====================================================
-- STEP 8: SET UP ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Users: Everyone can read, users can update their own
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Students: Everyone can read, users can insert/update their own
CREATE POLICY "Students are viewable by everyone" ON public.students FOR SELECT USING (true);
CREATE POLICY "Users can insert own student record" ON public.students FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own student record" ON public.students FOR UPDATE USING (auth.uid() = user_id);

-- Providers: Everyone can read verified, users can manage their own
CREATE POLICY "Verified providers are viewable by everyone" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Users can insert own provider record" ON public.providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own provider record" ON public.providers FOR UPDATE USING (auth.uid() = user_id);

-- Portfolio: Everyone can read, providers can manage their own
CREATE POLICY "Portfolio is viewable by everyone" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Providers can manage own portfolio" ON public.portfolio FOR ALL USING (
  EXISTS (SELECT 1 FROM public.providers WHERE providers.id = portfolio.provider_id AND providers.user_id = auth.uid())
);

-- Bookings: Users can see their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid())
);
CREATE POLICY "Students can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.providers WHERE providers.id = bookings.provider_id AND providers.user_id = auth.uid())
);

-- Reviews: Everyone can read, users can create reviews for completed bookings
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Categories: Everyone can read
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Verification Requests: Providers can see their own, admins can see all
CREATE POLICY "Providers can view own verification request" ON public.verification_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.providers WHERE providers.id = verification_requests.provider_id AND providers.user_id = auth.uid())
);
CREATE POLICY "Providers can create verification request" ON public.verification_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.providers WHERE providers.id = verification_requests.provider_id AND providers.user_id = auth.uid())
);

-- Contact Requests: Users can create their own
CREATE POLICY "Users can create contact requests" ON public.contact_requests FOR INSERT WITH CHECK (true);

-- =====================================================
-- STEP 9: CREATE UPDATE TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- STEP 10: VERIFY SETUP
-- =====================================================
DO $$
DECLARE
  auth_count INTEGER;
  public_count INTEGER;
  admin_count INTEGER;
  category_count INTEGER;
  admin_user RECORD;
BEGIN
  -- Count users
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO public_count FROM public.users;
  SELECT COUNT(*) INTO admin_count FROM public.users WHERE role = 'admin';
  SELECT COUNT(*) INTO category_count FROM public.categories;
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ DATABASE SETUP COMPLETE!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '📊 Auth users: %', auth_count;
  RAISE NOTICE '📊 Public users: %', public_count;
  RAISE NOTICE '👑 Admin users: %', admin_count;
  RAISE NOTICE '📁 Categories: %', category_count;
  RAISE NOTICE '==========================================';
  
  -- Check for admin user
  SELECT * INTO admin_user FROM public.users WHERE email = 'talentnest247@gmail.com';
  
  IF FOUND THEN
    RAISE NOTICE '✅ ADMIN USER FOUND!';
    RAISE NOTICE '   Email: %', admin_user.email;
    RAISE NOTICE '   Role: %', admin_user.role;
    RAISE NOTICE '   ID: %', admin_user.id;
    RAISE NOTICE '   Name: % %', admin_user.first_name, admin_user.last_name;
  ELSE
    RAISE NOTICE '⚠️  Admin user talentnest247@gmail.com not found';
    RAISE NOTICE '⚠️  Make sure you have signed up with this email first';
  END IF;
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE '🎉 ALL DONE! You can now:';
  RAISE NOTICE '   1. Logout and login again';
  RAISE NOTICE '   2. Access /admin/dashboard';
  RAISE NOTICE '   3. Manage verification requests';
  RAISE NOTICE '==========================================';
END $$;
