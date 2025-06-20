-- Add the specified user as an admin
INSERT INTO public.admins (id, email, name) 
VALUES (
  gen_random_uuid(),
  'kamalraj2030a@gmail.com',
  'Kamal Raj'
) ON CONFLICT (email) DO NOTHING;

-- Create a companies table for better job organization
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved jobs table for users
CREATE TABLE public.saved_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_email TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view companies" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their saved jobs" ON public.saved_jobs
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Anyone can submit applications" ON public.job_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view applications" ON public.job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE id = auth.uid()
    )
  );

-- Insert sample companies
INSERT INTO public.companies (name, description, website, industry, size, location) VALUES
  ('TechCorp Inc', 'Leading technology company specializing in cloud solutions', 'https://techcorp.com', 'Technology', '1000-5000', 'San Francisco, CA'),
  ('StartupXYZ', 'Innovative startup disrupting the e-commerce space', 'https://startupxyz.com', 'E-commerce', '50-200', 'Remote'),
  ('Design Studio', 'Creative agency focused on digital experiences', 'https://designstudio.com', 'Design', '10-50', 'New York, NY'),
  ('BigData Corp', 'Data analytics and business intelligence solutions', 'https://bigdata.com', 'Technology', '500-1000', 'Austin, TX'),
  ('SalesPro LLC', 'Sales enablement and CRM solutions', 'https://salespro.com', 'Software', '200-500', 'Chicago, IL');

-- Add full-text search index for jobs table (title, company, description)
CREATE INDEX IF NOT EXISTS jobs_fts_idx ON jobs USING GIN (
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(company,'') || ' ' || coalesce(description,''))
);

-- Add full-text search index for companies table (name, description, industry, location)
CREATE INDEX IF NOT EXISTS companies_fts_idx ON companies USING GIN (
  to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(industry,'') || ' ' || coalesce(location,''))
);

-- Add full-text search index for job_applications table (applicant_name, applicant_email, cover_letter)
CREATE INDEX IF NOT EXISTS job_applications_fts_idx ON job_applications USING GIN (
  to_tsvector('english', coalesce(applicant_name,'') || ' ' || coalesce(applicant_email,'') || ' ' || coalesce(cover_letter,''))
);

-- Trigger function to prevent empty job fields
CREATE OR REPLACE FUNCTION validate_job_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.title IS NULL OR trim(NEW.title) = '' THEN
    RAISE EXCEPTION 'Job title cannot be empty';
  END IF;
  IF NEW.company IS NULL OR trim(NEW.company) = '' THEN
    RAISE EXCEPTION 'Company cannot be empty';
  END IF;
  IF NEW.location IS NULL OR trim(NEW.location) = '' THEN
    RAISE EXCEPTION 'Location cannot be empty';
  END IF;
  IF NEW.salary IS NOT NULL AND trim(NEW.salary) = '' THEN
    RAISE EXCEPTION 'Salary, if provided, cannot be empty';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_job_fields ON jobs;
CREATE TRIGGER trg_validate_job_fields
  BEFORE INSERT OR UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION validate_job_fields();

-- Trigger function to prevent duplicate company names with custom error
CREATE OR REPLACE FUNCTION prevent_duplicate_company_name()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM companies WHERE name = NEW.name AND id <> NEW.id) THEN
    RAISE EXCEPTION 'Company name must be unique';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_duplicate_company_name ON companies;
CREATE TRIGGER trg_prevent_duplicate_company_name
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_company_name();

-- Trigger function to validate applicant_email format in job_applications
CREATE OR REPLACE FUNCTION validate_applicant_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.applicant_email IS NULL OR NEW.applicant_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid applicant email format';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_applicant_email ON job_applications;
CREATE TRIGGER trg_validate_applicant_email
  BEFORE INSERT OR UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION validate_applicant_email();

-- Add salary_min and salary_max columns to jobs table for range queries
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min NUMERIC;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max NUMERIC;

-- Optional: Migrate existing salary data (if in format '$min - $max' or similar)
-- This is a best-effort migration and may need manual review for edge cases
UPDATE jobs
SET salary_min = NULLIF(regexp_replace(split_part(salary, '-', 1), '[^0-9.]', '', 'g'), '')::NUMERIC,
    salary_max = NULLIF(regexp_replace(split_part(salary, '-', 2), '[^0-9.]', '', 'g'), '')::NUMERIC
WHERE salary IS NOT NULL AND salary LIKE '%-%';

-- For single-value salaries (e.g., '$120000'), set both min and max
UPDATE jobs
SET salary_min = NULLIF(regexp_replace(salary, '[^0-9.]', '', 'g'), '')::NUMERIC,
    salary_max = NULLIF(regexp_replace(salary, '[^0-9.]', '', 'g'), '')::NUMERIC
WHERE salary IS NOT NULL AND salary NOT LIKE '%-%';

-- (Optional) Remove old salary column after migration is verified
-- ALTER TABLE jobs DROP COLUMN salary;

-- Next steps (manual):
-- 1. Enable GraphQL in Supabase dashboard (Settings > API > GraphQL)
-- 2. Add more Edge Functions for notifications, analytics, custom ranking as needed
-- 3. Document your API usage and endpoints for future developers

-- Table for custom rate limiting (used by jobspy_rate_limit Edge Function)
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  count integer NOT NULL,
  window_start timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_window ON rate_limits(identifier, window_start);
