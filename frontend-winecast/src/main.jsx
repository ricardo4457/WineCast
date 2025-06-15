import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Ferramentas do Redux
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
// Importa os reducers do estado global
import weatherReducer from "./stores/weatherStore.js";
import regionReducer from "./stores/regionStore.js";
import explanationsReducer from "./stores/explanationsStore.js";

// Cria a store Redux com os reducers
const store = configureStore({
  reducer: {
    weather: weatherReducer, // Estado do tempo
    region: regionReducer, // Estado das regiões
    explanations: explanationsReducer, // Estado das explicações
  },
});


// Renderiza a aplicação na página
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
