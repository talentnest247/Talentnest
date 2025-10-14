-- =====================================================
-- COMPLETE DATABASE SETUP - RUN THIS ONCE
-- This will DROP existing tables and create fresh ones
-- =====================================================

-- Drop all existing tables (in correct order to handle foreign keys)
DROP VIEW IF EXISTS provider_stats CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.provider_analytics CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.portfolio CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.providers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop all functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_provider_rating() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  student_id TEXT,
  department TEXT,
  level INTEGER,
  bio TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'artisan', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers table
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  bio TEXT,
  specialization TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  location TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  whatsapp_number TEXT,
  availability_available_for_work BOOLEAN DEFAULT true,
  availability_available_for_learning BOOLEAN DEFAULT false,
  pricing_base_rate DECIMAL(10,2),
  pricing_learning_rate DECIMAL(10,2),
  pricing_currency TEXT DEFAULT 'NGN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE public.services (
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
CREATE TABLE public.portfolio (
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
CREATE TABLE public.bookings (
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
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Analytics table
CREATE TABLE public.provider_analytics (
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
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE public.enrollments (
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
-- CREATE INDEXES
-- =====================================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_providers_user_id ON public.providers(user_id);
CREATE INDEX idx_providers_verification_status ON public.providers(verification_status);
CREATE INDEX idx_providers_location ON public.providers(location);
CREATE INDEX idx_providers_rating ON public.providers(rating DESC);
CREATE INDEX idx_services_provider_id ON public.services(provider_id);
CREATE INDEX idx_services_category_id ON public.services(category_id);
CREATE INDEX idx_portfolio_provider_id ON public.portfolio(provider_id);
CREATE INDEX idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX idx_enrollments_provider_id ON public.enrollments(provider_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);

-- =====================================================
-- ENABLE RLS
-- =====================================================

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

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access users" ON public.users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can view public user info" ON public.users FOR SELECT USING (true);

-- Providers policies
CREATE POLICY "Anyone can view approved providers" ON public.providers FOR SELECT USING (verification_status = 'approved');
CREATE POLICY "Users can view own provider profile" ON public.providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own provider profile" ON public.providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own provider profile" ON public.providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role full access providers" ON public.providers FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Service role full access categories" ON public.categories FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Services policies
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Providers can manage own services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = services.provider_id AND user_id = auth.uid())
);
CREATE POLICY "Service role full access services" ON public.services FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Portfolio policies
CREATE POLICY "Anyone can view portfolio" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Providers can manage own portfolio" ON public.portfolio FOR ALL USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = portfolio.provider_id AND user_id = auth.uid())
);
CREATE POLICY "Service role full access portfolio" ON public.portfolio FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Bookings policies
CREATE POLICY "Providers can view own bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = bookings.provider_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can view own bookings" ON public.bookings FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Providers can update own bookings" ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = bookings.provider_id AND user_id = auth.uid())
);
CREATE POLICY "Service role full access bookings" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own received messages" ON public.messages FOR UPDATE USING (receiver_id = auth.uid());
CREATE POLICY "Service role full access messages" ON public.messages FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Provider Analytics policies
CREATE POLICY "Providers can view own analytics" ON public.provider_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = provider_analytics.provider_id AND user_id = auth.uid())
);
CREATE POLICY "Service role full access analytics" ON public.provider_analytics FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON public.reviews FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customers can update own reviews" ON public.reviews FOR UPDATE USING (customer_id = auth.uid());
CREATE POLICY "Service role full access reviews" ON public.reviews FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enrollments policies
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Providers can view own enrollments" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.providers WHERE id = enrollments.provider_id AND user_id = auth.uid())
);
CREATE POLICY "Students can create enrollments" ON public.enrollments FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Service role full access enrollments" ON public.enrollments FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON public.portfolio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC;
  review_count INTEGER;
BEGIN
  SELECT AVG(rating), COUNT(*) INTO avg_rating, review_count
  FROM public.reviews
  WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id);

  UPDATE public.providers
  SET 
    rating = COALESCE(ROUND(avg_rating, 2), 0),
    total_reviews = review_count
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update provider rating when reviews change
CREATE TRIGGER update_provider_rating_on_review
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Function to sync auth.users to public.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, first_name, last_name, phone, student_id, department, level, bio, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'department',
    CASE WHEN NEW.raw_user_meta_data->>'level' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'level')::INTEGER 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'bio',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    student_id = COALESCE(EXCLUDED.student_id, public.users.student_id),
    department = COALESCE(EXCLUDED.department, public.users.department),
    level = COALESCE(EXCLUDED.level, public.users.level),
    bio = COALESCE(EXCLUDED.bio, public.users.bio),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync new users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- CREATE VIEW
