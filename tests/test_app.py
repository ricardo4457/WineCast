import pytest
from src.app import app

@pytest.fixture
def client():
    app.testing = True
    return app.test_client()

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200