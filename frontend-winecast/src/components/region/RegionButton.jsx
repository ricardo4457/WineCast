import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedRegion } from "../../stores/regionStore";

const RegionButton = ({ region }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Verificar se esta região está selecionada no estado global
  const selected = useSelector(
    (state) => state.region.selectedRegion?.id === region.id
  );

  const handleClick = () => {
    // Atualizar a região selecionada no Redux
    dispatch(setSelectedRegion(region.id));

    // Navegar para a página correspondente à região selecionada
    if (region.id === 1) navigate("/region/douro");
    if (region.id === 2) navigate("/region/minho");
    if (region.id === 3) navigate("/region/alentejo");
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative w-full p-6 rounded-lg border-2 transition-all duration-200
        ${
          selected
            ? "border-[#5A2C2C] bg-[#F5E1DA] shadow-md"
            : "border-[#D8D8D8] bg-white hover:border-[#A3B899] hover:shadow-sm"
        }
      `}
    >
      <div className="text-left">
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`text-xl font-semibold ${
              selected ? "text-[#5A2C2C]" : "text-gray-900"
            }`}
          >
            {region.name}
          </h3>
          {/* Indicador visual se a região está selecionada */}
          {selected && (
            <div className="w-3 h-3 bg-[#E8D0A9] rounded-full"></div>
          )}
        </div>

        <p
          className={`text-sm leading-relaxed ${
            selected ? "text-[#C28F8F]" : "text-gray-600"
          }`}
        >
          {region.description}
        </p>
      </div>

      {/* Sombra subtil no hover para regiões não selecionadas */}
      {!selected && (
        <div className="absolute inset-0 bg-[#A3B899] opacity-0 hover:opacity-10 transition-opacity duration-200 rounded-lg"></div>
      )}
    </button>
  );
};

export default RegionButton;
