// Importa a função para criar um slice do Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Estado inicial com explicações das funções inteligentes
const initialState = {
  functionExplanations: [ // Lista de funções inteligentes disponíveis
    {
      id: "analyze-humidity",
      title: "Temperatura e Humidade Atual",
      function: "analyze_weather_data", 
      description:
        "Analisa os níveis atuais de temperatura e humidade.",
      details: {
        purpose:
          "Avaliação instantânea de condições climáticas para decisões agrícolas",
        parameters: ["Temperatura", "Humidade", "Precipitação", "Vento"],
        importance:
          "Permite decisões rápidas baseadas em dados climáticos atuais",
        usage:
          "Usado para avaliar necessidade de rega, risco de fungos e determinar se é um bom momento para colher",
      },
    },
    {
      id: "fungi-check",
      title: "Risco de Fungos",
      function: "risk_of_fungi",
      description:
        "Verifica se as condições climáticas atuais são propícias ao desenvolvimento de fungos com base na humidade e temperatura.",
      details: {
        purpose: "Identificar risco de fungo devido à humidade e temperatura",
        parameters: ["Humidade", "Temperatura"],
        importance: "Ajuda a prevenir doenças fúngicas na vinha",
        usage:
          "Usado para o acompanhamento contínuo e tomada de decisão de tratamentos",
      },
    },
    {
      id: "irrigation-check",
      title: "Avaliar Necessidade de Rega",
      function: "needs_irrigation",
      description:
        "Determina a necessidade de irrigação com base na temperatura e ausência de precipitação.",
      details: {
        purpose: "Aperfeiçoar o uso da água na vinha",
        parameters: ["Temperatura", "Precipitação"],
        importance: "Contribui para sustentabilidade e economia de recursos",
        usage:
          "Indica se a temperatura está elevada e não houve chuva, advertindo a necessidade de rega",
      },
    },
    {
      id: "harvest-suggestion",
      title: "Sugestão de Colheita",
      function: "analyze_forecast",
      description:
        "Analisa a previsão dos próximos dias para sugerir o momento ideal de colheita com base em condições meteorológicas.",
      details: {
        purpose: "Melhorar a qualidade e rendimento da colheita",
        parameters: ["Temperatura", "Humidade", " 3 Dias"],
        importance: "Ajuda na gestão estratégica da vindima",
        usage:
          "Fornece uma análise diária com sugestões de colheita e resumo geral do período",
      },
    },
  ],
  selectedFunction: null, // Função selecionada no momento
  loading: false,  // Estado de carregamento
};

// Cria o slice Redux
const explanationsSlice = createSlice({
  name: "explanations",
  initialState,
  reducers: {
        // Define a função selecionada, com base no ID
    setSelectedFunction: (state, action) => {
      state.selectedFunction = state.functionExplanations.find(
        (func) => func.id === action.payload
      );
      state.error = null;
    },
  },
});

// Exporta as ações (algumas parecem não existir no slice — podem ter sido pensadas para expansão futura)
export const {
  setSelectedFunction,
  clearSelectedFunction,
  setLoading,
  setError,
  clearError,
  updateFunctionExplanation,
} = explanationsSlice.actions;

// Selectors para aceder facilmente ao estado
export const selectFunctionExplanations = (state) =>
  state.explanations.functionExplanations;
export const selectSelectedFunction = (state) =>
  state.explanations.selectedFunction;
export const selectExplanationsLoading = (state) => state.explanations.loading;
export const selectExplanationsError = (state) => state.explanations.error;

// Exporta o reducer para ser usado na store principal
export default explanationsSlice.reducer;
