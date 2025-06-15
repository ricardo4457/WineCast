const WeatherCard = ({ temperature, humidity, wind, rain }) => {
  return (
    <div className="bg-[#F5E1DA] p-6 rounded-lg shadow-md border border-[#D8D8D8]">
      {/* Informação principal: temperatura e humidade */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-[#5A2C2C] font-medium">Temperatura</p>
          <p className="text-3xl font-bold text-[#5A2C2C]">
            {Math.round(temperature)}°C
          </p>
        </div>
        <div>
          <p className="text-[#5A2C2C] font-medium">Humidade</p>
          <p className="text-3xl font-bold text-[#5A2C2C]">
            {Math.round(humidity)}%
          </p>
        </div>
      </div>

      {/* Informação secundária: vento e chuva */}
      <div className="flex justify-between pt-4 border-t border-[#E8D0A9]">
        <div>
          <p className="text-[#5A2C2C] font-medium">Vento</p>
          <p className="text-[#A3B899] font-semibold">{wind} km/h</p>
        </div>
        <div>
          <p className="text-[#5A2C2C] font-medium">Chuva</p>
          <p className="text-[#A3B899] font-semibold">{rain} mm</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
