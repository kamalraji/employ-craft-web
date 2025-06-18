
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type JobStatus = 'ACTIVE' | 'ARCHIVED' | 'DRAFT';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  type: JobType;
  category: string;
  salary?: string;
  requirements: string[];
  application_url?: string;
  source_url?: string;
  scraped_from?: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface JobFilters {
  search?: string;
  category?: string;
  type?: JobType;
  location?: string;
  sortBy?: 'created_at' | 'title' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
