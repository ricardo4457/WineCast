# app/services/weather_service.py
import os
import requests
import time
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from app.models.weather import Weather
from flask_socketio import SocketIO

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv('OPENWEATHERMAP_API_KEY')
        self.update_interval = int(os.getenv('UPDATE_INTERVAL', '3600'))  # 1 hora padrão
        
    def fetch_weather_data(self, city_id):
        """Coleta dados meteorológicos da API OpenWeatherMap"""
        url = f'http://api.openweathermap.org/data/2.5/weather?id={city_id}&appid={self.api_key}&units=metric'
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro ao buscar dados meteorológicos: {e}")
            return None

    def save_weather_data(self, data):
        """Salva dados meteorológicos no banco de dados"""
        if not data or data.get('cod') != 200:
            return False
            
        try:
            weather_data = Weather(
                lon=data['coord']['lon'],
                lat=data['coord']['lat'],
                weather_id=data['weather'][0]['id'],
                weather_main=data['weather'][0]['main'],
                weather_description=data['weather'][0]['description'],
                weather_icon=data['weather'][0]['icon'],
                base=data.get('base'),
                temp=data['main']['temp'],
                feels_like=data['main']['feels_like'],
                temp_min=data['main']['temp_min'],
                temp_max=data['main']['temp_max'],
                pressure=data['main']['pressure'],
                humidity=data['main']['humidity'],
                sea_level=data.get('main', {}).get('sea_level'),
                grnd_level=data.get('main', {}).get('grnd_level'),
                visibility=data.get('visibility'),
                wind_speed=data.get('wind', {}).get('speed'),
                wind_deg=data.get('wind', {}).get('deg'),
                wind_gust=data.get('wind', {}).get('gust'),
                rain_1h=data.get('rain', {}).get('1h'),
                clouds_all=data.get('clouds', {}).get('all'),
                dt=data.get('dt'),
                sys_type=data.get('sys', {}).get('type'),
                sys_id=data.get('sys', {}).get('id'),
                country=data.get('sys', {}).get('country'),
                sunrise=data.get('sys', {}).get('sunrise'),
                sunset=data.get('sys', {}).get('sunset'),
                timezone=data.get('timezone'),
                city_id=data.get('id'),
                name=data.get('name'),
                cod=data.get('cod'),
                created_at=datetime.utcnow()
            )
            
            db.session.add(weather_data)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Erro ao salvar dados no banco: {e}")
            db.session.rollback()
            return False

    def periodic_update(self):
        """Atualiza dados periodicamente"""
        while True:
            for city_id in os.getenv('CITY_IDS', '1,2,3').split(','):
                data = self.fetch_weather_data(int(city_id))
                if self.save_weather_data(data):
                    socketio.emit('weather_update', {'city_id': city_id, 'status': 'updated'})
            time.sleep(self.update_interval)