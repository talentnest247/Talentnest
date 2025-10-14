-- =====================================================-- Add foreign key constraint

-- TALENTNEST: COMPLETE DATABASE SETUPDO $$ 

-- This file creates ALL tables, policies, and functionsBEGIN 

-- Run this ONCE in Supabase SQL Editor  IF NOT EXISTS (

-- =====================================================    SELECT 1 FROM information_schema.table_constraints 

    WHERE constraint_name = 'providers_user_id_fkey'

-- =====================================================  ) THEN 

-- PART 1: CORE TABLES    ALTER TABLE public.providers 

-- =====================================================    ADD CONSTRAINT providers_user_id_fkey 

    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE; 

-- Users table (extends auth.users)  END IF; 

CREATE TABLE IF NOT EXISTS public.users (END $$;

  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  email TEXT UNIQUE NOT NULL,-- Sync auth users to public users

  full_name TEXT,INSERT INTO public.users (id, email, full_name, created_at, updated_at)

  first_name TEXT,SELECT 

  last_name TEXT,  au.id, 

  avatar_url TEXT,  au.email, 

  phone TEXT,  COALESCE(au.raw_user_meta_data->>'full_name', au.email), 

  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'artisan', 'admin')),  au.created_at, 

  created_at TIMESTAMPTZ DEFAULT NOW(),  NOW()

  updated_at TIMESTAMPTZ DEFAULT NOW()FROM auth.users au

);WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id)

ON CONFLICT (id) DO NOTHING;

-- Providers table

CREATE TABLE IF NOT EXISTS public.providers (-- Approve all pending providers

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),UPDATE public.providers 

  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,SET verification_status = 'approved', verified = true, updated_at = NOW()

  business_name TEXT NOT NULL,WHERE verification_status = 'pending';

  description TEXT,

  bio TEXT,-- Fix RLS policies

  specialization TEXT[] DEFAULT '{}',DROP POLICY IF EXISTS "Allow service role full access" ON public.providers;

  experience INTEGER DEFAULT 0,CREATE POLICY "Allow service role full access" ON public.providers FOR ALL TO service_role USING (true) WITH CHECK (true);

  location TEXT,

  rating DECIMAL(3,2) DEFAULT 0.0,DROP POLICY IF EXISTS "Users can view approved providers" ON public.providers;

  total_reviews INTEGER DEFAULT 0,CREATE POLICY "Users can view approved providers" ON public.providers FOR SELECT USING (verification_status = 'approved');

  verified BOOLEAN DEFAULT false,

  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),DROP POLICY IF EXISTS "Users can view own provider profile" ON public.providers;

  whatsapp_number TEXT,CREATE POLICY "Users can view own provider profile" ON public.providers FOR SELECT USING (auth.uid() = user_id);

  availability_available_for_work BOOLEAN DEFAULT true,

  availability_available_for_learning BOOLEAN DEFAULT false,DROP POLICY IF EXISTS "Users can update own provider profile" ON public.providers;

  pricing_base_rate DECIMAL(10,2),CREATE POLICY "Users can update own provider profile" ON public.providers FOR UPDATE USING (auth.uid() = user_id);

  pricing_learning_rate DECIMAL(10,2),

  pricing_currency TEXT DEFAULT 'NGN',DROP POLICY IF EXISTS "Users can insert own provider profile" ON public.providers;

  created_at TIMESTAMPTZ DEFAULT NOW(),CREATE POLICY "Users can insert own provider profile" ON public.providers FOR INSERT WITH CHECK (auth.uid() = user_id);

  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)-- Force schema reload

);NOTIFY pgrst, 'reload schema';



-- Categories table-- Show result

CREATE TABLE IF NOT EXISTS public.categories (DO $$ 

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),DECLARE 

  name TEXT NOT NULL UNIQUE,  v_approved INT;

  description TEXT,BEGIN

  icon TEXT,  SELECT COUNT(*) INTO v_approved FROM public.providers WHERE verification_status = 'approved';

  created_at TIMESTAMPTZ DEFAULT NOW()  RAISE NOTICE 'SUCCESS! Approved providers: %', v_approved;

);  RAISE NOTICE 'Next: Restart server (Ctrl+C then pnpm dev)';

