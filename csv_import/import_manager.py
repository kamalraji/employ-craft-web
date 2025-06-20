import pandas as pd
from supabase import create_client, Client
from field_mapper import map_fields
import sys
from dotenv import load_dotenv
import os

def import_csv_to_supabase(csv_path, supabase_url, supabase_key):
    supabase: Client = create_client(supabase_url, supabase_key)
    df = pd.read_csv(csv_path)
    jobs = map_fields(df).to_dict(orient='records')
    print(f"Uploading {len(jobs)} jobs to Supabase...")
    if len(jobs) > 0:
        print("Sample job:", jobs[0])
    else:
        print("No jobs to upload!")
    # Upsert jobs based on title, company, location
    response = supabase.table('jobs').upsert(jobs, on_conflict=['title', 'company', 'location']).execute()
    print("Supabase response:", response)
    print(f"Imported {len(jobs)} jobs to Supabase.") 

if __name__ == "__main__":
    load_dotenv()
    # Try to get from command line, else from .env
    if len(sys.argv) >= 4:
        csv_path = sys.argv[1]
        supabase_url = sys.argv[2]
        supabase_key = sys.argv[3]
    else:
        csv_path = sys.argv[1] if len(sys.argv) > 1 else None
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
    if not csv_path or not supabase_url or not supabase_key:
        print("Usage: python import_manager.py <csv_path> <supabase_url> <supabase_key>")
        print("Or set SUPABASE_URL and SUPABASE_KEY in a .env file.")
        sys.exit(1)
    print(f"Running import for {csv_path}...")
    import_csv_to_supabase(csv_path, supabase_url, supabase_key) 