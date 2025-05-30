class VineyardRules:
    @staticmethod
    def check_irrigation(temp, humidity, rain):
        """
        Regra: Temp > 25°C, umidade < 60% e sem chuva nas últimas 24h
        """
        return temp > 25 and humidity < 60 and rain == 0

    @staticmethod
    def check_fungus_risk(humidity, temp, rain):
        """
        Regra: Umidade > 80%, temperatura entre 15-25°C e chuva recente
        """
        return humidity > 80 and 15 < temp < 25 and rain > 0

    @staticmethod
    def suggest_harvest(weather_data):
        """
        Sugestão de colheita baseada em estabilidade climática
        """
        if not weather_data:
            return False
            
        # Verifica se há previsão de chuva nos próximos dias
        rain_forecast = any(day.get('rain', 0) > 0 for day in weather_data.get('forecast', []))
        
        # Verifica condições atuais favoráveis
        current_conditions = (
            15 < weather_data['temp'] < 25 and 
            weather_data['humidity'] < 70 and
            weather_data['wind_speed'] < 10
        )
        
        return current_conditions and not rain_forecast