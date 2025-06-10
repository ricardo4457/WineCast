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

# Importe os seus serviços
from services.weather_service import WeatherService
# from services.db_service import DBService # Descomente se for usar o DBService aqui
# from utils.websocket_handler import WebSocketHandler # Descomente se for usar o WebSocketHandler aqui
from routes import api  # Import the API blueprint

load_dotenv()
print("API KEY FROM ENV:", os.getenv('OPENWEATHER_API_KEY'))

app = Flask(__name__)
app.config['SECRET_KEY'] = '2ae1455195fbfca6a289de7c7dc50ea4'

# Add CORS configuration here, before registering blueprints
# For REST API endpoints
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# For WebSocket connections
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173"])

app.register_blueprint(api, url_prefix='/api')

# Inicialize os seus serviços aqui
weather_service = WeatherService()
# db_service = DBService() # Descomente se for usar
# websocket_handler = WebSocketHandler(socketio) # Descomente se for usar

# --- Defina as suas rotas e eventos SocketIO AQUI ---
@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # Enviar dados assim que o cliente se conecta, se desejar uma atualização imediata
    # initial_data = weather_service.fetch_weather_data()
    # if initial_data:
    #     socketio.emit('weather_update', initial_data)


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# --- Inicie o servidor e threads em segundo plano DEPOIS de definir as rotas ---
if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000/")
    socketio.run(app, debug=True)