// Importa componentes de rotas
import { Routes, Route } from "react-router-dom";

// Importa as páginas
import Home from "./pages/HomePage";
import RegionPage from "./pages/RegionPage";
import ContactPage from "./pages/ContactPage";

// Define as rotas da aplicação
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Rotas das Regiões por id de região */}
      <Route path="/region/douro" element={<RegionPage regionId={1} />} />
      <Route path="/region/minho" element={<RegionPage regionId={2} />} />
      <Route path="/region/alentejo" element={<RegionPage regionId={3} />} />
    </Routes>
  );
};

// Exporta as rotas
export default AppRoutes;