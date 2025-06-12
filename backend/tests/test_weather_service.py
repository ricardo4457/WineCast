import sys
import os
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from services.weather_service import WeatherService

class TestWeatherService(unittest.TestCase):
    def setUp(self):
        self.weather_service = WeatherService()

    def test_fetch_weather_data_invalid_coordinates(self):
        print("Executando: Teste de coordenadas inválidas para dados meteorológicos...")
        result = self.weather_service.fetch_weather_data(lat=999, lon=999)
        self.assertIsNone(result)
        print("✔ Teste concluído: Coordenadas inválidas para dados meteorológicos")

    def test_needs_irrigation_true(self):
        print("Executando: Teste de necessidade de irrigação (verdadeiro)...")
        result = self.weather_service.needs_irrigation(temperature=31, precipitation=0)
        self.assertTrue(result)
        print("✔ Teste concluído: Necessidade de irrigação (verdadeiro)")

    def test_needs_irrigation_false(self):
        print("Executando: Teste de necessidade de irrigação (falso)...")
        result = self.weather_service.needs_irrigation(temperature=25, precipitation=5)
        self.assertFalse(result)
        print("✔ Teste concluído: Necessidade de irrigação (falso)")

    def test_risk_of_fungi_true(self):
        print("Executando: Teste de risco de fungos elevado...")
        result = self.weather_service.risk_of_fungi(humidity=85, temperature=20)
        self.assertTrue(result)
        print("✔ Teste concluído: Risco de fungos elevado")

    def test_risk_of_fungi_false(self):
        print("Executando: Teste de risco de fungos baixo...")
        result = self.weather_service.risk_of_fungi(humidity=50, temperature=15)
        self.assertFalse(result)
        print("✔ Teste concluído: Risco de fungos baixo")

if __name__ == '__main__':
    unittest.main()