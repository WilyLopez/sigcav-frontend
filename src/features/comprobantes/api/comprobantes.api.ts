import { httpClient } from "@config/http.client";
import type {
  ComprobanteRequest,
  ComprobanteResponse,
  AnulacionComprobanteRequest,
  AnulacionComprobanteResponse,
  TipoComprobante,
} from "../types/comprobantes.types";

export const comprobantesApi = {
  emitir: async (data: ComprobanteRequest) => {
    const res = await httpClient.post<ComprobanteResponse>("/comprobantes", data);
    return res.data;
  },

  anular: async (data: AnulacionComprobanteRequest) => {
    const res = await httpClient.post<AnulacionComprobanteResponse>("/comprobantes/anular", data);
    return res.data;
  },

  obtenerPorId: async (id: number) => {
    const res = await httpClient.get<ComprobanteResponse>(`/comprobantes/${id}`);
    return res.data;
  },

  obtenerPorPedido: async (pedidoId: number) => {
    const res = await httpClient.get<ComprobanteResponse>(`/comprobantes/pedido/${pedidoId}`);
    return res.data;
  },

  listarPorFiltros: async (desde: string, hasta: string, tipo?: TipoComprobante) => {
    const res = await httpClient.get<ComprobanteResponse[]>("/comprobantes", {
      params: { desde, hasta, tipo },
    });
    return res.data;
  },
};
