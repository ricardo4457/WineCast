
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


# --- Inicie o servidor e threads em segundo plano DEPOIS de definir as rotas ---
if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000/")
    socketio.run(app, debug=True)