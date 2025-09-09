-- TalentNest Database Schema for University of Ilorin
-- This script creates the complete database structure with proper Supabase integration

-- Create ENUM types for better data consistency
CREATE TYPE faculty_type AS ENUM (
  'agriculture',
  'arts',
  'basic_clinical_sciences',
  'basic_medical_sciences',
  'clinical_sciences',
  'communication_information_sciences',
  'education',
  'engineering_technology',
  'environmental_sciences',
  'law',
  'life_sciences',
  'management_sciences',
  'pharmaceutical_sciences',
  'physical_sciences',
  'social_sciences',
  'veterinary_medicine'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'accepted', 
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE service_status AS ENUM (
  'active',
  'inactive',
  'pending_approval'
);

-- Added area enum for artisan student locations
CREATE TYPE area_type AS ENUM (
  'tanke',
  'sanrab',
  'oko_oba',
  'basin',
  'stadium_road',
  'fate'
);

-- Update users table to use Supabase auth integration
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  matric_number VARCHAR(20) UNIQUE NOT NULL, -- Format: 20-52hl077
  email VARCHAR(255) UNIQUE NOT NULL, -- Auto-generated: matric@students.unilorin.edu.ng
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15),
  whatsapp_number VARCHAR(15),
  faculty faculty_type NOT NULL,
  department VARCHAR(100) NOT NULL,
  level VARCHAR(10) NOT NULL, -- 100L, 200L, etc.
  area area_type, -- For artisan students location
  bio TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}', -- Array of skills
  portfolio_links TEXT[] DEFAULT '{}', -- Array of portfolio URLs
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  total_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Added constraint to ensure email matches matric number format
  CONSTRAINT valid_unilorin_email CHECK (email LIKE '%@students.unilorin.edu.ng')
);

-- Create service categories table with proper structure
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update services table with proper relationships and constraints
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'hourly', 'negotiable'
  delivery_time VARCHAR(50) NOT NULL, -- e.g., "2-3 days"
  requirements TEXT DEFAULT '',
  portfolio_items TEXT[] DEFAULT '{}', -- Array of portfolio URLs/images
  status service_status DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update bookings table with enhanced structure
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT DEFAULT '',
  agreed_price DECIMAL(10,2),
  status booking_status DEFAULT 'pending',
  whatsapp_chat_initiated BOOLEAN DEFAULT FALSE,
  delivery_date DATE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table for user alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin logs table for audit trail
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'service', 'booking', etc.
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_matric_number ON public.users(matric_number);
CREATE INDEX IF NOT EXISTS idx_users_faculty ON public.users(faculty);
CREATE INDEX IF NOT EXISTS idx_users_area ON public.users(area); -- Added index for area field
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON public.reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
