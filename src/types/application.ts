
export interface JobApplication {
  id: string;
  job_id: string;
  applicant_email: string;
  applicant_name: string;
  applicant_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  status: string;
  created_at: string;
}

export interface CreateApplicationData {
  job_id: string;
  applicant_email: string;
  applicant_name: string;
  applicant_phone?: string;
  cover_letter?: string;
}
