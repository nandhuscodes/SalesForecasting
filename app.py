import os
import base64
import csv
from flask import Flask, request, jsonify
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from matplotlib.dates import DateFormatter
from io import BytesIO
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from prophet import Prophet
from sklearn.metrics import mean_squared_error, mean_absolute_error

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])
api = Api(app)
db_file_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'users.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(db_file_path)
db = SQLAlchemy(app)
app.config['UPLOAD_FOLDER'] = os.path.dirname(os.path.abspath(__file__))

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(80))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))

    def __init__(self, fullname, email, password):
        self.fullname = fullname
        self.email = email
        self.password = password

        def __repr__(self):
            return f"{self.fullname}:{self.email}"

@app.before_first_request
def create_table():
    db.create_all()

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    fullname = data['fullname']
    email = data['email']
    password = data['password']

    user = User(fullname=fullname, email=email, password=password)

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User created successfully', 'redirect': '/login'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'error': 'Invalid email or password'})

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({'message': 'File Uploaded Successfully', 'file':filename})

@app.route('/home')
def home():
    return "Hello"

@app.route('/api/forecast', methods=['POST'])
def forecast():
    
    req_data = request.get_json()
    dataset_name = req_data['datasetName']
    time_range = int(req_data['timeRange'])
    periodicity = req_data['periodicity']
    if(periodicity == "Yearly"):periodicity='Y'
    elif(periodicity=="Monthly"):periodicity='M'
    elif(periodicity == "Weekly"):periodicity='W'
    elif(periodicity=="Daily"):periodicity='D'
    p = time_range
    f = periodicity
    
    
    data = pd.read_csv(dataset_name)

    
    data['date'] = pd.to_datetime(data['date'])

    
    data = data.drop_duplicates(subset='date')

    
    data = data.set_index('date').asfreq(f)

    
    data = data.rename(columns={'sales': 'y'}).reset_index().rename(columns={'date': 'ds'})

    
    train_data = data[:-1]
    test_data = data[-1:]

    
    model = Prophet()
    model.fit(train_data)

    
    future = model.make_future_dataframe(periods=p, freq=f)
    forecast = model.predict(future)
    predicted = forecast[-1:]
    forecast = forecast[-(p+1):]
    if periodicity == 'D':
        train_data = train_data[-160:]

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(forecast['ds'], forecast['yhat'], '#93daa9', linestyle = '-', label='Predicted')
    ax.plot(train_data['ds'], train_data['y'], '#4f7663', label='Actual')
    ax.legend()


    date_format = DateFormatter('%d-%m-%Y')
    ax.xaxis.set_major_formatter(date_format)
    plt.xticks(rotation=30)

    
    buffer = BytesIO()
    fig.savefig(buffer, format='png')
    buffer.seek(0)
    encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')

    
    mae = mean_absolute_error(test_data['y'], predicted['yhat'])
    mse = mean_squared_error(test_data['y'], predicted['yhat'])
    rmse = np.sqrt(mse)
    accuracy = (100-rmse)
    asset_path = os.path.join(os.getcwd(), 'my-angular-app', 'src', 'assets')
    csv_file_path = os.path.join(asset_path, 'data.csv')
    with open(csv_file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        
        writer.writerow(['date', 'actual_sales', 'predicted_sales'])
        for i in range(len(train_data)):
            row = [train_data.iloc[i]['ds'].strftime('%Y-%m-%d'), train_data.iloc[i]['y'], None]
            writer.writerow(row)
        for i in range(len(forecast)):
            row = [forecast.iloc[i]['ds'].strftime('%Y-%m-%d'), None, forecast.iloc[i]['yhat']]
            writer.writerow(row)

    
    response = {'forecast': encoded_image, 'accuracy': accuracy, 'csv_file': 'data.csv'}


    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)