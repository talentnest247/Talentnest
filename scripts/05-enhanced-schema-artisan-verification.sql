-- TalentNest Enhanced Database Schema with Artisan Verification System
-- This script creates the enhanced database structure for dual-role system

-- Create ENUM types for better data consistency
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

-- Drop existing tables if they exist to recreate with new structure
DROP TABLE IF EXISTS public.artisan_documents CASCADE;
DROP TABLE IF EXISTS public.artisan_profiles CASCADE;

-- Update users table structure
ALTER TABLE public.users DROP COLUMN IF EXISTS matricNumber CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS fullName CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS phoneNumber CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS whatsappNumber CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS profileImageUrl CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS isVerified CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS isActive CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS totalReviews CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS createdAt CASCADE;
ALTER TABLE public.users DROP COLUMN IF EXISTS updatedAt CASCADE;

-- Add new columns with proper naming convention
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS matric_number TEXT,
  ADD COLUMN IF NOT EXISTS school TEXT,
  ADD COLUMN IF NOT EXISTS field_of_study TEXT,
  ADD COLUMN IF NOT EXISTS year_of_study INTEGER,
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create artisan_profiles table for verified artisan information
-- Create artisan_profiles table
CREATE TABLE public.artisan_profiles (
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

-- Create artisan_documents table for uploaded verification documents
CREATE TABLE IF NOT EXISTS public.artisan_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  document_type document_type DEFAULT 'other',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for artisan documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artisan-documents', 'artisan-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Update services table to work with new user structure
ALTER TABLE public.services DROP COLUMN IF EXISTS userId CASCADE;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Update bookings table to work with new user structure  
ALTER TABLE public.bookings DROP COLUMN IF EXISTS serviceId CASCADE;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS clientId CASCADE;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS providerId CASCADE;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS createdAt CASCADE;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS updatedAt CASCADE;

ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update reviews table structure
ALTER TABLE public.reviews DROP COLUMN IF EXISTS bookingId CASCADE;
ALTER TABLE public.reviews DROP COLUMN IF EXISTS reviewerId CASCADE;
ALTER TABLE public.reviews DROP COLUMN IF EXISTS revieweeId CASCADE;
ALTER TABLE public.reviews DROP COLUMN IF EXISTS createdAt CASCADE;

ALTER TABLE public.reviews 
  ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS reviewee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_verification_status ON public.artisan_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_trade_category ON public.artisan_profiles(trade_category);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_user_id ON public.artisan_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artisan_documents_artisan_id ON public.artisan_documents(artisan_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_artisan_profiles_updated_at ON public.artisan_profiles;
CREATE TRIGGER update_artisan_profiles_updated_at BEFORE UPDATE ON public.artisan_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
