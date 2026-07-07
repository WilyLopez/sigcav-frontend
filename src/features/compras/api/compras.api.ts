import { httpClient } from "@config/http.client";
import type {
  CompraRequest,
  CompraResponse,
  CompraPedidoRequest,
  CompraPedidoResponse,
} from "../types/compras.types";

export const comprasApi = {
  registrarCompra: async (data: CompraRequest) => {
    const res = await httpClient.post<CompraResponse>("/compras", data);
    return res.data;
  },

  obtenerCompra: async (id: number) => {
    const res = await httpClient.get<CompraResponse>(`/compras/${id}`);
    return res.data;
  },

  listarCompras: async (proveedorId?: number, desde?: string, hasta?: string) => {
    const res = await httpClient.get<CompraResponse[]>("/compras", {
      params: { proveedorId, desde, hasta },
    });
    return res.data;
  },

  asignarCompraAPedido: async (compraId: number, data: CompraPedidoRequest) => {
    const res = await httpClient.post<CompraPedidoResponse>(`/compras/${compraId}/asignaciones`, data);
    return res.data;
  },

  listarAsignacionesPorCompra: async (compraId: number) => {
    const res = await httpClient.get<CompraPedidoResponse[]>(`/compras/${compraId}/asignaciones`);
    return res.data;
  },

  editarAsignacion: async (asignacionId: number, data: CompraPedidoRequest) => {
    const res = await httpClient.put<CompraPedidoResponse>(`/compras/asignaciones/${asignacionId}`, data);
    return res.data;
  },

  eliminarAsignacion: async (asignacionId: number) => {
    await httpClient.delete(`/compras/asignaciones/${asignacionId}`);
  },
};
