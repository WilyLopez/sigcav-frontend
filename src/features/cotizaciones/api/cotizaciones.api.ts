import { httpClient } from "@config/http.client";
import type {
  CotizacionRequest,
  CotizacionResponse,
  CambiarEstadoCotizacionRequest,
  ApiResponse,
  PageResponse,
  EstadoCotizacion,
} from "../types/cotizaciones.types";

export const cotizacionesApi = {
  buscar: async (
    clienteId?: number,
    estado?: EstadoCotizacion | "",
    desde?: string,
    hasta?: string,
    page = 0,
    size = 20
  ) => {
    const params: any = { page, size };
    if (clienteId) params.clienteId = clienteId;
    if (estado) params.estado = estado;
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;

    const res = await httpClient.get<ApiResponse<PageResponse<CotizacionResponse>>>("/cotizaciones", {
      params,
    });
    return res.data.datos;
  },

  obtenerPorId: async (id: number) => {
    const res = await httpClient.get<ApiResponse<CotizacionResponse>>(`/cotizaciones/${id}`);
    return res.data.datos;
  },

  crear: async (data: CotizacionRequest) => {
    const res = await httpClient.post<ApiResponse<CotizacionResponse>>("/cotizaciones", data);
    return res.data.datos;
  },

  actualizar: async (id: number, data: CotizacionRequest) => {
    const res = await httpClient.put<ApiResponse<CotizacionResponse>>(`/cotizaciones/${id}`, data);
    return res.data.datos;
  },

  cambiarEstado: async (id: number, data: CambiarEstadoCotizacionRequest) => {
    const res = await httpClient.patch<ApiResponse<CotizacionResponse>>(`/cotizaciones/${id}/estado`, data);
    return res.data.datos;
  },

  reactivar: async (id: number, nuevaFechaVencimiento: string) => {
    const res = await httpClient.patch<ApiResponse<CotizacionResponse>>(
      `/cotizaciones/${id}/reactivar`,
      null,
      { params: { nuevaFechaVencimiento } }
    );
    return res.data.datos;
  },

  duplicar: async (id: number) => {
    const res = await httpClient.post<ApiResponse<CotizacionResponse>>(`/cotizaciones/${id}/duplicar`);
    return res.data.datos;
  },

  convertir: async (id: number) => {
    const res = await httpClient.post<ApiResponse<any>>(`/cotizaciones/${id}/convertir`);
    return res.data.datos;
  },
};
