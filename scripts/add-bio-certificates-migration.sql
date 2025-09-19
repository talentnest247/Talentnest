-- Enhanced Migration for Comprehensive Artisan Verification System
-- This ensures admin approval is required for all artisan information before showing to students
-- Includes matric number, business name, certificates, and bio verification

-- Add bio column to providers table (REQUIRED for artisans)
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add certificates column to providers table (array of text for storing URLs)
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS certificates TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add verification tracking columns
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS verification_reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_reviewed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS matric_number_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS business_name_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS certificates_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS bio_verified BOOLEAN DEFAULT FALSE;

-- Ensure verification_status defaults to 'pending' for new artisans
ALTER TABLE providers 
ALTER COLUMN verification_status SET DEFAULT 'pending';

-- Add constraint to ensure bio is required for artisans
ALTER TABLE providers 
ADD CONSTRAINT providers_bio_required CHECK (
  bio IS NOT NULL AND LENGTH(TRIM(bio)) > 0
);

-- Add constraint to ensure certificates are required for artisans
ALTER TABLE providers 
ADD CONSTRAINT providers_certificates_required CHECK (
  certificates IS NOT NULL AND array_length(certificates, 1) > 0
);

-- Add comprehensive verification status constraint
ALTER TABLE providers 
ADD CONSTRAINT providers_verification_complete CHECK (
  verification_status IN ('pending', 'approved', 'rejected') AND
  (verification_status != 'approved' OR (
    matric_number_verified = TRUE AND
    business_name_verified = TRUE AND
    certificates_verified = TRUE AND
    bio_verified = TRUE
  ))
);

-- Add comments for documentation
COMMENT ON COLUMN providers.bio IS 'Professional bio/background of the artisan provider (REQUIRED)';
COMMENT ON COLUMN providers.certificates IS 'Array of URLs pointing to uploaded certificate files (REQUIRED)';
COMMENT ON COLUMN providers.verification_submitted_at IS 'When the artisan submitted their verification request';
COMMENT ON COLUMN providers.verification_reviewed_at IS 'When admin reviewed the verification request';
COMMENT ON COLUMN providers.verification_reviewed_by IS 'Admin user who reviewed the verification';
COMMENT ON COLUMN providers.verification_notes IS 'Admin notes about the verification decision';
COMMENT ON COLUMN providers.matric_number_verified IS 'Whether student matric number has been verified by admin';
COMMENT ON COLUMN providers.business_name_verified IS 'Whether business name has been verified by admin';
COMMENT ON COLUMN providers.certificates_verified IS 'Whether uploaded certificates have been verified by admin';
COMMENT ON COLUMN providers.bio_verified IS 'Whether professional bio has been verified by admin';

-- Update existing providers to have empty certificates array if null
UPDATE providers 
SET certificates = ARRAY[]::TEXT[] 
WHERE certificates IS NULL;

-- Set initial verification flags for existing providers
UPDATE providers 
SET 
  matric_number_verified = CASE WHEN verified = TRUE THEN TRUE ELSE FALSE END,
  business_name_verified = CASE WHEN verified = TRUE THEN TRUE ELSE FALSE END,
  certificates_verified = CASE WHEN verified = TRUE THEN TRUE ELSE FALSE END,
  bio_verified = CASE WHEN verified = TRUE THEN TRUE ELSE FALSE END
WHERE verification_submitted_at IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_providers_certificates 
ON providers USING GIN (certificates);

CREATE INDEX IF NOT EXISTS idx_providers_bio_search 
ON providers USING GIN (to_tsvector('english', bio));

CREATE INDEX IF NOT EXISTS idx_providers_verification_status 
ON providers (verification_status, verified);

CREATE INDEX IF NOT EXISTS idx_providers_verification_pending 
ON providers (verification_submitted_at) 
WHERE verification_status = 'pending';

-- Create a view for verified artisans only (what students should see)
CREATE OR REPLACE VIEW verified_artisans AS
SELECT 
  p.*,
  u.first_name,
  u.last_name,
  u.full_name,
  u.email,
  u.student_id as matric_number,
  u.department
FROM providers p
JOIN users u ON p.user_id = u.id
WHERE 
  p.verification_status = 'approved' 
  AND p.verified = TRUE
  AND p.matric_number_verified = TRUE
  AND p.business_name_verified = TRUE
  AND p.certificates_verified = TRUE
  AND p.bio_verified = TRUE;

-- Create a view for admin verification dashboard
CREATE OR REPLACE VIEW admin_verification_queue AS
SELECT 
  p.*,
  u.first_name,
  u.last_name,
  u.full_name,
  u.email,
  u.student_id as matric_number,
  u.department,
  admin.full_name as reviewed_by_name
FROM providers p
JOIN users u ON p.user_id = u.id
LEFT JOIN users admin ON p.verification_reviewed_by = admin.id
WHERE p.verification_status IN ('pending', 'rejected')
ORDER BY p.verification_submitted_at ASC;

-- Create function to automatically set verification submission timestamp
CREATE OR REPLACE FUNCTION set_verification_submitted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status = 'pending' AND OLD.verification_submitted_at IS NULL THEN
    NEW.verification_submitted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for verification submission
CREATE TRIGGER trigger_set_verification_submitted_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION set_verification_submitted_at();

-- Grant permissions for the views
GRANT SELECT ON verified_artisans TO authenticated;
GRANT SELECT ON admin_verification_queue TO authenticated;
