import { useSelector } from "react-redux";
import { selectWeatherStatus } from "../../stores/weatherStore";
import LoadingSpinner from "../LoadingSpinner";

const ForecastCard = ({ forecast }) => {
  const weatherStatus = useSelector(selectWeatherStatus);

  // Se ainda estiver a carregar e não houver dados de previsão, mostra o spinner
  if (weatherStatus === "loading" && !forecast) {

    return (
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800 flex items-center">
          Previsão de 3 Dias
        </h3>
        <LoadingSpinner text="A Carregar Sugestão da Colheita..." />
      </div>
    );
  }

  // Desestrutura os dados da previsão
  const { daily_analysis, summary } = forecast;

  
  // Função para colocar a primeira letra em maiúscula
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Função para formatar a data em formato curto e completo
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      short: capitalize(date.toLocaleDateString("pt-PT", { weekday: "short" })),
      full: date.toLocaleDateString("pt-PT", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  };

  return (
    <div className="bg-[#F5E1DA] p-4 md:p-6 rounded-xl shadow-sm border border-[#E8D0A9] hover:shadow-md transition-shadow">
      {/* Secção de resumo geral */}
      <div className="mb-6 p-4 bg-gradient-to-r from-[#F5E1DA] to-[#E8D0A9] rounded-lg border border-[#C28F8F]">
        <div className="flex items-start">
          <div className="flex-1">
            <div className="font-semibold text-[#5A2C2C] mb-1">
              Recomendação Geral
            </div>
            <p className="text-[#5A2C2C]/90 text-sm md:text-base mb-2">
              {summary.recommendation}
            </p>
            <div className="inline-flex items-center bg-[#F5E1DA] px-3 py-1 rounded-full text-sm border border-[#A3B899]">
              <span className="font-medium text-[#5A2C2C]">
                Dias Ideais: {summary.favorable_days} de {summary.total_days}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Secção de análise diária */}
      <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
        {daily_analysis.map((day, index) => {
          const dates = formatDate(day.date);
          return (
            <div
              key={day.date || index}
              className="border border-[#E8D0A9] rounded-lg p-4 hover:border-[#A3B899] transition-colors bg-white/50"
            >
              {/* Data do dia */}

              <div className="text-center mb-4">
                <h4 className="font-bold text-[#5A2C2C] text-lg md:hidden">
                  {dates.full}
                </h4>
                <h4 className="font-bold text-[#5A2C2C] text-base hidden md:block">
                  {dates.short}
                </h4>
                <div className="text-xs text-[#C28F8F] hidden md:block">
                  {new Date(day.date).toLocaleDateString("pt-PT", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              {/* Condições meteorológicas */}

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="bg-[#F5E1DA] p-2 rounded text-center border border-[#E8D0A9]">
                  <div className="text-xs text-[#5A2C2C]">Temperatura</div>
                  <div className="font-bold text-[#5A2C2C]">
                    {Math.round(day.conditions.temperature)}°C
                  </div>
                </div>
                <div className="bg-[#F5E1DA] p-2 rounded text-center border border-[#E8D0A9]">
                  <div className="text-xs text-[#5A2C2C]">Humidade</div>
                  <div className="font-bold text-[#5A2C2C]">
                    {Math.round(day.conditions.humidity)}%
                  </div>
                </div>
                <div className="bg-[#F5E1DA] p-2 rounded text-center border border-[#E8D0A9]">
                  <div className="text-xs text-[#5A2C2C]">Vento</div>
                  <div className="font-bold text-[#5A2C2C]">
                    {Math.round(day.conditions.wind_speed)} m/s
                  </div>
                </div>
                <div className="bg-[#F5E1DA] p-2 rounded text-center border border-[#E8D0A9]">
                  <div className="text-xs text-[#5A2C2C]">Precipitação</div>
                  <div className="font-bold text-[#5A2C2C]">
                    {Math.round(day.conditions.precipitation * 100) / 100}mm
                  </div>
                </div>
              </div>
              {/* Recomendação para a vinha */}

              <div className="mb-3 p-2 bg-[#E8D0A9]/30 rounded border border-[#A3B899]">
                <div className="text-xs font-semibold text-[#5A2C2C] mb-1 flex items-center">
                  Recomendação para a Vinha
                </div>
                <div className="text-xs text-[#5A2C2C]/90 leading-tight">
                  {day.conditions.harvest_suggestion}
                </div>
              </div>
              {/* Etiquetas informativas: rega e fungos */}
              <div className="flex flex-wrap gap-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    day.conditions.needs_irrigation
                      ? "bg-[#A3B899] text-[#5A2C2C] border border-[#5A2C2C]/20"
                      : "bg-[#E8D0A9] text-[#5A2C2C] border border-[#5A2C2C]/20"
                  }`}
                >
                  {day.conditions.needs_irrigation
                    ? "Rega Necessária"
                    : "Rega OK"}
                </span>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    day.conditions.risk_of_fungi
                      ? "bg-[#C28F8F] text-white border border-[#5A2C2C]/20"
                      : "bg-[#A3B899] text-[#5A2C2C] border border-[#5A2C2C]/20"
                  }`}
                >
                  {day.conditions.risk_of_fungi
                    ? " Risco Fungos"
                    : " Sem Fungos"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
