import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeToWeatherUpdates,
  unsubscribeFromWeatherUpdates,
  selectLastUpdated,
} from "../stores/weatherStore";

// Hook personalizado que gerencia atualizações do clima com base na latitude e longitude
export const useAllWeatherFunctions = (latitude, longitude) => {
  const dispatch = useDispatch();

  // Obtém do Redux a última vez que o clima foi atualizado
  const lastUpdated = useSelector(selectLastUpdated);

  useEffect(() => {
    // Se as coordenadas não forem válidas, não faz nada
    if (!latitude || !longitude) return;

    // Inicia a assinatura das atualizações do clima com base nas coordenadas
    dispatch(subscribeToWeatherUpdates(latitude, longitude, 3));

    // Ao desmontar o componente, cancela a assinatura
    return () => {
      dispatch(unsubscribeFromWeatherUpdates());
    };
  }, [latitude, longitude, dispatch]);

  // Retorna a data/hora da última atualização
  return { lastUpdated };
};