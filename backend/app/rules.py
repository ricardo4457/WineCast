class VineyardRules:
    @staticmethod
    def check_irrigation(temp, rain):
        # Regra: Temp > 25°C e sem chuva
        return temp > 25 and rain == 0

    @staticmethod
    def check_fungus_risk(humidity, temp):
        # Regra: Umidade > 80% e temperatura entre 15-25°C
        return humidity > 80 and 15 < temp < 25