import { httpClient } from "@config/http.client";
import type {
  PagoRequest,
  PagoResponse,
  NotaCorreccionPagoRequest,
  NotaCorreccionPagoResponse,
} from "../types/pagos.types";

export const pagosApi = {
  registrarPago: async (data: PagoRequest) => {
    const res = await httpClient.post<PagoResponse>("/pagos", data);
    return res.data;
  },

  corregirPago: async (data: NotaCorreccionPagoRequest) => {
    const res = await httpClient.post<NotaCorreccionPagoResponse>("/pagos/correcciones", data);
    return res.data;
  },

  listarPorPedido: async (pedidoId: number) => {
    const res = await httpClient.get<PagoResponse[]>(`/pagos/pedido/${pedidoId}`);
    return res.data;
  },

  listarCorrecciones: async (pagoId: number) => {
    const res = await httpClient.get<NotaCorreccionPagoResponse[]>(`/pagos/${pagoId}/correcciones`);
    return res.data;
  },
};
