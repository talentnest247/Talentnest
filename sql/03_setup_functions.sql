-- =====================================================
-- STEP 3: SETUP FUNCTIONS, TRIGGERS & INITIAL DATA
-- Run this file THIRD (final step) in Supabase SQL Editor
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on all tables
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

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON public.enrollments;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
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
DROP TRIGGER IF EXISTS update_provider_rating_on_review ON public.reviews;
CREATE TRIGGER update_provider_rating_on_review
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Function to sync auth.users to public.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- View for provider statistics
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

-- Sync existing auth.users to public.users
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  COALESCE(au.raw_user_meta_data->>'role', 'student')
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- Auto-approve all pending providers (for initial setup)
UPDATE public.providers SET verification_status = 'approved' WHERE verification_status = 'pending';

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

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Final success message with summary
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
  RAISE NOTICE '- Users synced: %', user_count;
  RAISE NOTICE '- Providers approved: %', provider_count;
  RAISE NOTICE '- Categories created: %', category_count;
  RAISE NOTICE '- All functions and triggers active';
  RAISE NOTICE '- All RLS policies enabled';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Restart your dev server: pnpm dev';
  RAISE NOTICE '2. Test sign up at /signup';
  RAISE NOTICE '3. Test sign in at /login';
  RAISE NOTICE '4. Check marketplace at /marketplace';
  RAISE NOTICE '========================================';
END $$;
