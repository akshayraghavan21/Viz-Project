from flask import Flask, render_template, jsonify
from graph1_fetch_data import main as graph1_fetch_data_main
from data_eng import main as data_eng_main

app = Flask(__name__, template_folder='../templates', static_folder='../static')

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

if __name__ == '__main__':
    app.run(debug=True)
