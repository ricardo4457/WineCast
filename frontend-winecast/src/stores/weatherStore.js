// Importações necessárias do Redux Toolkit, Axios e Socket.IO
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";

// Endereços da API e do servidor de sockets
const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

let socket = null;

// Função para criar e obter a instância do socket
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,  // permite enviar cookies para autenticar
    });

    socket.on("connect", () => {
      console.log("Socket Ligado:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket Desligado");
    });

    socket.on("weather_error", (error) => {
      console.error("Erro de Socket:", error);
    });
  }
  return socket;
};

// Valida se os parâmetros são números válidos
const validateNumberParams = (params) => {
  const validated = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      throw new Error(`Faltam Parâmetros : ${key}`);
    }
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Valor inválido para ${key}: tem que ser um número`);
    }
    validated[key] = num; // Adiciona o valor validado ao objeto
  }
  return validated;
};

// Ação assíncrona para buscar o clima atual
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ lat, lon }) => {
    try {
      const params = validateNumberParams({ lat, lon });
      const response = await axios.get(`${API_URL}/weather`, { params });
      // console.log("Weather response:", response.data);
      return response.data.payload;   // Retorna os dados do clima
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Ação assíncrona para analisar o clima
export const analyzeWeather = createAsyncThunk(
  "weather/analyzeWeather",
  async ({ temperature, humidity, precipitation = 0, wind_speed = 0 }) => {
    try {
      const response = await axios.post(`${API_URL}/weather/analyze`, {
        temperature,
        humidity,
        precipitation,
        wind_speed,
      }); // Envia os dados meteorológicos para análise
      // console.log("Analysis response:", response.data);
      return response.data; 
    } catch (error) {
      throw new Error(error);
    }
  }
);

// Ação assíncrona para analisar humidade e temperatura
export const analyzeHumidity = createAsyncThunk(
  "weather/analyzeHumidity",
  async ({ humidity, temperature }) => {
    try {
      const response = await axios.post(`${API_URL}/weather/analyze-humidity`, {
        humidity,
        temperature,
      });// Envia os dados para análise de humidade
      // console.log("Humidity analysis response:", response.data);
      return response.data; // Retorna os resultados da análise
    } catch (error) {
      throw new Error(error);
    }
  }
);

// Ação assíncrona para verificar necessidade de irrigação
export const checkIrrigation = createAsyncThunk(
  "weather/checkIrrigation",
  async ({ temperature, precipitation }) => {
    try {
      const response = await axios.post(`${API_URL}/weather/irrigation-check`, {
        temperature,
        precipitation,
      }); // Envia os dados meteorológicos para verificar irrigação
      // console.log("Irrigation check response:", response.data);
      return response.data; // Retorna o estado de irrigação
    } catch (error) {
      throw new Error(error);
    }
  }
);

// Ação assíncrona para obter previsão meteorológica
export const getForecast = createAsyncThunk(
  "weather/getForecast",
  async ({ lat, lon, days = 3 }) => {
    try {
      const response = await axios.get(
        `${API_URL}/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`
      );// Faz a chamada à API para obter a previsão
      // console.log("Forecast response:", response.data);
      return response.data; // Retorna os dados da previsão
    } catch (error) {
      throw new Error(error);
    }
  }
);

// Criação do slice Redux para gerir o estado meteorológico
const weatherStore = createSlice({
  name: "weather",
  initialState: {
    currentWeather: null,
    forecast: null,
    analysis: null, 
    irrigationStatus: null, 
    status: "idle",
    error: null,
    lastUpdated: null,
    socketError: null, 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.socketError = null;
    },
    resetWeather: (state) => {
      state.currentWeather = null;
      state.forecast = null;
      state.analysis = null;
      state.irrigationStatus = null;
      state.status = "idle";
      state.error = null;
      state.socketError = null;
      state.lastUpdated = null;
    },
    setCurrentWeatherFromSocket: (state, action) => {
      state.currentWeather = action.payload;
      state.status = "succeeded";
      state.lastUpdated = new Date().toISOString();
      state.socketError = null;
    },
    setAnalysisFromSocket: (state, action) => {
      state.analysis = action.payload; 
      state.status = "succeeded";
      state.lastUpdated = new Date().toISOString();
      state.socketError = null;
    },
    setIrrigationStatusFromSocket: (state, action) => {
      state.irrigationStatus = action.payload;
      state.status = "succeeded";
      state.lastUpdated = new Date().toISOString();
      state.socketError = null;
    },
    setForecastFromSocket: (state, action) => {
      state.forecast = action.payload;
      state.status = "succeeded";
      state.lastUpdated = new Date().toISOString();
      state.socketError = null;
    },
    setSocketError: (state, action) => {
      state.socketError = action.payload;
      state.status = "failed";
    },
    setWeatherLoading: (state) => {
      state.status = "loading";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentWeather = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getForecast.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getForecast.fulfilled, (state, action) => {
        state.forecast = action.payload; 
        state.status = "succeeded";
      })
      .addCase(getForecast.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(analyzeWeather.pending, (state) => {
        state.status = "analyzing";
      })
      .addCase(analyzeWeather.fulfilled, (state, action) => {
        state.analysis = { 
            risk_of_fungi: action.payload.risk_of_fungi,
            harvest_suggestion: action.payload.harvest_suggestion
        };
        state.irrigationStatus = {
            needs_irrigation: action.payload.needs_irrigation,
        };
        state.status = "succeeded";
      })
      .addCase(analyzeWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(analyzeHumidity.fulfilled, (state, action) => {
        if (state.analysis) {
            state.analysis.risk_of_fungi = action.payload.risk_of_fungi;
        } else {
            state.analysis = { risk_of_fungi: action.payload.risk_of_fungi };
        }
      })


      .addCase(checkIrrigation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkIrrigation.fulfilled, (state, action) => {
        state.irrigationStatus = action.payload;
        state.status = "succeeded";
      })
      .addCase(checkIrrigation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Exportação das ações e seletores
export const {
  clearError,
  resetWeather,
  setCurrentWeatherFromSocket,
  setAnalysisFromSocket,
  setIrrigationStatusFromSocket,
  setForecastFromSocket,
  setSocketError,
  setWeatherLoading
} = weatherStore.actions;

// Função para subscrever a atualizações meteorológicas via socket
export const subscribeToWeatherUpdates = (latitude, longitude, days = 3) => (dispatch) => {
  const socketClient = getSocket();

  dispatch(setWeatherLoading()); // Define estado do loading

  // Remove eventos anteriores para evitar duplicação
  socketClient.off('current_weather_update');
  socketClient.off('analysis_update');
  socketClient.off('irrigation_status_update');
  socketClient.off('forecast_update');
  socketClient.off('weather_error');


  // Configura eventos para receber atualizações via socket
  socketClient.on('current_weather_update', (data) => {
    console.log("Received current_weather_update:", data);
    dispatch(setCurrentWeatherFromSocket(data));
  });

  socketClient.on('analysis_update', (data) => {
    console.log("Received analysis_update:", data);
    dispatch(setAnalysisFromSocket(data));
  });

  socketClient.on('irrigation_status_update', (data) => {
    console.log("Received irrigation_status_update:", data);
    dispatch(setIrrigationStatusFromSocket(data));
  });

  socketClient.on('forecast_update', (data) => {
    console.log("Received forecast_update:", data);
    dispatch(setForecastFromSocket(data));
  });
  
  socketClient.on('weather_error', (error) => {
    console.error("Received weather_error from socket:", error);
    dispatch(setSocketError(error.error || 'Unknown socket error'));
  });

  socketClient.emit('subscribe_to_weather', { lat: latitude, lon: longitude, days });
};

// Função para cancelar subscrição de atualizações meteorológicas
export const unsubscribeFromWeatherUpdates = () => () => {
  const socketClient = getSocket();
  socketClient.off('current_weather_update');
  socketClient.off('analysis_update');
  socketClient.off('irrigation_status_update');
  socketClient.off('forecast_update');
  socketClient.off('weather_error');
  console.log("Unsubscribed from weather updates");
};

// Seletores para obter partes específicas do estado
export const selectWeatherData = (state) => state.weather;
export const selectWeatherError = (state) => state.weather.error || state.weather.socketError; 
export const selectWeatherStatus = (state) => state.weather.status;
export const selectCurrentWeather = (state) => state.weather.currentWeather;
export const selectForecast = (state) => state.weather.forecast;
export const selectAnalysis = (state) => state.weather.analysis; 
export const selectIrrigationStatus = (state) => state.weather.irrigationStatus;
export const selectLastUpdated = (state) => state.weather.lastUpdated; 

export default weatherStore.reducer;