import { useSelector } from "react-redux";
import RegionButton from "./RegionButton";

const RegionButtonList = () => {
  // Obter a lista de regiões do estado global Redux

  const regions = useSelector((state) => state.region.regions);

  return (
    // Grid responsivo para mostrar os botões das regiões
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {regions.map((region) => (
        <RegionButton key={region.id} region={region} className="w-full" />
      ))}
    </div>
  );
};

export default RegionButtonList;
