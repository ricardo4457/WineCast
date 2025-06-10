import os
from typing import TypedDict, Optional, List, Dict
from datetime import datetime
import requests


class WeatherData(TypedDict):
    temperature: float
    humidity: float
    precipitation: float
    wind_speed: float


class ForecastData(TypedDict):
    date: datetime
    temperature: float
    humidity: float
    precipitation: float
    wind_speed: float


class WeatherService:
    """Service for weather data operations and analysis."""

    # Variavies para análise de clima
    TEMP_MIN = 18
    TEMP_MAX = 28
    TEMP_IRRIGATION = 30
    HUMIDITY_HIGH = 80
    HUMIDITY_MIN = 40
    HUMIDITY_MAX = 70

    # mensagens de Resposta
    MESSAGES = {
        "wet_weather": "Aguarde tempo seco antes de colher",
        "bad_temp": "Temperatura não ideal para a colheita",
        "high_humidity": "Humidade elevada, risco de fungos — adie a colheita",
        "good_harvest": "Bom dia para a colheita",
        "humidity_warning": "Humidade ligeiramente elevada, vigie risco de fungos",
        "default": "Sugestão de colheita baseada em critérios de estabilidade",
    }

    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.weather_url = "https://api.openweathermap.org/data/2.5/weather"
        self.forecast_url = "https://api.openweathermap.org/data/2.5/forecast"

    def fetch_weather_data(self, lat: float, lon: float) -> Optional[WeatherData]:
        """
        Fetch weather data from OpenWeather API.
        Returns a dictionary with weather data or None if failed.

        """
        params = {"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"}
        try:
            response = requests.get(self.weather_url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return {
                    "temperature": data["main"]["temp"],
                    "humidity": data["main"]["humidity"],
                    "precipitation": data.get("rain", {}).get("1h", 0),
                    "wind_speed": data["wind"]["speed"],
                }
        except requests.RequestException:
            pass
        return None

    def fetch_forecast(
        self, lat: float, lon: float, days: int = 3
    ) -> Optional[List[ForecastData]]:
        """Fetch weather forecast for specified number of days."""
        params = {"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"}

        try:
            response = requests.get(self.forecast_url, params=params, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return self._parse_forecast_data(
                    data["list"][: days * 8]
                )  # 8 readings per day
        except requests.RequestException:
            pass
        return None

    def _parse_forecast_data(self, forecast_list: List[Dict]) -> List[ForecastData]:
        """Parse raw forecast data into daily averages."""
        daily_data = {}

        for item in forecast_list:
            date = datetime.fromtimestamp(item["dt"]).date()

            if date not in daily_data:
                daily_data[date] = {
                    "temps": [],
                    "humids": [],
                    "precips": [],
                    "winds": [],
                }

            daily_data[date]["temps"].append(item["main"]["temp"])
            daily_data[date]["humids"].append(item["main"]["humidity"])
            daily_data[date]["precips"].append(
                item.get("rain", {}).get("3h", 0) / 3  # Convert 3h to 1h
            )
            daily_data[date]["winds"].append(item["wind"]["speed"])

        return [
            ForecastData(
                date=date,
                temperature=sum(data["temps"]) / len(data["temps"]),
                humidity=sum(data["humids"]) / len(data["humids"]),
                precipitation=max(data["precips"]),  # Use max precipitation
                wind_speed=sum(data["winds"]) / len(data["winds"]),
            )
            for date, data in daily_data.items()
        ]

    def analyze_weather_data(
        self,
        temperature: float,
        humidity: float,
        precipitation: float = 0,
        wind_speed: float = 0.0,
    ) -> Optional[dict]:
        try:
            weather_data: WeatherData = {
                "temperature": float(temperature),
                "humidity": float(humidity),
                "precipitation": float(precipitation),
                "wind_speed": float(wind_speed),
            }

            return {
                **weather_data,
                "needs_irrigation": self.needs_irrigation(temperature, precipitation),
                "risk_of_fungi": self.risk_of_fungi(humidity, temperature),
                "harvest_suggestion": self.suggest_harvest_time(
                    temperature, humidity, precipitation
                ),
            }
        except (TypeError, ValueError):
            return None

    def analyze_forecast(self, lat: float, lon: float, days: int = 3) -> Optional[Dict]:
        """Analyze weather forecast for harvest planning."""
        forecast = self.fetch_forecast(lat, lon, days)
        if not forecast:
            return None

        daily_analysis = []
        for day in forecast:
            analysis = self.analyze_weather_data(
                temperature=day["temperature"],
                humidity=day["humidity"],
                precipitation=day["precipitation"],
                wind_speed=day["wind_speed"],
            )
            if analysis:
                daily_analysis.append(
                    {"date": day["date"].strftime("%Y-%m-%d"), "conditions": analysis}
                )

        return {
            "forecast_period": f"{days} days",
            "daily_analysis": daily_analysis,
            "summary": self._summarize_forecast(daily_analysis),
        }
