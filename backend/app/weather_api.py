import os
import requests
from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class WeatherAPI(Resource):
    def get(self, city_id):
        api_key = os.getenv('OPENWEATHERMAP_API_KEY')
        url = f'http://api.openweathermap.org/data/2.5/weather?id={city_id}&appid={api_key}&units=metric'
        response = requests.get(url)
        return response.json()

api.add_resource(WeatherAPI, '/weather/<int:city_id>')