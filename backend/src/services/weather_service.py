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
                ) 
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
            daily_data[date]["precips"].append(item["rain"]["3h"])
            daily_data[date]["winds"].append(item["wind"]["speed"])

        return [
            ForecastData(
                date=date,
                temperature=sum(data["temps"]) / len(data["temps"]),
                humidity=sum(data["humids"]) / len(data["humids"]),
                precipitation=max(data["precips"]),
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

    def needs_irrigation(self, temperature: float, precipitation: float) -> bool:
        """Check if irrigation is needed."""
        return temperature > self.TEMP_IRRIGATION and precipitation == 0

    def risk_of_fungi(self, humidity: float, temperature: float) -> bool:
        """Check risk of fungi."""
        return (
            humidity > self.HUMIDITY_HIGH
            and self.TEMP_MIN <= temperature <= self.TEMP_MAX
        )

    def suggest_harvest_time(
        self, temperature: float, humidity: float, precipitation: float = 0
    ) -> str:
        """Suggest harvest time based on conditions."""
        if precipitation > 0:
            return self.MESSAGES["wet_weather"]
        if not (self.TEMP_MIN <= temperature <= self.TEMP_MAX):
            return self.MESSAGES["bad_temp"]
        if humidity > self.HUMIDITY_HIGH:
            return self.MESSAGES["high_humidity"]
        if (
            self.TEMP_MIN <= temperature <= 26
            and self.HUMIDITY_MIN <= humidity <= self.HUMIDITY_MAX
        ):
            return self.MESSAGES["good_harvest"]
        if self.HUMIDITY_MAX < humidity <= self.HUMIDITY_HIGH:
            return self.MESSAGES["humidity_warning"]
        return self.MESSAGES["default"]

    def _summarize_forecast(self, daily_analysis: List[Dict]) -> Dict:
        """Summarize forecast analysis results."""
        if not daily_analysis:
            return {
                "favorable_days": 0,
                "total_days": 0, 
                "recommendation": "No forecast data available to summarize.",
            }

        good_days = sum(
            1
            for day in daily_analysis
            if day["conditions"]["harvest_suggestion"] == self.MESSAGES["good_harvest"]
        )

        total_days = len(daily_analysis) 

        return {
            "favorable_days": good_days,
            "total_days": total_days, 
            "recommendation": self._get_forecast_recommendation(
                good_days, total_days 
            ),
        }

    def _get_forecast_recommendation(self, good_days: int, total_days: int) -> str:
        """Get overall recommendation based on forecast."""
        if good_days == 0:
            return "Nenhum dia de colheita favorável no período de previsão"
        if good_days == total_days:
            return "Excelentes condições de colheita esperadas para todos os dias"
        return f"Condições favoráveis em {good_days} de {total_days} dias"
