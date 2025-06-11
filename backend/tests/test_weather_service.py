from src.services.weather_service import WeatherService

def test_needs_irrigation():
    service = WeatherService()
    assert service.needs_irrigation(35, 0) is True
    assert service.needs_irrigation(25, 10) is False

def test_risk_of_fungi():
    service = WeatherService()
    assert service.risk_of_fungi(85, 20) is True
    assert service.risk_of_fungi(50, 15) is False

def test_suggest_harvest_time():
    service = WeatherService()
    assert service.suggest_harvest_time(25, 60, 0) == service.MESSAGES["good_harvest"]
    assert service.suggest_harvest_time(35, 85, 10) == service.MESSAGES["wet_weather"]