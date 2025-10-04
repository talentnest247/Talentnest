-- ⚡ EMERGENCY FIX - Run this in Supabase SQL Editor NOW!
-- This creates the minimum tables needed for your app to work

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if users table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE public.users (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            full_name VARCHAR(255),
            phone VARCHAR(20),
            role VARCHAR(20) DEFAULT 'student',
            profile_image TEXT,
            student_id VARCHAR(20),
            department VARCHAR(100),
            level VARCHAR(20),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        
        -- Create policy
        CREATE POLICY "Users viewable by all" ON public.users FOR SELECT USING (true);
        CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
        
        RAISE NOTICE 'users table created successfully';
    ELSE
        RAISE NOTICE 'users table already exists';
    END IF;
END$$;

-- Check if providers table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'providers') THEN
        CREATE TABLE public.providers (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
            business_name VARCHAR(200) NOT NULL,
            description TEXT,
            bio TEXT,
            specialization TEXT[],
            experience_years INTEGER DEFAULT 0,
            location VARCHAR(200),
            rating DECIMAL(3,2) DEFAULT 0,
            total_reviews INTEGER DEFAULT 0,
            verified BOOLEAN DEFAULT FALSE,
            verification_status VARCHAR(20) DEFAULT 'pending',
            verification_evidence TEXT[],
            certificates TEXT[],
            verification_reviewed_at TIMESTAMP WITH TIME ZONE,
            verification_reviewed_by UUID REFERENCES public.users(id),
            verification_notes TEXT,
            whatsapp_number VARCHAR(20),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Providers viewable by all" ON public.providers FOR SELECT USING (true);
        CREATE POLICY "Providers can update own profile" ON public.providers FOR UPDATE USING (auth.uid() = user_id);
        
        RAISE NOTICE 'providers table created successfully';
    ELSE
        RAISE NOTICE 'providers table already exists';
    END IF;
END$$;

-- Check if categories table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
        CREATE TABLE public.categories (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            icon VARCHAR(50),
            color VARCHAR(20),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Categories viewable by all" ON public.categories FOR SELECT USING (true);
        
        -- Insert sample categories
        INSERT INTO public.categories (name, slug, description, icon, color) VALUES
        ('Fashion & Tailoring', 'fashion-tailoring', 'Custom clothing and fashion services', 'Scissors', '#F59E0B'),
        ('Tech & Digital', 'tech-digital', 'Web development and digital services', 'Laptop', '#3B82F6'),
        ('Beauty & Wellness', 'beauty-wellness', 'Hair, makeup, and wellness services', 'Sparkles', '#8B5CF6'),
        ('Creative Services', 'creative-services', 'Design, photography, and art', 'Palette', '#EC4899'),
        ('Food & Catering', 'food-catering', 'Cooking and catering services', 'ChefHat', '#F97316'),
        ('Tutoring', 'tutoring', 'Academic tutoring and teaching', 'BookOpen', '#6366F1');
        
        RAISE NOTICE 'categories table created and populated';
    ELSE
        RAISE NOTICE 'categories table already exists';
    END IF;
END$$;

-- Check if reviews table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
        CREATE TABLE public.reviews (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
            provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);
        CREATE POLICY "Students can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = student_id);
        
        RAISE NOTICE 'reviews table created';
    ELSE
        RAISE NOTICE 'reviews table already exists';
    END IF;
END$$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Emergency database setup complete!';
    RAISE NOTICE '📝 Now restart your dev server: pnpm dev';
END$$;
