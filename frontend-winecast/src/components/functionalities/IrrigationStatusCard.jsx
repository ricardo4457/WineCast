import { useSelector } from "react-redux";
import { selectWeatherStatus } from "../../stores/weatherStore";
import LoadingSpinner from "../LoadingSpinner";

const IrrigationStatusCard = ({ irrigationStatus }) => {
  const weatherStatus = useSelector(selectWeatherStatus);

  // Se os dados meteorológicos ainda estiverem a carregar, mostrar spinner
  if (weatherStatus === "loading") {
    return (
      <div className="bg-[#F5E1DA] p-4 rounded-lg shadow">
        <h3 className="font-bold mb-4 text-[#3A2323]">Irrigação</h3>
        <LoadingSpinner text="A Carregar Irrigação...." />
      </div>
    );
  }

  // Se não houver estado de irrigação, não mostrar nada
  if (!irrigationStatus) {
    return null;
  }

  const { needs_irrigation } = irrigationStatus;

  return (
    <div className="bg-[#F5E1DA] p-4 rounded-lg shadow">
      <h3 className="font-bold mb-4 text-[#3A2323]">Irrigação</h3>
      
      {/* Caixa com estilo que muda consoante a necessidade de irrigação */}
      <div
        className={`p-3 rounded border-l-4 ${
          needs_irrigation
            ? "bg-[#C28F8F] border-[#903C3C] text-white"
            : "bg-[#E8D0A9] border-[#C4A56A] text-[#3A2323]"
        }`}
      >
        <p className="mt-1">
          {needs_irrigation
            ? "Irrigação necessária"
            : "Não é necessária irrigação"}
        </p>
      </div>
    </div>
  );
};

export default IrrigationStatusCard;
