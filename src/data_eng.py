import os
import pandas as pd
import numpy as np

def main():
    print("Creating Prep Dataset")
    data_dir = "../data"
    raw_dataset_filename = "mxmh_survey_results.csv"
    prep_dataset_filename = "mxmh_survey_results_prep.csv"
    raw_dataset_file = os.path.join(data_dir, raw_dataset_filename)
    prep_dataset_file = os.path.join(data_dir, prep_dataset_filename)

    dataset_raw_df = pd.read_csv(raw_dataset_file)

    original_cols = dataset_raw_df.columns.tolist()
    edited_cols = [col.lower().replace(" ", "_").replace("[","").replace("]","") for col in original_cols]
    dataset_raw_df.columns = edited_cols

    cols_to_drop = ["permissions", "timestamp"]
    dataset_raw_df.drop(columns=cols_to_drop, inplace=True)
    dataset_raw_df.dropna(inplace=True)

    dataset_raw_df.to_csv(prep_dataset_file)
    print(f"Created file: {prep_dataset_file}")
    return 1