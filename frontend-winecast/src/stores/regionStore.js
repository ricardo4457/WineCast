// Importa função do Redux Toolkit para criar um slice
import { createSlice } from "@reduxjs/toolkit";

// Estado inicial com 3 regiões: Douro, Minho, Alentejo
const initialState = {
  regions: [
    {
      id: 1,
      name: "Douro",
      description:
        "A região do Douro é uma das mais antigas e emblemáticas regiões vinícolas do mundo, classificada como Património Mundial pela UNESCO. Com paisagens de vinhas em socalcos ao longo do rio Douro, é especialmente conhecida pela produção de Vinho do Porto e vinhos tintos encorpados, ricos em aroma e sabor.",
      coordinates: { lat: 41.1628, lon: -7.7869 },
      images: [
        "/assets/douro/douro_1.jpg",
        "/assets/douro/douro_2.jpg",
        "/assets/douro/douro_3.jpg",
      ],
    },
    {
      id: 2,
      name: "Minho",
      description:
        "Situada no norte de Portugal, a região do Minho é conhecida pelo seu clima húmido e paisagens verdejantes. Monção e Melgaço destacam-se na produção do famoso Alvarinho, um vinho branco leve, fresco e aromático, ideal para acompanhar pratos leves e mariscos.",
      coordinates: { lat: 42.0753, lon: -8.4825 },
      images: [
        "/assets/minho/minho_1.jpg",
        "/assets/minho/minho_2.jpg",
        "/assets/minho/minho_3.jpg",
      ],
    },
    {
      id: 3,
      name: "Alentejo",
      description:
        "O Alentejo é uma vasta região do sul de Portugal, com clima quente e seco, planícies douradas e história milenar. Os seus vinhos são encorpados e frutados, com destaque para os tintos suaves e fáceis de beber, muito apreciados tanto em Portugal como no estrangeiro.",
      coordinates: { lat: 38.5664, lon: -7.9077 },
      images: [
        "/assets/alentejo/alentejo_1.png",
        "/assets/alentejo/alentejo_2.jpg",
        "/assets/alentejo/alentejo_3.jpg",
      ],
    },
  ],
  selectedRegion: null, // Região selecionada pelo utilizador
};

const regionSlice = createSlice({
  name: "region", // Nome da slice
  initialState, // Estado inicial definido acima
  reducers: {
        // Redutor para selecionar uma região com base no ID
    setSelectedRegion: (state, action) => {
      state.selectedRegion = state.regions.find(
        (region) => region.id === action.payload
      );
    },
  },
});
// Exporta a ação para uso nos componentes (ex: dispatch(setSelectedRegion(2)))
export const { setSelectedRegion } = regionSlice.actions;

// Exporta o reducer para ser incluído na store Redux principal
export default regionSlice.reducer;