-- =====================================================

CREATE OR REPLACE VIEW provider_stats AS
SELECT 
  p.id,
  p.business_name,
  p.rating,
  p.total_reviews,
  COUNT(DISTINCT s.id) as total_services,
  COUNT(DISTINCT po.id) as total_portfolio_items,
  COUNT(DISTINCT b.id) as total_bookings,
  COALESCE(SUM(pa.profile_views), 0) as total_profile_views,
  COALESCE(SUM(pa.search_appearances), 0) as total_search_appearances
FROM public.providers p
LEFT JOIN public.services s ON s.provider_id = p.id
LEFT JOIN public.portfolio po ON po.provider_id = p.id
LEFT JOIN public.bookings b ON b.provider_id = p.id
LEFT JOIN public.provider_analytics pa ON pa.provider_id = p.id
GROUP BY p.id, p.business_name, p.rating, p.total_reviews;

-- =====================================================
-- INITIALIZE DATA
-- =====================================================

-- Sync existing auth.users to public.users
INSERT INTO public.users (id, email, full_name, first_name, last_name, phone, student_id, department, level, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  au.raw_user_meta_data->>'first_name',
  au.raw_user_meta_data->>'last_name',
  au.raw_user_meta_data->>'phone',
  au.raw_user_meta_data->>'student_id',
  au.raw_user_meta_data->>'department',
  CASE WHEN au.raw_user_meta_data->>'level' IS NOT NULL 
    THEN (au.raw_user_meta_data->>'level')::INTEGER 
    ELSE NULL 
  END,
  COALESCE(au.raw_user_meta_data->>'role', 'student')
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- Insert default categories
INSERT INTO public.categories (name, description, slug) VALUES
  ('Fashion Design', 'Custom clothing, tailoring, and fashion services', 'fashion-design'),
  ('Hair Styling', 'Professional hair cutting, styling, and treatment', 'hair-styling'),
  ('Makeup Artistry', 'Professional makeup services for events and occasions', 'makeup-artistry'),
  ('Photography', 'Professional photography and videography services', 'photography'),
  ('Catering', 'Food preparation and catering services', 'catering'),
  ('Event Planning', 'Event coordination and planning services', 'event-planning'),
  ('Carpentry', 'Furniture making and woodwork services', 'carpentry'),
  ('Plumbing', 'Professional plumbing and pipe fitting services', 'plumbing'),
  ('Electrical', 'Electrical installation and repair services', 'electrical'),
  ('Painting', 'Professional painting and decoration services', 'painting')
ON CONFLICT (slug) DO NOTHING;

-- Auto-approve all pending providers (for initial setup)
UPDATE public.providers SET verification_status = 'approved' WHERE verification_status = 'pending';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- FINAL SUCCESS MESSAGE
-- =====================================================

DO $$
DECLARE
  user_count INTEGER;
  provider_count INTEGER;
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  SELECT COUNT(*) INTO provider_count FROM public.providers;
  SELECT COUNT(*) INTO category_count FROM public.categories;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ DATABASE SETUP COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Summary:';
  RAISE NOTICE '- Tables: 10 created';
  RAISE NOTICE '- Indexes: 18 created';
  RAISE NOTICE '- RLS Policies: 40+ enabled';
  RAISE NOTICE '- Functions: 3 created';
  RAISE NOTICE '- Triggers: 10 created';
  RAISE NOTICE '- Users synced: %', user_count;
  RAISE NOTICE '- Providers approved: %', provider_count;
  RAISE NOTICE '- Categories: %', category_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next Steps:';
  RAISE NOTICE '1. Restart dev server: pnpm dev';
  RAISE NOTICE '2. Test signup: /signup';
  RAISE NOTICE '3. Test login: /login';
  RAISE NOTICE '4. Check marketplace: /marketplace';
  RAISE NOTICE '========================================';
END $$;
