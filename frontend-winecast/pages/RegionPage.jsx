// Importações necessárias do Redux e React
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

// Ação para atualizar a região selecionada
import { setSelectedRegion } from "../stores/regionStore";
import RegionBanner from "../components/banners/RegionBanner";
// Seletoras de estado
import {
  selectCurrentWeather,
  selectWeatherStatus,
  selectForecast,
  selectAnalysis,
  selectIrrigationStatus,
} from "../stores/weatherStore";

// Hook personalizado que ativa atualizações automáticas do tempo
import { useAllWeatherFunctions } from "../hooks/useWeatherAutoUpdate";

// Componentes visuais
import WeatherCard from "../components/weather/WeatherCard";
import IrrigationStatusCard from "../components/functionalities/IrrigationStatusCard";
import ForecastCard from "../components/functionalities/ForecastCard";
import FungiCard from "../components/functionalities/FungiCard";

import LoadingSpinner from "../components/LoadingSpinner";
import LiveStatusFooter from "../components/LiveStatusFooter";

// Página da região (detalhes e dados em tempo real)
const RegionPage = ({ regionId }) => {
  const dispatch = useDispatch();

  // Procurar dados do estado global
  const selectedRegion = useSelector((state) => state.region.selectedRegion);
  const currentWeather = useSelector(selectCurrentWeather);
  const weatherStatus = useSelector(selectWeatherStatus);
  const forecast = useSelector(selectForecast);
  const analysis = useSelector(selectAnalysis);
  const irrigationStatus = useSelector(selectIrrigationStatus);

  // Sempre que o ID da região mudar, atualizar a região selecionada no estado
  useEffect(() => {
    dispatch(setSelectedRegion(regionId));
  }, [regionId, dispatch]);

  // Ativa atualizações automáticas do tempo com base nas coordenadas da região
  const { lastUpdated } = useAllWeatherFunctions(
    selectedRegion?.coordinates?.lat,
    selectedRegion?.coordinates?.lon
  );

  // Enquanto a região não estiver pronta e não estiver a carregar, mostra mensagem
  if (!selectedRegion && weatherStatus !== "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner text="A carregar região... Preparar o terreno" />
      </div>
    );
  }
  // Se os dados meteorológicos ainda estiverem a carregar
  if (weatherStatus === "loading" && !currentWeather) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner text="A Espreitar os céus..." />
      </div>
    );
  }

  // Página principal
  return (
    <div className="bg-[#FAF4F0] from-blue-50 to-green-50 min-h-screen">
      {selectedRegion && <RegionBanner region={selectedRegion} />}

      {/* Conteúdo principal */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-[#6F4B30] mb-4 flex items-center">
            Temperatura e Humidade Atual
          </h2>
          {/* Cartão de tempo atual */}
          {weatherStatus === "loading" && !currentWeather && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <LoadingSpinner text="A verificar o clima atual... Um momento por favor" />
            </div>
          )}

          {currentWeather && (
            <WeatherCard
              temperature={currentWeather.temperature}
              humidity={currentWeather.humidity}
              wind={currentWeather.wind_speed}
              rain={currentWeather.precipitation}
            />
          )}
        </div>
        {/* Risco de fungos */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-[#6F4B30] mb-6 flex items-center">
            Risco de Fungos
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {analysis ? (
              <FungiCard analysis={analysis} />
            ) : weatherStatus === "loading" ? (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <LoadingSpinner text="A analisar risco de fungos... A investigar o ambiente" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Necessidade de rega */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-[#6F4B30] mb-6 flex items-center">
            Avaliar Necessidade de Rega
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {irrigationStatus ? (
              <IrrigationStatusCard irrigationStatus={irrigationStatus} />
            ) : weatherStatus === "loading" ? (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <LoadingSpinner text="A avaliar necessidade de rega... A medir a secura" />
              </div>
            ) : null}
          </div>
        </div>
        {/* Sugestão de colheita com base na previsão */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-[#6F4B30] mb-6 flex items-center">
            Sugestão de Colheita
          </h2>
          {forecast ? (
            <ForecastCard forecast={forecast} />
          ) : weatherStatus === "loading" ? (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <LoadingSpinner text="A preparar sugestão de colheita... A estudar as condições" />
            </div>
          ) : null}
        </div>
        
        {/* Rodapé com informação da última atualização */}
        <LiveStatusFooter lastUpdated={lastUpdated} />
      </div>
    </div>
  );
};

export default RegionPage;
