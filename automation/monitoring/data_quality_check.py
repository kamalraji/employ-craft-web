import pandas as pd
import os

def check_data_quality(csv_path):
    df = pd.read_csv(csv_path)
    issues = []
    if df.isnull().any().any():
        issues.append('Missing values detected')
    if df.duplicated(subset=["title", "company", "location"]).any():
        issues.append('Duplicate jobs detected')
    if not issues:
        print("Data quality check passed.")
    else:
        print("Data quality issues:", issues)
    return issues
 