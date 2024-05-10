from flask import Flask, render_template, jsonify
from graph1_fetch_data import main as graph1_fetch_data_main
from graph4_fetch_data import main as graph4_fetch_data_main
from data_eng import main as data_eng_main
import os
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.manifold import MDS
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler(feature_range=(-1, 1))

app = Flask(__name__, template_folder='../templates', static_folder='../static')

data_dir = "../data"
prep_dataset_filename = "mxmh_survey_results_prep.csv"
prep_dataset_file = os.path.join(data_dir, prep_dataset_filename)
df = pd.read_csv(prep_dataset_file)
df=df[df['bpm']<300]
mds_rows = MDS(n_components=2, random_state=42)
columns = ["hours_per_day", 'bpm', "anxiety", "depression", "insomnia", "ocd"]
data_mds = df[columns]
scaled_data_mds = scaler.fit_transform(data_mds)
data_mds = pd.DataFrame(scaled_data_mds, columns=data_mds.columns)
embedded_data_rows = mds_rows.fit_transform(data_mds)

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

@app.route('/graph4_fetch_data')
def run_fetch_graph4_fetch_data():
    result = graph4_fetch_data_main()
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
    labels = kmeans.fit_predict(data_mds)
    fav_genre = df['fav_genre']

    mds_row_data_with_clusters = [{'x': x, 'y': y, 'cluster': int(name), 'fav_genre':fav_genre} for (x, y), name, fav_genre in zip(embedded_data_rows, labels,fav_genre)]
    #print(mds_row_data_with_clusters)
    return jsonify(mds_row_data_with_clusters)


@app.route('/radar_plot/')
def radar_plot():
    columns = ["fav_genre", "anxiety", "depression", "insomnia", "ocd"]
    data = df[columns]
    all_genre_means = data.groupby(by=['fav_genre']).agg(
        {'anxiety': 'mean', 'depression': 'mean', 'insomnia': 'mean',
         'ocd': 'mean'})
    all_genre_means.reset_index(drop=False, inplace=True)

    return jsonify(all_genre_means.to_dict(orient='records'))


@app.route('/pcp_data/')
def pcp_data():
    # k = num_clusters
    #
    # # Perform k-means clustering
    # kmeans = KMeans(n_clusters=k)
    # labels = kmeans.fit_predict(data)
    #
    # # Add cluster labels to the DataFrame
    # data['cluster'] = labels
    columns = ["age","fav_genre", "primary_streaming_service", "hours_per_day", 'bpm', "anxiety", "depression", "insomnia", "ocd"]
    data = df[columns]

    return jsonify(data.to_dict(orient='records'))

@app.route('/donut_effects/')
def donut_effects():
    # k = num_clusters
    #
    # # Perform k-means clustering
    # kmeans = KMeans(n_clusters=k)
    # labels = kmeans.fit_predict(data)
    #
    # # Add cluster labels to the DataFrame
    # data['cluster'] = labels
    #columns = ["age","fav_genre", "primary_streaming_service", "hours_per_day", 'bpm', "anxiety", "depression", "insomnia", "ocd"]

    data = df.groupby(['music_effects'])['fav_genre'].count().reset_index()
    data = data.rename(columns={'fav_genre':'count'})
    return jsonify(data.to_dict(orient='records'))

@app.route('/age_hist/')
def age_hist():
    # k = num_clusters
    #
    # # Perform k-means clustering
    # kmeans = KMeans(n_clusters=k)
    # labels = kmeans.fit_predict(data)
    #
    # # Add cluster labels to the DataFrame
    # data['cluster'] = labels
    columns = ["age"]

    data = df[columns]

    return jsonify(data.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True)
