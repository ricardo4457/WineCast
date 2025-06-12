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

    def test_suggest_harvest_time_good_harvest(self):
        print("Executando: Teste de sugestão de colheita com condições favoráveis...")
        result = self.weather_service.suggest_harvest_time(temperature=25, humidity=50, precipitation=0)
        self.assertEqual(result, self.weather_service.MESSAGES["good_harvest"])
        print("✔ Teste concluído: Sugestão de colheita favorável")

    def test_suggest_harvest_time_bad_temp(self):
        print("Executando: Teste de sugestão de colheita com temperatura desfavorável...")
        result = self.weather_service.suggest_harvest_time(temperature=35, humidity=50, precipitation=0)
        self.assertEqual(result, self.weather_service.MESSAGES["bad_temp"])
        print("✔ Teste concluído: Sugestão de colheita desfavorável devido à temperatura")

    def test_fetch_forecast_invalid_coordinates(self):
        print("Executando: Teste de previsão meteorológica com coordenadas inválidas...")
        result = self.weather_service.fetch_forecast(lat=999, lon=999, days=3)
        self.assertIsNone(result)
        print("✔ Teste concluído: Previsão meteorológica com coordenadas inválidas retornou None")

    def test_analyze_forecast_invalid_coordinates(self):
        print("Executando: Teste de análise de previsão com coordenadas inválidas...")
        result = self.weather_service.analyze_forecast(lat=999, lon=999, days=3)
        self.assertIsNone(result)
        print("✔ Teste concluído: Análise de previsão com coordenadas inválidas retornou None")

if __name__ == '__main__':
    unittest.main()