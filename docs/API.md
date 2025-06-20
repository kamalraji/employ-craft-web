# API Documentation

## Overview
This document describes how to interact with the backend of the Job Portal using Supabase REST and GraphQL APIs, as well as custom Edge Functions. It also covers authentication and authorization flows.

---

## 1. Supabase REST API

Supabase auto-generates REST endpoints for all tables. The base URL is:

```
https://<your-project-ref>.supabase.co/rest/v1/
```

### Example Endpoints
- **Jobs:** `GET /jobs`
- **Companies:** `GET /companies`
- **Job Categories:** `GET /job_categories`
- **Job Applications:** `GET /job_applications`
- **Saved Jobs:** `GET /saved_jobs`

### Example: Fetch Jobs with Filters
```
GET /jobs?status=eq.ACTIVE&location=ilike.*Remote*&salary_min=gte.50000&salary_max=lte.120000
```

### Pagination
Use `limit` and `offset` query params:
```
/jobs?limit=10&offset=20
```

### Full-Text Search
```
/jobs?or=(title.fts.Engineer,description.fts.Engineer,company.fts.Engineer)
```

---

## 2. Supabase GraphQL API

Enable GraphQL in the Supabase dashboard (Settings > API > GraphQL). The endpoint is:

```
https://<your-project-ref>.supabase.co/graphql/v1
```

### Example Query
```
query {
  jobs(where: {status: {eq: "ACTIVE"}, salary_min: {gte: 50000}}) {
    id
    title
    company
    location
    salary_min
    salary_max
  }
}
```

---

## 3. Custom Edge Functions

Edge Functions are deployed at:
```
https://<your-project-ref>.functions.supabase.co/<function-name>
```

### Example: Deduplication Function
- **Endpoint:** `/custom_deduplication`
- **Method:** POST
- **Body:**
```json
{
  "jobs": [ { "title": "...", "company": "...", "location": "..." }, ... ]
}
```
- **Response:**
```json
{
  "jobs": [ ...unique jobs... ]
}
```

---

## 4. Authentication & Authorization

### Authentication
- Uses Supabase Auth (email/password, OAuth, etc.)
- Obtain a JWT token via login:
```js
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```
- Pass the JWT as a Bearer token in API requests:
```
Authorization: Bearer <access_token>
```

### Authorization
- **Row Level Security (RLS)** is enabled on all sensitive tables.
- Policies:
  - Only authenticated users can manage their own saved jobs.
  - Only admins can view job applications.
  - Anyone can view active jobs and companies.

---

## 5. Example Queries

### Fetch Jobs by Salary Range
```
GET /jobs?salary_min=gte.60000&salary_max=lte.120000
```

### Search Companies by Name
```
GET /companies?name=fts.Tech
```

### Fetch Saved Jobs for a User
```
GET /saved_jobs?user_id=eq.<user_id>
```

### Submit a Job Application
```
POST /job_applications
Body: { "job_id": "...", "applicant_email": "...", ... }
```

---

## 6. Real-time Subscriptions
- Use Supabase client libraries to subscribe to changes in jobs, companies, or applications for live updates in your app.

---

## 7. Notes
- Replace `<your-project-ref>` with your actual Supabase project reference.
- For more details, see the [Supabase API docs](https://supabase.com/docs/guides/api). 