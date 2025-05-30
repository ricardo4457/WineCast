# app/routes/weather.py
from flask_restful import Resource, reqparse
from flask import jsonify
from app.services.weather_service import WeatherService
from app.rules.vineyard_rules import VineyardRules

class WeatherResource(Resource):
    def get(self, city_id):
        """Retorna dados meteorológicos atuais para uma cidade"""
        latest_data = Weather.query.filter_by(city_id=city_id).order_by(Weather.created_at.desc()).first()
        
        if not latest_data:
            return {'error': 'Dados não encontrados'}, 404
            
        return {
            'data': latest_data.to_dict(),
            'recommendations': {
                'irrigation': VineyardRules.check_irrigation(
                    latest_data.temp, 
                    latest_data.humidity,
                    latest_data.rain_1h
                ),
                'fungus_risk': VineyardRules.check_fungus_risk(
                    latest_data.humidity,
                    latest_data.temp,
                    latest_data.rain_1h
                )
            }
        }

class ForecastResource(Resource):
    def get(self, city_id):
        """Retorna previsão do tempo para os próximos dias"""
        # Implementação futura - por enquanto retorna dados simulados
        from app.factories.weather_factory import WeatherDataFactory
        factory = WeatherDataFactory()
        forecast = factory.generate_forecast(city_id)
        return jsonify([data for data in forecast])