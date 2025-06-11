"""
.. WineCast API
   ============

Configuração CORS
---------------

Configuração da API REST
^^^^^^^^^^^^^^^^^^^^^^^
.. code-block:: python

    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

Endpoints da API REST
------------------

GET /api/weather
    Devolve o estado do tempo atual.
    - Parâmetros: lat (float), lon (float)
    - Exemplo de resposta:
      {
        "event": "Received data",
        "payload": {
          "temperature": 22.5,
          "humidity": 60,
          "precipitation": 0,
          "wind_speed": 3.5
        }
      }

POST /api/weather/analyze
    Analisa condições do tempo.
    - JSON: temperature, humidity, precipitation (opcional), wind_speed (opcional)
    - Exemplo de resposta:
      {
        "temperature": 22.5,
        "humidity": 60,
        "precipitation": 0,
        "wind_speed": 3.5,
        "needs_irrigation": false,
        "risk_of_fungi": false,
        "harvest_suggestion": "Good day for harvest"
      }

Eventos WebSocket
----------------

Conexões WebSocket
^^^^^^^^^^^^^^^
.. code-block:: python

    socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173"])

Eventos:
- connect: Cliente conectado ao servidor
- disconnect: Cliente desconectado do servidor
- weather_update: Atualizações meteorológicas em tempo real

Exemplo de Resposta weather_update:
    {
        "temperature": 23.0,
        "humidity": 65,
        "precipitation": 0,
        "wind_speed": 2.8
    }

Exemplo de Cliente WebSocket
-------------------------
.. code-block:: javascript

    const socket = io('http://localhost:5000', {
        withCredentials: true,
        extraHeaders: {
            "Access-Control-Allow-Origin": "http://localhost:5173"
        }
    });

    socket.on('weather_update', (dados) => {
        console.log('Atualização meteorológica:', dados);
    });

Notas Importantes
---------------
1. Backend: http://localhost:5000
2. Frontend: http://localhost:5173
"""

from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS  
from dotenv import load_dotenv
import os
from services.weather_service import WeatherService
from routes import api  

load_dotenv()
print("API KEY FROM ENV:", os.getenv('OPENWEATHER_API_KEY'))

app = Flask(__name__)
app.config['SECRET_KEY'] = '2ae1455195fbfca6a289de7c7dc50ea4'

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
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('subscribe_to_weather')
def handle_subscribe_to_weather(data):
    print(f"Client subscribed to weather for: {data}")
    lat = data.get('lat')
    lon = data.get('lon')
    days = data.get('days', 3)

    if lat is None or lon is None:
        socketio.emit('weather_error', {'error': 'Latitude and longitude are required.'})
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
        socketio.emit('weather_error', {'error': 'Failed to fetch current weather.'})

    forecast = weather_service.analyze_forecast(lat, lon, days)
    if forecast:
        socketio.emit('forecast_update', forecast)
    else:
        socketio.emit('weather_error', {'error': 'Failed to fetch forecast.'})

if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000/")
    socketio.run(app, debug=True)