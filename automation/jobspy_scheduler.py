import schedule
import time
import subprocess

def run_scraper():
    subprocess.run(['python', 'jobspy_scraper/main_scraper.py'])

# Schedule to run every 6 hours (4 times per day)
schedule.every(6).hours.do(run_scraper)

if __name__ == "__main__":
    print("Starting JobSpy scraping scheduler...")
    while True:
        schedule.run_pending()
        time.sleep(60) 