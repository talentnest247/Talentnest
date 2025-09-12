-- TalentNest Complete Database Setup Script
-- Run this script in your Supabase SQL editor to set up the complete database

-- 1. Create ENUM types for better data consistency
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'artisan', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('business_certificate', 'id_document', 'trade_certificate', 'portfolio', 'certificate', 'bio_document', 'supporting_document', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create or update users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'student',
  full_name TEXT,
  phone TEXT,
  matric_number TEXT,
  faculty TEXT,
  department TEXT,
  level TEXT,
  school TEXT,
  field_of_study TEXT,
  year_of_study INTEGER,
  profile_image_url TEXT,
  bio TEXT,
  skills TEXT[],
  portfolio_links TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to ensure unique matric_number for students
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS unique_student_matric;
ALTER TABLE public.users ADD CONSTRAINT unique_student_matric 
  UNIQUE(matric_number) DEFERRABLE INITIALLY DEFERRED;

-- 3. Create artisan_profiles table
CREATE TABLE IF NOT EXISTS public.artisan_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  matric_number TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_registration_number TEXT,
  trade_category TEXT NOT NULL,
  years_of_experience INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(matric_number)
);

-- 4. Create artisan_documents table
CREATE TABLE IF NOT EXISTS public.artisan_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artisan_id UUID NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT
);

-- 5. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price_range TEXT,
  delivery_time TEXT,
  images TEXT[],
  tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  agreed_price TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  whatsapp_chat_initiated BOOLEAN DEFAULT FALSE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id)
);

-- 9. Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('artisan-documents', 'artisan-documents', false),
  ('service-images', 'service-images', true),
  ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 10. Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Public can view active users" ON public.users;

DROP POLICY IF EXISTS "Users can view their own artisan profile" ON public.artisan_profiles;
DROP POLICY IF EXISTS "Users can update their own artisan profile" ON public.artisan_profiles;
DROP POLICY IF EXISTS "Admins can view all artisan profiles" ON public.artisan_profiles;
DROP POLICY IF EXISTS "Public can view approved artisan profiles" ON public.artisan_profiles;

DROP POLICY IF EXISTS "Artisans can manage their documents" ON public.artisan_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.artisan_documents;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view active users" ON public.users
  FOR SELECT USING (is_active = TRUE AND is_verified = TRUE);

-- Artisan profiles policies
CREATE POLICY "Users can view their own artisan profile" ON public.artisan_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own artisan profile" ON public.artisan_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own artisan profile" ON public.artisan_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all artisan profiles" ON public.artisan_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Public can view approved artisan profiles" ON public.artisan_profiles
  FOR SELECT USING (verification_status = 'approved');

-- Artisan documents policies
CREATE POLICY "Artisans can manage their documents" ON public.artisan_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.artisan_profiles 
      WHERE id = artisan_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents" ON public.artisan_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services table policies
CREATE POLICY "Users can manage their own services" ON public.services
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = TRUE);

-- Bookings table policies
CREATE POLICY "Users can view their bookings" ON public.bookings
  FOR SELECT USING (client_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Providers can update their bookings" ON public.bookings
  FOR UPDATE USING (provider_id = auth.uid());

-- Reviews table policies
CREATE POLICY "Users can view reviews" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND 
      (client_id = auth.uid() OR provider_id = auth.uid()) AND
      status = 'completed'
    )
  );

-- Categories table policies
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. Storage policies for file uploads

-- Artisan documents storage policies
CREATE POLICY "Artisans can upload their documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'artisan-documents' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Artisans can view their documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'artisan-documents' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can view all artisan documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'artisan-documents' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service images storage policies
CREATE POLICY "Users can upload service images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view service images" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

-- Profile images storage policies
CREATE POLICY "Users can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

-- 12. Create useful functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.users;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.artisan_profiles;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.services;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.bookings;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. Insert default categories
INSERT INTO public.categories (name, description, type) VALUES
  ('Carpentry', 'Wood working and furniture making', 'artisan'),
  ('Plumbing', 'Water and pipe system services', 'artisan'),
  ('Electrical Work', 'Electrical installation and repairs', 'artisan'),
  ('Tailoring & Fashion', 'Clothing design and alteration', 'artisan'),
  ('Hair Styling & Beauty', 'Beauty and grooming services', 'artisan'),
  ('Auto Repair & Mechanics', 'Vehicle maintenance and repair', 'artisan'),
  ('Electronics Repair', 'Electronic device repair services', 'artisan'),
  ('Photography & Videography', 'Media production services', 'digital'),
  ('Graphic Design', 'Visual design and branding', 'digital'),
  ('Web Development', 'Website and application development', 'digital'),
  ('Tutoring & Education', 'Academic support and teaching', 'tutoring'),
  ('Mathematics', 'Math tutoring and problem solving', 'tutoring'),
  ('Sciences', 'Physics, Chemistry, Biology tutoring', 'tutoring'),
  ('Languages', 'Language learning and translation', 'tutoring'),
  ('Computer Science', 'Programming and CS concepts', 'tutoring')
ON CONFLICT (name) DO NOTHING;

-- 14. Create admin user function (optional - run after creating your first user)
CREATE OR REPLACE FUNCTION public.make_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET role = 'admin', is_verified = TRUE, is_active = TRUE
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant storage permissions
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT ALL ON storage.buckets TO anon, authenticated;

-- Final message
DO $$
BEGIN
  RAISE NOTICE 'TalentNest database setup completed successfully!';
  RAISE NOTICE 'To create an admin user, run: SELECT public.make_admin(''your-email@example.com'');';
  RAISE NOTICE 'Make sure to configure your Supabase authentication settings.';
END
$$;
