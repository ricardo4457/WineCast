import pytest
from flask import Flask
from src.routes import api

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(api, url_prefix='/api')
    app.testing = True
    return app.test_client()

def test_api_weather(client):
    response = client.get('/api/weather?lat=40.7128&lon=-74.0060')
    assert response.status_code in [200, 400]

def test_api_analyze_weather(client):
    payload = {"temperature": 25, "humidity": 60}
    response = client.post('/api/weather/analyze', json=payload)
    assert response.status_code in [200, 400]

def test_api_irrigation_check(client):
    payload = {"temperature": 35, "precipitation": 0}
    response = client.post('/api/weather/irrigation-check', json=payload)
    assert response.status_code in [200, 400]