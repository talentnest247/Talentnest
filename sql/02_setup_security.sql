-- =====================================================
-- STEP 2: SETUP SECURITY & RLS POLICIES
-- Run this file SECOND in Supabase SQL Editor
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

-- Categories policies
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

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ STEP 2 COMPLETE: All RLS policies created!';
  RAISE NOTICE 'Next: Run 03_setup_functions.sql';
END $$;
