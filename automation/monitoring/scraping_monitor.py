import logging
import os
from datetime import datetime

LOG_FILE = 'automation/monitoring/scraping.log'

def log_scraping_event(event: str):
    with open(LOG_FILE, 'a') as f:
        f.write(f"{datetime.now().isoformat()} - {event}\n")

def alert_failure(message: str):
    # Placeholder for alerting (email, webhook, etc.)
    print(f"ALERT: {message}")
    log_scraping_event(f"FAILURE: {message}") 