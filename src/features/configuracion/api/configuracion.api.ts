import { httpClient } from "@config/http.client";
import type {
  ParametroSistemaResponse,
  ActualizarParametroRequest,
  LogAuditoriaResponse,
  PageResponse,
} from "../types/configuracion.types";

export interface ApiResponse<T> {
  mensaje: string;
  datos: T;
  exito: boolean;
}

export const configuracionApi = {
  listarParametros: async () => {
    const res = await httpClient.get<ApiResponse<ParametroSistemaResponse[]>>("/configuracion");
    return res.data.datos;
  },

  actualizarParametro: async (clave: string, data: ActualizarParametroRequest) => {
    const res = await httpClient.patch<ApiResponse<ParametroSistemaResponse>>(`/configuracion/${clave}`, data);
    return res.data.datos;
  },

  listarLogs: async (desde: string, hasta: string, pagina = 0, tamanio = 20) => {
    const res = await httpClient.get<ApiResponse<PageResponse<LogAuditoriaResponse>>>("/auditoria", {
      params: { desde, hasta, pagina, tamanio },
    });
    return res.data.datos;
  },
};
