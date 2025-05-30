# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+mysqlconnector://user:password@localhost/vineyard')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
api = Api(app)
socketio = SocketIO(app, message_queue='redis://')

# Importações após inicialização para evitar ciclos
from app.routes.weather import WeatherResource, ForecastResource
from app.services.weather_service import WeatherService
from app.models.weather import Weather

# Registros de endpoints
api.add_resource(WeatherResource, '/weather/<int:city_id>')
api.add_resource(ForecastResource, '/forecast/<int:city_id>')

# Inicializar serviço de atualização periódica
weather_service = WeatherService()

if __name__ == '__main__':
    socketio.run(app, debug=True)