import { useSelector } from "react-redux";
import { selectWeatherStatus } from "../../stores/weatherStore";
import LoadingSpinner from "../LoadingSpinner";

const FungiCard = ({ analysis }) => {
  const weatherStatus = useSelector(selectWeatherStatus);

    // Se o estado do tempo ainda estiver a carregar, mostra um spinner com mensagem
  if (weatherStatus === "loading") {
    return (
      <div className="bg-[#F5E1DA] p-4 md:p-6 rounded-xl shadow-md border border-[#E8D0A9]">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-[#3A2323] flex items-center">
          Análise do Geral
        </h3>
        <LoadingSpinner text="A Carregar Análise..." />
      </div>
    );
  }

  // Se não existir análise, não mostra nada
  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-[#F5E1DA] p-4 md:p-6 rounded-xl shadow-md border border-[#E8D0A9] hover:shadow-lg transition-shadow">
      
      {/* Mensagem dinâmica com base no risco de fungos */}
      <div className="space-y-3">  
        <div className={`p-3 rounded-lg border-l-4 ${
          analysis.risk_of_fungi 
            ? 'bg-[#C28F8F]/20 border-[#903C3C]' 
            : 'bg-[#A3B899]/20 border-[#5A724F]'
        }`}>
          <div className="flex items-start">
            <div>
              <div className={`text-sm ${
                analysis.risk_of_fungi ? 'text-[#903C3C]' : 'text-[#5A724F]'
              }`}>
                {analysis.risk_of_fungi ? 'Risco Elevado' : 'Risco Baixo'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FungiCard;