END $$;

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  project_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Analytics table
CREATE TABLE IF NOT EXISTS public.provider_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  profile_views INTEGER DEFAULT 0,
  search_appearances INTEGER DEFAULT 0,
  bookings_received INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, date)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table (for learning sessions)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 2: INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_providers_user_id ON public.providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_verification_status ON public.providers(verification_status);
CREATE INDEX IF NOT EXISTS idx_providers_location ON public.providers(location);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON public.providers(rating DESC);

CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);

CREATE INDEX IF NOT EXISTS idx_portfolio_provider_id ON public.portfolio(provider_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON public.portfolio(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON public.bookings(scheduled_date DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

CREATE INDEX IF NOT EXISTS idx_provider_analytics_provider_id ON public.provider_analytics(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_analytics_date ON public.provider_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

CREATE INDEX IF NOT EXISTS idx_enrollments_provider_id ON public.enrollments(provider_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON public.enrollments(student_id);

-- =====================================================
-- PART 3: ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role full access users" ON public.users;
CREATE POLICY "Service role full access users" ON public.users FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view public user info" ON public.users;
CREATE POLICY "Anyone can view public user info" ON public.users FOR SELECT USING (true);

-- Providers policies
DROP POLICY IF EXISTS "Anyone can view approved providers" ON public.providers;
CREATE POLICY "Anyone can view approved providers" ON public.providers FOR SELECT USING (verification_status = 'approved');

DROP POLICY IF EXISTS "Users can view own provider profile" ON public.providers;
CREATE POLICY "Users can view own provider profile" ON public.providers FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own provider profile" ON public.providers;
CREATE POLICY "Users can update own provider profile" ON public.providers FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own provider profile" ON public.providers;
CREATE POLICY "Users can insert own provider profile" ON public.providers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access providers" ON public.providers;
CREATE POLICY "Service role full access providers" ON public.providers FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Categories policies (public read)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access categories" ON public.categories;
CREATE POLICY "Service role full access categories" ON public.categories FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Services policies
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Providers can manage own services" ON public.services;
CREATE POLICY "Providers can manage own services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = services.provider_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Service role full access services" ON public.services;
CREATE POLICY "Service role full access services" ON public.services FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Portfolio policies
DROP POLICY IF EXISTS "Anyone can view portfolio" ON public.portfolio;
CREATE POLICY "Anyone can view portfolio" ON public.portfolio FOR SELECT USING (true);

DROP POLICY IF EXISTS "Providers can manage own portfolio" ON public.portfolio;
CREATE POLICY "Providers can manage own portfolio" ON public.portfolio FOR ALL USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = portfolio.provider_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Service role full access portfolio" ON public.portfolio;
CREATE POLICY "Service role full access portfolio" ON public.portfolio FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Bookings policies
DROP POLICY IF EXISTS "Providers can view own bookings" ON public.bookings;
CREATE POLICY "Providers can view own bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = bookings.provider_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
CREATE POLICY "Customers can view own bookings" ON public.bookings FOR SELECT USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Providers can update own bookings" ON public.bookings;
CREATE POLICY "Providers can update own bookings" ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = bookings.provider_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Service role full access bookings" ON public.bookings;
CREATE POLICY "Service role full access bookings" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Messages policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own received messages" ON public.messages;
CREATE POLICY "Users can update own received messages" ON public.messages FOR UPDATE USING (receiver_id = auth.uid());

DROP POLICY IF EXISTS "Service role full access messages" ON public.messages;
CREATE POLICY "Service role full access messages" ON public.messages FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Provider Analytics policies
DROP POLICY IF EXISTS "Providers can view own analytics" ON public.provider_analytics;
CREATE POLICY "Providers can view own analytics" ON public.provider_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = provider_analytics.provider_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Service role full access analytics" ON public.provider_analytics;
CREATE POLICY "Service role full access analytics" ON public.provider_analytics FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can create reviews" ON public.reviews;
CREATE POLICY "Customers can create reviews" ON public.reviews FOR INSERT WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can update own reviews" ON public.reviews;
CREATE POLICY "Customers can update own reviews" ON public.reviews FOR UPDATE USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Service role full access reviews" ON public.reviews;
CREATE POLICY "Service role full access reviews" ON public.reviews FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enrollments policies
DROP POLICY IF EXISTS "Students can view own enrollments" ON public.enrollments;
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Providers can view own enrollments" ON public.enrollments;
CREATE POLICY "Providers can view own enrollments" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = enrollments.provider_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can create enrollments" ON public.enrollments;
CREATE POLICY "Students can create enrollments" ON public.enrollments FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Service role full access enrollments" ON public.enrollments;
CREATE POLICY "Service role full access enrollments" ON public.enrollments FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================================================
-- PART 4: TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_providers_updated_at ON public.providers;
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_updated_at ON public.portfolio;
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON public.portfolio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON public.enrollments;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.providers
  SET 
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE provider_id = NEW.provider_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE provider_id = NEW.provider_id)
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_provider_rating_trigger ON public.reviews;
CREATE TRIGGER update_provider_rating_trigger AFTER INSERT OR UPDATE OR DELETE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Function to sync auth.users to public.users on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.created_at,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- PART 5: VIEWS FOR COMPLEX QUERIES
-- =====================================================

-- Provider stats view
CREATE OR REPLACE VIEW public.provider_stats AS
SELECT 
  p.id,
  p.user_id,
  p.business_name,
  p.rating,
  p.total_reviews,
  COUNT(DISTINCT b.id) AS total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) AS completed_bookings,
  COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0) AS total_earnings,
  COALESCE(SUM(pa.profile_views), 0) AS total_views,
  COUNT(DISTINCT m.id) FILTER (WHERE m.receiver_id = p.user_id AND m.is_read = false) AS unread_messages
FROM public.providers p
LEFT JOIN public.bookings b ON b.provider_id = p.id
LEFT JOIN public.provider_analytics pa ON pa.provider_id = p.id
LEFT JOIN public.messages m ON m.receiver_id = p.user_id
GROUP BY p.id, p.user_id, p.business_name, p.rating, p.total_reviews;

-- =====================================================
-- PART 6: INITIAL DATA SYNC AND SETUP
-- =====================================================

-- Sync all existing auth.users to public.users
INSERT INTO public.users (id, email, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  au.created_at,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- Auto-approve all pending providers
UPDATE public.providers 
SET verification_status = 'approved', verified = true, updated_at = NOW()
WHERE verification_status = 'pending';

-- Insert default categories
INSERT INTO public.categories (name, description, icon)
VALUES
  ('Fashion Design', 'Tailoring, fashion design, and clothing', '👗'),
  ('Hair Styling', 'Hair cutting, styling, and treatment', '💇'),
  ('Makeup', 'Makeup artistry and beauty services', '💄'),
  ('Photography', 'Photography and videography services', '📸'),
  ('Catering', 'Food and catering services', '🍽️'),
  ('Event Planning', 'Event planning and decoration', '🎉'),
  ('Carpentry', 'Woodworking and furniture making', '🔨'),
  ('Plumbing', 'Plumbing and pipe fitting', '🔧'),
  ('Electrical', 'Electrical installation and repairs', '⚡'),
  ('Painting', 'House painting and decoration', '🎨')
ON CONFLICT (name) DO NOTHING;

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- PART 7: SUMMARY
-- =====================================================

DO $$ 
DECLARE 
  v_users INT;
  v_providers INT;
  v_approved INT;
  v_categories INT;
  v_tables INT;
BEGIN
  SELECT COUNT(*) INTO v_users FROM public.users;
  SELECT COUNT(*) INTO v_providers FROM public.providers;
  SELECT COUNT(*) INTO v_approved FROM public.providers WHERE verification_status = 'approved';
  SELECT COUNT(*) INTO v_categories FROM public.categories;
  SELECT COUNT(*) INTO v_tables FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ COMPLETE DATABASE SETUP SUCCESSFUL';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables Created: %', v_tables;
  RAISE NOTICE 'Users: % | Providers: % | Approved: %', v_users, v_providers, v_approved;
  RAISE NOTICE 'Categories: %', v_categories;
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ All tables, indexes, and policies created';
  RAISE NOTICE '✅ All triggers and functions installed';
  RAISE NOTICE '✅ Auth sync enabled for new signups';
  RAISE NOTICE '✅ RLS policies active on all tables';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '1. Restart your dev server: Ctrl+C then pnpm dev';
  RAISE NOTICE '2. Users can now sign up and sign in';
  RAISE NOTICE '3. Visit /marketplace to see providers';
  RAISE NOTICE '4. Admin can access /admin/dashboard';
  RAISE NOTICE '========================================';
END $$;
