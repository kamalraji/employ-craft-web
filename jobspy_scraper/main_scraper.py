import os
import json
from datetime import datetime
import pandas as pd
from jobspy import scrape_jobs
from config.scraping_config import SCRAPING_SETTINGS
import requests
from processors.pharma_scraper import scrape_pharma_jobs

def load_search_terms():
    with open(os.path.join(os.path.dirname(__file__), 'config', 'search_terms.json')) as f:
        return json.load(f)

def fetch_fresh_proxies():
    # Get the latest HTTP proxies from ProxyScrape (timeout=1000ms, all countries, all anonymity)
    url = "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000&country=all&ssl=all&anonymity=all"
    try:
        resp = requests.get(url, timeout=10)
        proxies = [line.strip() for line in resp.text.splitlines() if line.strip()]
        print(f"Fetched {len(proxies)} fresh proxies from ProxyScrape.")
        return proxies
    except Exception as e:
        print(f"Failed to fetch fresh proxies: {e}")
        return []

def scrape_and_export():
    terms = load_search_terms()
    all_jobs = []
    proxies = fetch_fresh_proxies()
    # If 'pharma' is in platforms, run the custom pharma scraper
    if 'pharma' in SCRAPING_SETTINGS['platforms']:
        try:
            pharma_df = scrape_pharma_jobs()
            if not pharma_df.empty:
                output_dir = os.path.join(os.path.dirname(__file__), 'csv_output', 'daily_jobs')
                os.makedirs(output_dir, exist_ok=True)
                csv_path = os.path.join(output_dir, f'pharma_jobs_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv')
                pharma_df.to_csv(csv_path, index=False)
                print(f"Exported {len(pharma_df)} pharma jobs to {csv_path}")
                all_jobs.append(pharma_df)
        except Exception as e:
            print(f"Pharma scraping failed: {e}")
    # Continue with JobSpy scraping for other platforms
    for term in terms['search_terms']:
        for loc in terms['locations']:
            try:
                jobs = scrape_jobs(
                    site_name=SCRAPING_SETTINGS['platforms'],
                    search_term=term,
                    location=loc,
                    results_wanted=SCRAPING_SETTINGS['results_wanted'],
                    country_indeed=SCRAPING_SETTINGS.get('country_indeed', 'India'),
                    proxies=proxies
                )
                jobs['scraped_date'] = datetime.now()
                jobs['source_platform'] = jobs['site']
                all_jobs.append(jobs)
                print(f"Success for term '{term}' and location '{loc}'")
            except Exception as e:
                print(f"Failed for term '{term}' and location '{loc}': {e}")
    if all_jobs:
        df = pd.concat(all_jobs, ignore_index=True)
        output_dir = os.path.join(os.path.dirname(__file__), 'csv_output', 'daily_jobs')
        os.makedirs(output_dir, exist_ok=True)
        csv_path = os.path.join(output_dir, f'jobs_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv')
        df.to_csv(csv_path, index=False)
        print(f"Exported {len(df)} jobs to {csv_path}")
        return df
    else:
        print("No jobs scraped.")
        return None

if __name__ == "__main__":
    scrape_and_export() 