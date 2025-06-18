
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
