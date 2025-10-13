-- =====================================================
-- FIX: RLS POLICIES FOR ADMIN ACCESS
-- =====================================================
-- Run this to allow admin API to fetch all providers

-- Allow service role full access (for admin API endpoints)
DROP POLICY IF EXISTS "Service role bypass RLS" ON public.providers;
CREATE POLICY "Service role bypass RLS" ON public.providers
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role bypass RLS users" ON public.users;
CREATE POLICY "Service role bypass RLS users" ON public.users
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow public read access to approved providers (for marketplace)
DROP POLICY IF EXISTS "Public can view approved providers" ON public.providers;
CREATE POLICY "Public can view approved providers" ON public.providers
    FOR SELECT 
    USING (verification_status = 'approved');

-- Allow public read access to user profiles of approved providers
DROP POLICY IF EXISTS "Public can view provider user profiles" ON public.users;
CREATE POLICY "Public can view provider user profiles" ON public.users
    FOR SELECT 
    USING (
        id IN (
            SELECT user_id FROM public.providers WHERE verification_status = 'approved'
        )
    );

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('users', 'providers')
ORDER BY tablename, policyname;
