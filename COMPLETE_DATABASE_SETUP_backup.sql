-- Add foreign key constraint
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'providers_user_id_fkey'
  ) THEN 
    ALTER TABLE public.providers 
    ADD CONSTRAINT providers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE; 
  END IF; 
END $$;

-- Sync auth users to public users
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

-- Approve all pending providers
UPDATE public.providers 
SET verification_status = 'approved', verified = true, updated_at = NOW()
WHERE verification_status = 'pending';

-- Fix RLS policies
DROP POLICY IF EXISTS "Allow service role full access" ON public.providers;
CREATE POLICY "Allow service role full access" ON public.providers FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view approved providers" ON public.providers;
CREATE POLICY "Users can view approved providers" ON public.providers FOR SELECT USING (verification_status = 'approved');

DROP POLICY IF EXISTS "Users can view own provider profile" ON public.providers;
CREATE POLICY "Users can view own provider profile" ON public.providers FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own provider profile" ON public.providers;
CREATE POLICY "Users can update own provider profile" ON public.providers FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own provider profile" ON public.providers;
CREATE POLICY "Users can insert own provider profile" ON public.providers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Show result
DO $$ 
DECLARE 
  v_approved INT;
BEGIN
  SELECT COUNT(*) INTO v_approved FROM public.providers WHERE verification_status = 'approved';
  RAISE NOTICE 'SUCCESS! Approved providers: %', v_approved;
  RAISE NOTICE 'Next: Restart server (Ctrl+C then pnpm dev)';
END $$;
