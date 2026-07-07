import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configuracionApi } from "../api/configuracion.api";
import type { ActualizarParametroRequest } from "../types/configuracion.types";

export const useListarParametros = () => {
  return useQuery({
    queryKey: ["configuracion", "parametros"],
    queryFn: () => configuracionApi.listarParametros(),
  });
};

export const useActualizarParametro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clave, data }: { clave: string; data: ActualizarParametroRequest }) =>
      configuracionApi.actualizarParametro(clave, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracion", "parametros"] });
    },
  });
};

export const useListarLogs = (desde: string, hasta: string, pagina = 0, tamanio = 20) => {
  return useQuery({
    queryKey: ["auditoria", "logs", desde, hasta, pagina, tamanio],
    queryFn: () => configuracionApi.listarLogs(desde, hasta, pagina, tamanio),
    enabled: !!desde && !!hasta,
  });
};
