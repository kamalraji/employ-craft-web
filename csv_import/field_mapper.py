FIELD_MAP = {
    "title": "job_title",
    "company": "company_name",
    "location": "job_location",
    "job_type": "employment_type",
    "date_posted": "posted_date",
    "salary_min": "salary_min",
    "salary_max": "salary_max",
    "job_url": "application_url",
    "description": "job_description",
    "site": "source_platform",
    "logo_url": "logo_url"
}

def map_fields(df):
    return df.rename(columns=FIELD_MAP) 