-- =====================================================
-- TALENTNEST: ENHANCED DASHBOARD DATABASE SETUP (FIXED)
-- Purpose: Add portfolio, bookings, and messages tables
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- SECTION 1: PORTFOLIO TABLE
-- =====================================================

-- Drop existing table if needed to recreate
DROP TABLE IF EXISTS public.portfolio CASCADE;

CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  file_type VARCHAR(20) CHECK (file_type IN ('image', 'video', 'document')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes after table is created
CREATE INDEX idx_portfolio_provider_id ON public.portfolio(provider_id);
CREATE INDEX idx_portfolio_created_at ON public.portfolio(created_at DESC);

-- Enable RLS
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can manage own portfolio" ON public.portfolio;
CREATE POLICY "Providers can manage own portfolio"
ON public.portfolio FOR ALL
TO authenticated
USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can view all portfolio items" ON public.portfolio;
CREATE POLICY "Public can view all portfolio items"
ON public.portfolio FOR SELECT
TO public
USING (true);

-- =====================================================
-- SECTION 2: BOOKINGS TABLE
-- =====================================================

-- Drop existing table if needed to recreate
DROP TABLE IF EXISTS public.bookings CASCADE;

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_description TEXT,
  requirements TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected')),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'NGN',
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  start_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  provider_notes TEXT,
  student_notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX idx_bookings_due_date ON public.bookings(due_date);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can view their bookings" ON public.bookings;
CREATE POLICY "Providers can view their bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Students can view their bookings" ON public.bookings;
CREATE POLICY "Students can view their bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can create bookings" ON public.bookings;
CREATE POLICY "Students can create bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Providers can update their bookings" ON public.bookings;
CREATE POLICY "Providers can update their bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Students can update their own bookings" ON public.bookings;
CREATE POLICY "Students can update their own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (student_id = auth.uid());

-- =====================================================
-- SECTION 3: MESSAGES TABLE
-- =====================================================

-- Drop existing table if needed to recreate
DROP TABLE IF EXISTS public.messages CASCADE;

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  starred BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  attachment_url TEXT,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_messages_from_user_id ON public.messages(from_user_id);
CREATE INDEX idx_messages_to_user_id ON public.messages(to_user_id);
CREATE INDEX idx_messages_read ON public.messages(read) WHERE read = false;
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(from_user_id, to_user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages sent to them" ON public.messages;
CREATE POLICY "Users can view messages sent to them"
ON public.messages FOR SELECT
TO authenticated
USING (to_user_id = auth.uid() OR from_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (from_user_id = auth.uid());

DROP POLICY IF EXISTS "Recipients can mark messages as read" ON public.messages;
CREATE POLICY "Recipients can mark messages as read"
ON public.messages FOR UPDATE
TO authenticated
USING (to_user_id = auth.uid())
WITH CHECK (to_user_id = auth.uid());

-- =====================================================
-- SECTION 4: ANALYTICS TABLE
-- =====================================================

-- Drop existing table if needed to recreate
DROP TABLE IF EXISTS public.provider_analytics CASCADE;

CREATE TABLE public.provider_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('profile_view', 'contact_click', 'whatsapp_click', 'portfolio_view', 'service_view')),
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_analytics_provider_id ON public.provider_analytics(provider_id);
CREATE INDEX idx_analytics_event_type ON public.provider_analytics(event_type);
CREATE INDEX idx_analytics_created_at ON public.provider_analytics(created_at DESC);
CREATE INDEX idx_analytics_provider_event ON public.provider_analytics(provider_id, event_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.provider_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can view their own analytics" ON public.provider_analytics;
CREATE POLICY "Providers can view their own analytics"
ON public.provider_analytics FOR SELECT
TO authenticated
USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.provider_analytics;
CREATE POLICY "Anyone can insert analytics events"
ON public.provider_analytics FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =====================================================
-- SECTION 5: REVIEWS TABLE
-- =====================================================

-- Drop existing table if needed to recreate
DROP TABLE IF EXISTS public.reviews CASCADE;

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
  value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
  would_recommend BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  provider_response TEXT,
  provider_response_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX idx_reviews_student_id ON public.reviews(student_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Students can create reviews for their bookings" ON public.reviews;
CREATE POLICY "Students can create reviews for their bookings"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid() 
  AND (booking_id IS NULL OR booking_id IN (SELECT id FROM public.bookings WHERE student_id = auth.uid() AND status = 'completed'))
);

DROP POLICY IF EXISTS "Students can update their own reviews" ON public.reviews;
CREATE POLICY "Students can update their own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Providers can respond to reviews" ON public.reviews;
CREATE POLICY "Providers can respond to reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()))
WITH CHECK (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

-- =====================================================
-- SECTION 6: TRIGGER FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_portfolio_updated_at 
BEFORE UPDATE ON public.portfolio
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update provider rating when review is added/updated
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.providers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE provider_id = NEW.provider_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_provider_rating_on_review
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Auto-mark message as read when read_at is set
CREATE OR REPLACE FUNCTION mark_message_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read_at IS NOT NULL AND (OLD.read_at IS NULL OR OLD.read_at <> NEW.read_at) THEN
    NEW.read = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mark_message_read_trigger
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION mark_message_read();

-- =====================================================
-- SECTION 7: HELPER VIEWS
-- =====================================================

DROP VIEW IF EXISTS provider_stats;
CREATE OR REPLACE VIEW provider_stats AS
SELECT 
  p.id as provider_id,
  p.user_id,
  p.business_name,
  p.rating,
  p.total_reviews,
  
  -- Booking stats
  COUNT(DISTINCT b.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_bookings,
  COUNT(DISTINCT CASE WHEN b.status = 'pending' THEN b.id END) as pending_bookings,
  COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.amount END), 0) as total_earnings,
  
  -- Analytics stats (last 30 days)
  COUNT(DISTINCT CASE 
    WHEN pa.event_type = 'profile_view' 
    AND pa.created_at > NOW() - INTERVAL '30 days' 
    THEN pa.id 
  END) as profile_views_30d,
  
  COUNT(DISTINCT CASE 
    WHEN pa.event_type = 'contact_click' 
    AND pa.created_at > NOW() - INTERVAL '30 days' 
    THEN pa.id 
  END) as contact_clicks_30d,
  
  -- Message stats
  COUNT(DISTINCT CASE 
    WHEN m.to_user_id = p.user_id 
    AND m.read = false 
    THEN m.id 
  END) as unread_messages,
  
  -- Response rate calculation
  CASE 
    WHEN COUNT(DISTINCT CASE WHEN m.to_user_id = p.user_id THEN m.id END) > 0 
    THEN ROUND(
      100.0 * COUNT(DISTINCT CASE 
        WHEN m.to_user_id = p.user_id 
        AND EXISTS (
          SELECT 1 FROM public.messages reply 
          WHERE reply.from_user_id = p.user_id 
          AND reply.to_user_id = m.from_user_id
          AND reply.created_at BETWEEN m.created_at AND m.created_at + INTERVAL '24 hours'
        )
        THEN m.id 
      END)::NUMERIC 
      / COUNT(DISTINCT CASE WHEN m.to_user_id = p.user_id THEN m.id END)
    )
    ELSE 0
  END as response_rate
  
FROM public.providers p
LEFT JOIN public.bookings b ON b.provider_id = p.id
LEFT JOIN public.provider_analytics pa ON pa.provider_id = p.id
LEFT JOIN public.messages m ON m.to_user_id = p.user_id OR m.from_user_id = p.user_id
GROUP BY p.id, p.user_id, p.business_name, p.rating, p.total_reviews;

-- =====================================================
-- SECTION 8: VERIFICATION & SUCCESS MESSAGE
-- =====================================================

DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('portfolio', 'bookings', 'messages', 'provider_analytics', 'reviews');
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Tables created: % of 5', table_count;
  RAISE NOTICE '==========================================';
  
  IF table_count = 5 THEN
    RAISE NOTICE '✅ SUCCESS: All enhanced dashboard tables created!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Create storage bucket named "portfolio" (make it public)';
    RAISE NOTICE '2. Replace page.tsx with page-enhanced.tsx';
    RAISE NOTICE '3. Test the dashboard at /providers/dashboard';
    RAISE NOTICE '';
  ELSE
    RAISE WARNING '⚠️ WARNING: Expected 5 tables, found %', table_count;
    RAISE WARNING 'Some tables may already exist. Check table list below.';
  END IF;
END $$;

-- Show all new tables with row counts
SELECT 
  'portfolio' as table_name,
  COUNT(*) as row_count
FROM public.portfolio
UNION ALL
SELECT 'bookings', COUNT(*) FROM public.bookings
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages
UNION ALL
SELECT 'provider_analytics', COUNT(*) FROM public.provider_analytics
UNION ALL
SELECT 'reviews', COUNT(*) FROM public.reviews
ORDER BY table_name;

-- =====================================================
-- END OF ENHANCED DASHBOARD DATABASE SETUP
-- =====================================================
