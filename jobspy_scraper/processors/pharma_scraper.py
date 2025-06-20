import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime

PHARMA_URL = "https://www.indianpharmajobs.com/"
PHARMAJOBPOST_URL = "https://pharmajobspost.in/"
PHARMASTUFF_URL = "https://pharmastuff.org.in/"

def scrape_indianpharmajobs():
    resp = requests.get(PHARMA_URL, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    jobs = []
    for card in soup.find_all('div', class_='job-listing'):
        title = card.find('b')
        title = title.text.strip() if title else ''
        company = card.find('span', class_='company')
        company = company.text.strip() if company else ''
        location = card.find('span', class_='location')
        location = location.text.strip() if location else ''
        details_link = card.find('a', string=lambda s: s and 'View Details' in s)
        job_url = details_link['href'] if details_link else ''
        description = ''
        if job_url:
            try:
                details_resp = requests.get(job_url, timeout=10)
                details_resp.raise_for_status()
                details_soup = BeautifulSoup(details_resp.text, 'html.parser')
                desc_tag = details_soup.find('div', class_='job-description')
                description = desc_tag.text.strip() if desc_tag else ''
            except Exception:
                pass
        jobs.append({
            'title': title,
            'company': company,
            'location': location,
            'job_type': '',
            'logo_url': '',
            'job_url': job_url,
            'description': description,
            'site': 'indianpharmajobs.com',
            'new_field': '',
        })
    return jobs

def scrape_pharmajobspost():
    resp = requests.get(PHARMAJOBPOST_URL, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    jobs = []
    for article in soup.find_all('article'):
        title_tag = article.find('h2', class_='entry-title')
        title = title_tag.text.strip() if title_tag else ''
        job_url = title_tag.find('a')['href'] if title_tag and title_tag.find('a') else ''
        description = ''
        company = ''
        location = ''
        if job_url:
            try:
                details_resp = requests.get(job_url, timeout=10)
                details_resp.raise_for_status()
                details_soup = BeautifulSoup(details_resp.text, 'html.parser')
                desc_tag = details_soup.find('div', class_='entry-content')
                description = desc_tag.text.strip() if desc_tag else ''
            except Exception:
                pass
        jobs.append({
            'title': title,
            'company': company,
            'location': location,
            'job_type': '',
            'logo_url': '',
            'job_url': job_url,
            'description': description,
            'site': 'pharmajobspost.in',
            'new_field': '',
        })
    return jobs

def scrape_pharmastuff():
    resp = requests.get(PHARMASTUFF_URL, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    jobs = []
    for li in soup.select('ul.job_listings > li.job_listing'):
        title_tag = li.select_one('.position h3')
        title = title_tag.get_text(strip=True) if title_tag else ''
        company_tag = li.select_one('.meta .company')
        company = company_tag.get_text(strip=True) if company_tag else ''
        location_tag = li.select_one('.meta .location')
        location = location_tag.get_text(strip=True) if location_tag else ''
        details_link = li.find('a')['href'] if li.find('a') else ''
        # Extract job types (can be multiple)
        job_type_tags = li.select('.meta .job-type')
        job_type = job_type_tags[0].get_text(strip=True) if job_type_tags else ''
        # Extract image/logo URL
        img_tag = li.select_one('.company_logo')
        logo_url = img_tag.get('data-src') or img_tag.get('src') if img_tag else ''
        posted = ''  # Not available in the current structure
        description = ''
        if details_link:
            try:
                details_resp = requests.get(details_link, timeout=10)
                details_resp.raise_for_status()
                details_soup = BeautifulSoup(details_resp.text, 'html.parser')
                desc_tag = details_soup.find('div', class_='entry-content')
                description = desc_tag.text.strip() if desc_tag else ''
            except Exception:
                pass
        jobs.append({
            'title': title,
            'company': company,
            'location': location,
            'job_type': job_type,
            'logo_url': logo_url,
            'job_url': details_link,
            'posted': posted,
            'description': description,
            'site': 'pharmastuff.org.in',
            'new_field': '',
        })
    return jobs

def scrape_pharma_jobs():
    all_jobs = []
    all_jobs.extend(scrape_indianpharmajobs())
    all_jobs.extend(scrape_pharmajobspost())
    all_jobs.extend(scrape_pharmastuff())
    df = pd.DataFrame(all_jobs)
    return df 