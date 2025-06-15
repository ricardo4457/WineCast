from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS  
from dotenv import load_dotenv
import os
from services.weather_service import WeatherService
from routes import api  

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173"])

app.register_blueprint(api, url_prefix='/api')

weather_service = WeatherService()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Cliente estabeleceu ligação')

@socketio.on('disconnect')
def handle_disconnect():
    print('Cliente desligou ligação')

@socketio.on('subscribe_to_weather')
def handle_subscribe_to_weather(data):
    print(f"Cliente subscrito ao tempo para: {data}")
    lat = data.get('lat')
    lon = data.get('lon')
    days = data.get('days', 3)

    if lat is None or lon is None:
        socketio.emit('weather_error', {'error': 'Latitude e longitude são obrigatórios.'})
        return

    current_weather = weather_service.fetch_weather_data(lat, lon)
    if current_weather:
        socketio.emit('current_weather_update', current_weather)

        analysis = weather_service.analyze_weather_data(
            temperature=current_weather['temperature'],
            humidity=current_weather['humidity'],
            precipitation=current_weather.get('precipitation', 0),
            wind_speed=current_weather.get('wind_speed', 0)
        )
        if analysis:
            socketio.emit('analysis_update', {
                "risk_of_fungi": analysis["risk_of_fungi"],
                "harvest_suggestion": analysis["harvest_suggestion"]
            })
            socketio.emit('irrigation_status_update', {
                "needs_irrigation": analysis["needs_irrigation"],
                "conditions": { 
                    "temperature": current_weather['temperature'],
                    "precipitation": current_weather.get('precipitation', 0)
                }
            })
    else:
        socketio.emit('weather_error', {'error': 'Falha ao buscar dados meteorológicos.'})

    forecast = weather_service.analyze_forecast(lat, lon, days)
    if forecast:
        socketio.emit('forecast_update', forecast)
    else:
        socketio.emit('weather_error', {'error': 'Falha ao buscar previsão.'})

if __name__ == '__main__':
    print("http://127.0.0.1:5000/")
    socketio.run(app, debug=False)