
-- Create enums for job types and status
CREATE TYPE job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');
CREATE TYPE job_status AS ENUM ('ACTIVE', 'ARCHIVED', 'DRAFT');

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  type job_type NOT NULL,
  category TEXT NOT NULL,
  salary TEXT,
  requirements TEXT[] DEFAULT '{}',
  application_url TEXT,
  source_url TEXT,
  scraped_from TEXT,
  status job_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job categories table for better organization
CREATE TABLE public.job_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to jobs (read-only)
CREATE POLICY "Anyone can view active jobs" ON public.jobs
  FOR SELECT USING (status = 'ACTIVE');

-- Create policies for job categories (read-only)
CREATE POLICY "Anyone can view job categories" ON public.job_categories
  FOR SELECT USING (true);

-- Create policies for admins (authenticated admin access only)
CREATE POLICY "Admins can view admin data" ON public.admins
  FOR SELECT USING (auth.uid() = id);

-- Insert some sample job categories
INSERT INTO public.job_categories (name, description) VALUES
  ('Technology', 'Software development, IT, and tech roles'),
  ('Marketing', 'Digital marketing, content, and advertising'),
  ('Sales', 'Sales representatives, account management'),
  ('Design', 'UI/UX, graphic design, and creative roles'),
  ('Finance', 'Accounting, financial analysis, and banking'),
  ('Healthcare', 'Medical, nursing, and healthcare administration'),
  ('Education', 'Teaching, training, and educational services'),
  ('Operations', 'Project management, operations, and logistics');

-- Insert some sample jobs
INSERT INTO public.jobs (title, company, location, description, type, category, salary, requirements, application_url) VALUES
  ('Senior Frontend Developer', 'TechCorp Inc', 'San Francisco, CA', 'We are looking for an experienced frontend developer to join our growing team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.', 'FULL_TIME', 'Technology', '$120,000 - $150,000', ARRAY['React', 'TypeScript', 'CSS', '3+ years experience'], 'https://example.com/apply/1'),
  ('Marketing Manager', 'StartupXYZ', 'Remote', 'Lead our marketing efforts and drive user acquisition. Experience with digital marketing, content strategy, and analytics required.', 'FULL_TIME', 'Marketing', '$80,000 - $100,000', ARRAY['Digital Marketing', 'Content Strategy', 'Analytics', '5+ years experience'], 'https://example.com/apply/2'),
  ('UX Designer', 'Design Studio', 'New York, NY', 'Create beautiful and intuitive user experiences for our client projects. Portfolio showcasing mobile and web design required.', 'CONTRACT', 'Design', '$60 - $80 per hour', ARRAY['Figma', 'Sketch', 'User Research', 'Prototyping'], 'https://example.com/apply/3'),
  ('Data Analyst Intern', 'BigData Corp', 'Austin, TX', 'Summer internship opportunity to work with large datasets and contribute to business intelligence initiatives.', 'INTERNSHIP', 'Technology', '$25 - $30 per hour', ARRAY['SQL', 'Python', 'Excel', 'Statistics'], 'https://example.com/apply/4'),
  ('Sales Representative', 'SalesPro LLC', 'Chicago, IL', 'Join our sales team and help grow our customer base. Previous B2B sales experience preferred.', 'FULL_TIME', 'Sales', '$50,000 - $70,000 + Commission', ARRAY['B2B Sales', 'CRM Software', 'Communication Skills'], 'https://example.com/apply/5');
