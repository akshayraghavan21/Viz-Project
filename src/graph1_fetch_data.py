import pandas as pd
import os

def main():
    data_dir = "../data"
    prep_dataset_filename = "mxmh_survey_results_prep.csv"
    prep_dataset_file = os.path.join(data_dir, prep_dataset_filename)

    print("###############", os.getcwd())
    columns = ["fav_genre", "anxiety", "depression", "insomnia", "ocd"]
    df = pd.read_csv(prep_dataset_file)
    df = df[columns]
    return {"result": df.to_dict(orient="list")}
 