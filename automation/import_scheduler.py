import schedule
import time
import subprocess
import os
from glob import glob

def run_import():
    # Find the latest CSV file in the daily_jobs directory
    csv_dir = 'jobspy_scraper/csv_output/daily_jobs'
    csv_files = glob(os.path.join(csv_dir, '*.csv'))
    if not csv_files:
        print('No CSV files found for import.')
        return
    latest_csv = max(csv_files, key=os.path.getctime)
    print(f'Importing {latest_csv} into Supabase...')
    # Call the import manager script with Supabase credentials (set as env vars or replace below)
    supabase_url = os.getenv('SUPABASE_URL', 'YOUR_SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY', 'YOUR_SUPABASE_SERVICE_KEY')
    subprocess.run(['python', 'csv_import/import_manager.py', latest_csv, supabase_url, supabase_key])

# Schedule to run every 6 hours (4 times per day)
schedule.every(6).hours.do(run_import)

if __name__ == "__main__":
    print("Starting CSV import scheduler...")
    while True:
        schedule.run_pending()
        time.sleep(60) 