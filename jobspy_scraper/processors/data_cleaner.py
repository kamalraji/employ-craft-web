import pandas as pd

def clean_and_standardize(df: pd.DataFrame) -> pd.DataFrame:
    # Remove duplicates by title, company, location
    df = df.drop_duplicates(subset=["title", "company", "location"])
    # Standardize salary (convert to string, fill missing)
    df["salary_min"] = df["salary_min"].fillna("").astype(str)
    df["salary_max"] = df["salary_max"].fillna("").astype(str)
    # Standardize location (capitalize, strip)
    df["location"] = df["location"].fillna("").str.title().str.strip()
    # Validate required fields (drop rows missing title, company, location)
    df = df.dropna(subset=["title", "company", "location"])
    return df 