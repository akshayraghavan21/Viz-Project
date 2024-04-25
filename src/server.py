from flask import Flask, render_template, jsonify
from graph1_fetch_data import main as graph1_fetch_data_main
from data_eng import main as data_eng_main
import os
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.manifold import MDS

app = Flask(__name__, template_folder='../templates', static_folder='../static')

data_dir = "../data"
prep_dataset_filename = "mxmh_survey_results_prep.csv"
prep_dataset_file = os.path.join(data_dir, prep_dataset_filename)
df = pd.read_csv(prep_dataset_file)

# Render index.html
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run_script')
def run_script():
    data_eng_main()
    return {"x":"y"}

@app.route('/graph1_fetch_data')
def run_fetch_graph1_fetch_data():
    result = graph1_fetch_data_main()
    return jsonify(result)

@app.route('/kmeans/<int:num_clusters>', methods=['GET'])
def kmeans(num_clusters):

    columns = ["age", 'bpm', "anxiety", "depression"]
    data = df[columns]
    kmeans = KMeans(n_clusters=num_clusters)
    kmeans.fit(data)
    labels_k = kmeans.labels_
    data['labels'] = labels_k

    return jsonify(data.to_dict(orient="records"))


@app.route('/mds_row_data/<int:num_clusters>')
def mds_row_data_func(num_clusters):
    k = num_clusters

    # Perform k-means clustering
    kmeans = KMeans(n_clusters=k)
    columns = ["hours_per_day", 'bpm', "anxiety", "depression", "insomnia", "ocd"]
    data = df[columns]
    labels = kmeans.fit_predict(data)
    mds_rows = MDS(n_components=2, random_state=42)
    embedded_data_rows = mds_rows.fit_transform(data)
    mds_row_data_with_clusters = [{'x': x, 'y': y, 'cluster': int(name)} for (x, y), name in zip(embedded_data_rows, labels)]
    print(mds_row_data_with_clusters)
    return jsonify(mds_row_data_with_clusters)





if __name__ == '__main__':
    app.run(debug=True)
