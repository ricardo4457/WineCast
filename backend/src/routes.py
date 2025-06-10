from flask import Blueprint, jsonify, request
from services.weather_service import WeatherService
from http import HTTPStatus
from typing import Dict, Any, Tuple

api = Blueprint('api', __name__)

weather_service = WeatherService()

def validate_fields(data: Dict[str, Any], required_fields: list) -> Tuple[bool, Dict[str, Any], int]:
    """Helper to validate required fields and convert to float."""
    missing = [f for f in required_fields if data.get(f) is None]
    if missing:
        return False, {"error": f"Missing required fields: {', '.join(missing)} are required."}, HTTPStatus.BAD_REQUEST
    try:
        values = {f: float(data.get(f, 0)) for f in required_fields}
    except (TypeError, ValueError):
        return False, {"error": f"Invalid values for {', '.join(required_fields)}. Must be numbers."}, HTTPStatus.BAD_REQUEST
    return True, values, None

@api.route('/weather', methods=['GET'])
def api_weather():
    """Fetch current weather data from the API using lat/lon query params."""
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if lat is None or lon is None:
        return jsonify({"error": "Missing required query parameters: lat and lon are required."}), HTTPStatus.BAD_REQUEST
    try:
        lat = float(lat)
        lon = float(lon)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid values for lat or lon. Must be numbers."}), HTTPStatus.BAD_REQUEST
    data = weather_service.fetch_weather_data(lat, lon)
    if data is None:
        return jsonify({"error": "Failed to fetch weather data from API."}), HTTPStatus.BAD_GATEWAY
    return jsonify({"event": "Received data", "payload": data}), HTTPStatus.OK

@api.route('/weather/analyze', methods=['POST'])
def api_analyze_weather():
    """Analyze weather data from minimal input (temperature, humidity, precipitation, wind_speed)."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), HTTPStatus.BAD_REQUEST
    data = request.get_json()
    valid, values, error_code = validate_fields(data, ['temperature', 'humidity'])
    if not valid:
        return jsonify(values), error_code
    
    precipitation = data.get('precipitation', 0)
    wind_speed = data.get('wind_speed', 0.0)
    
    try:
        precipitation = float(precipitation)
        wind_speed = float(wind_speed)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid value for 'precipitation' or 'wind_speed'. Must be numbers."}), HTTPStatus.BAD_REQUEST
    
    result = weather_service.analyze_weather_data(
        values['temperature'], 
        values['humidity'], 
        precipitation,
        wind_speed
    )
    
    if not result:
        return jsonify({"error": "Invalid values provided"}), HTTPStatus.BAD_REQUEST
    
    return jsonify(result), HTTPStatus.OK

@api.route('/weather/analyze-humidity', methods=['POST'])
def analyze_humidity():
    """Analyze if there is a risk of fungi based on humidity and temperature."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), HTTPStatus.BAD_REQUEST
    data = request.get_json()
    valid, values, error_code = validate_fields(data, ['humidity', 'temperature']) 
    if not valid:
        return jsonify(values), error_code 
    risk = weather_service.risk_of_fungi(values['humidity'], values['temperature'])
    return jsonify({
        "risk_of_fungi": risk,
        "humidity": values['humidity'],
        "temperature": values['temperature']
    }), HTTPStatus.OK

@api.route('/weather/harvest-suggestion', methods=['POST'])
def api_harvest_suggestion():
    """Suggest the best time to harvest based on weather conditions."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), HTTPStatus.BAD_REQUEST

    data = request.get_json()
    valid, values, error_code = validate_fields(data, ['temperature', 'humidity'])
    if not valid:
        return jsonify(values), error_code

    try:
        weather_params = {
            'temperature': values['temperature'],
            'humidity': values['humidity'],
            'precipitation': float(data.get('precipitation', 0))
        }
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid weather parameters"}), HTTPStatus.BAD_REQUEST

    suggestion = weather_service.suggest_harvest_time(**weather_params)

    return jsonify({
        "status": "success",
        "data": {
            "suggestion": suggestion,
            "conditions": weather_params
        }
    }), HTTPStatus.OK


@api.route('/weather/irrigation-check', methods=['POST'])
def api_irrigation_check():
    """Check if irrigation is needed based on temperature and precipitation."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), HTTPStatus.BAD_REQUEST
    
    data = request.get_json()
    valid, values, error_code = validate_fields(data, ['temperature'])
    if not valid:
        return jsonify(values), error_code
    
    try:
        precipitation = float(data.get('precipitation', 0))
        needs_water = weather_service.needs_irrigation(
            temperature=values['temperature'],
            precipitation=precipitation
        )
        
        return jsonify({
            "needs_irrigation": needs_water,
            "conditions": {
                "temperature": values['temperature'],
                "precipitation": precipitation
            }
        }), HTTPStatus.OK
            
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid parameters"}), HTTPStatus.BAD_REQUEST

@api.route('/weather/forecast', methods=['GET'])
def api_forecast():
    """Get weather forecast and analysis for the next few days."""
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    days = request.args.get('days', default=3)

    if lat is None or lon is None:
        return jsonify({
            "error": "Missing required query parameters: lat and lon are required."
        }), HTTPStatus.BAD_REQUEST

    try:
        lat = float(lat)
        lon = float(lon)
        days = int(days)
        if days < 1 or days > 5:
            return jsonify({
                "error": "Days parameter must be between 1 and 5"
            }), HTTPStatus.BAD_REQUEST
    except (TypeError, ValueError):
        return jsonify({
            "error": "Invalid values for lat, lon, or days. Must be numbers."
        }), HTTPStatus.BAD_REQUEST

    forecast = weather_service.analyze_forecast(lat, lon, days)
    
    if forecast is None:
        return jsonify({
            "error": "Failed to fetch forecast data from API."
        }), HTTPStatus.BAD_GATEWAY

    return jsonify({
        "status": "success",
        "data": forecast
    }), HTTPStatus.OK