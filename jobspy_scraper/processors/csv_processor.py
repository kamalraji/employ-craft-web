import pandas as pd
from processors.data_cleaner import clean_and_standardize
 
def process_csv(input_path: str, output_path: str):
    df = pd.read_csv(input_path)
    df = clean_and_standardize(df)
    df.to_csv(output_path, index=False)
    print(f"Processed and saved cleaned CSV to {output_path}") 