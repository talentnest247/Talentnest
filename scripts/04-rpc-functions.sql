-- RPC Functions for TalentNest
-- These functions are called from the application to perform atomic operations

-- Function to increment service views count
CREATE OR REPLACE FUNCTION increment_service_views(service_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.services 
  SET views_count = COALESCE(views_count, 0) + 1,
      updated_at = NOW()
  WHERE id = service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment service orders count
CREATE OR REPLACE FUNCTION increment_service_orders(service_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.services 
  SET orders_count = COALESCE(orders_count, 0) + 1,
      updated_at = NOW()
  WHERE id = service_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user rating based on reviews
CREATE OR REPLACE FUNCTION update_user_rating(user_id UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  review_count INTEGER;
BEGIN
  SELECT 
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, review_count
  FROM public.reviews 
  WHERE reviewee_id = user_id;
  
  UPDATE public.users 
  SET 
    rating = avg_rating,
    total_reviews = review_count,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get service statistics
CREATE OR REPLACE FUNCTION get_service_stats(service_id UUID)
RETURNS TABLE(
  total_bookings BIGINT,
  completed_bookings BIGINT,
  average_rating DECIMAL(3,2),
  total_reviews BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as total_reviews
  FROM public.services s
  LEFT JOIN public.bookings b ON s.id = b.service_id
  LEFT JOIN public.reviews r ON b.id = r.booking_id
  WHERE s.id = service_id
  GROUP BY s.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search services with full-text search
CREATE OR REPLACE FUNCTION search_services(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 12,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  category service_category,
  price_range TEXT,
  delivery_time TEXT,
  images TEXT[],
  tags TEXT[],
  is_active BOOLEAN,
  views_count INTEGER,
  orders_count INTEGER,
  created_at TIMESTAMPTZ,
  user_id UUID,
  user_full_name TEXT,
  user_profile_image TEXT,
  user_rating DECIMAL(3,2),
  user_total_reviews INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.description,
    s.category,
    s.price_range,
    s.delivery_time,
    s.images,
    s.tags,
    s.is_active,
    s.views_count,
    s.orders_count,
    s.created_at,
    s.user_id,
    u.full_name as user_full_name,
    u.profile_image_url as user_profile_image,
    u.rating as user_rating,
    u.total_reviews as user_total_reviews
  FROM public.services s
  JOIN public.users u ON s.user_id = u.id
  WHERE 
    s.is_active = true
    AND (
      s.title ILIKE '%' || search_query || '%' 
      OR s.description ILIKE '%' || search_query || '%'
      OR search_query = ANY(s.tags)
    )
    AND (category_filter IS NULL OR s.category::TEXT = category_filter)
  ORDER BY s.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
