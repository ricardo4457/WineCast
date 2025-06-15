import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./components/Navigation";
// Importa as rotas definidas da aplicação
import AppRoutes from "./AppRoutes";

// Componente principal da aplicação
function App() {
  return (
        // Envolve a aplicação com o Router para permitir navegação entre páginas
    <Router>
      <div className="app-container">
        <Navigation />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
