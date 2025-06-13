from flask import Blueprint, jsonify, request
from services.weather_service import WeatherService
from http import HTTPStatus
from typing import Dict, Any, Tuple

api = Blueprint('api', __name__)

weather_service = WeatherService()
def validate_fields(data: Dict[str, Any], required_fields: list) -> Tuple[bool, Dict[str, Any], int]:
    """Ajuda para validar os campos obrigatórios e converter para float."""
    missing = [f for f in required_fields if data.get(f) is None]
    if missing:
        return False, {"error": f"Os seguintes campos são obrigatórios: {', '.join(missing)}."}, HTTPStatus.BAD_REQUEST
    try:
        values = {f: float(data.get(f, 0)) for f in required_fields}
    except (TypeError, ValueError):
        return False, {"error": f"Valores inválidos para {', '.join(required_fields)}. Devem ser números."}, HTTPStatus.BAD_REQUEST
    return True, values, None

@api.route('/weather', methods=['GET'])
def api_weather():
    """Obter dados meteorológicos atuais da API usando parâmetros de consulta lat/lon."""
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if lat is None or lon is None:
        return jsonify({"error": "Os seguintes campos são obrigatórios: lat e lon."}), HTTPStatus.BAD_REQUEST
    try:
        lat = float(lat)
        lon = float(lon)
    except (TypeError, ValueError):
        return jsonify({"error": "Valores inválidos para lat ou lon. Devem ser números."}), HTTPStatus.BAD_REQUEST
    data = weather_service.fetch_weather_data(lat, lon)
    if data is None:
        return jsonify({"error": "Falha ao buscar dados meteorológicos na API."}), HTTPStatus.BAD_GATEWAY
    return jsonify({"event": "Dados recebidos", "payload": data}), HTTPStatus.OK

@api.route('/weather/analyze', methods=['POST'])
def api_analyze_weather():
    """Analisar dados meteorológicos a partir de entrada mínima (temperatura, humidade, precipitação, velocidade do vento)."""
    if not request.is_json:
        return jsonify({"error": "A requisição deve ser JSON"}), HTTPStatus.BAD_REQUEST
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
        return jsonify({"error": "Valores inválidos para 'precipitação' ou 'velocidade do vento'. Devem ser números."}), HTTPStatus.BAD_REQUEST

    result = weather_service.analyze_weather_data(
        values['temperature'], 
        values['humidity'], 
        precipitation,
        wind_speed
    )
    
    if not result:
        return jsonify({"error": "Valores inválidos fornecidos"}), HTTPStatus.BAD_REQUEST

    return jsonify(result), HTTPStatus.OK

@api.route('/weather/analyze-humidity', methods=['POST'])
def analyze_humidity():
    """Analisar se há risco de fungos com base na humidade e temperatura."""
    if not request.is_json:
        return jsonify({"error": "A requisição deve ser JSON"}), HTTPStatus.BAD_REQUEST
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



@api.route('/weather/irrigation-check', methods=['POST'])
def api_irrigation_check():
    """Verificar se é necessária irrigação com base na temperatura e precipitação."""
    if not request.is_json:
        return jsonify({"error": "A requisição deve ser JSON"}), HTTPStatus.BAD_REQUEST

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
        return jsonify({"error": "Parâmetros inválidos"}), HTTPStatus.BAD_REQUEST

@api.route('/weather/forecast', methods=['GET'])
def api_forecast():
    """Obter previsão do tempo e análise para os próximos dias."""
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    days = request.args.get('days', default=3)

    if lat is None or lon is None:
        return jsonify({
            "error": "Os seguintes campos são obrigatórios: lat e lon."
        }), HTTPStatus.BAD_REQUEST

    try:
        lat = float(lat)
        lon = float(lon)
        days = int(days)
        if days < 1 or days > 5:
            return jsonify({
                "error": "O parâmetro days deve estar entre 1 e 5."
            }), HTTPStatus.BAD_REQUEST
    except (TypeError, ValueError):
        return jsonify({
            "error": "Valores inválidos para lat, lon ou days. Devem ser números."
        }), HTTPStatus.BAD_REQUEST

    forecast = weather_service.analyze_forecast(lat, lon, days)
    
    if forecast is None:
        return jsonify({
            "error": "Falha ao buscar dados de previsão na API."
        }), HTTPStatus.BAD_GATEWAY

    return jsonify({
        "status": "success",
        "data": forecast
    }), HTTPStatus.OK