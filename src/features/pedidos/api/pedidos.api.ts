import { httpClient } from "@config/http.client";
import type {
  PedidoResponse,
  PedidoFichaResponse,
  GastoPedidoResponse,
  CompraPedidoResponse,
  CrearPedidoRequest,
  ActualizarPedidoRequest,
  CambiarEstadoPedidoRequest,
  CrearNotaInternaRequest,
  GastoPedidoRequest,
  PageResponse,
  EstadoPedido,
} from "../types/pedidos.types";

export interface ApiResponse<T> {
  mensaje: string;
  datos: T;
  exito: boolean;
}

export const pedidosApi = {
  buscar: async (
    clienteId?: number,
    estado?: EstadoPedido,
    desdeIngreso?: string,
    hastaIngreso?: string,
    page = 0,
    size = 20
  ) => {
    const res = await httpClient.get<ApiResponse<PageResponse<PedidoResponse>>>("/pedidos", {
      params: { clienteId, estado, desdeIngreso, hastaIngreso, page, size },
    });
    return res.data.datos;
  },

  obtenerFicha: async (id: number) => {
    const res = await httpClient.get<ApiResponse<PedidoFichaResponse>>(`/pedidos/${id}`);
    return res.data.datos;
  },

  crear: async (data: CrearPedidoRequest) => {
    const res = await httpClient.post<ApiResponse<PedidoResponse>>("/pedidos", data);
    return res.data.datos;
  },

  actualizar: async (id: number, data: ActualizarPedidoRequest) => {
    const res = await httpClient.put<ApiResponse<PedidoResponse>>(`/pedidos/${id}`, data);
    return res.data.datos;
  },

  cambiarEstado: async (id: number, data: CambiarEstadoPedidoRequest) => {
    const res = await httpClient.patch<ApiResponse<PedidoResponse>>(`/pedidos/${id}/estado`, data);
    return res.data.datos;
  },

  agregarNota: async (id: number, data: CrearNotaInternaRequest) => {
    const res = await httpClient.post<ApiResponse<any>>(`/pedidos/${id}/notas`, data);
    return res.data.datos;
  },

  registrarGasto: async (pedidoId: number, data: GastoPedidoRequest) => {
    const res = await httpClient.post<GastoPedidoResponse>(`/pedidos/${pedidoId}/gastos`, data);
    return res.data;
  },

  listarGastos: async (pedidoId: number) => {
    const res = await httpClient.get<GastoPedidoResponse[]>(`/pedidos/${pedidoId}/gastos`);
    return res.data;
  },

  listarAsignaciones: async (pedidoId: number) => {
    const res = await httpClient.get<CompraPedidoResponse[]>(`/pedidos/${pedidoId}/asignaciones`);
    return res.data;
  },

  editarGasto: async (gastoId: number, data: GastoPedidoRequest) => {
    const res = await httpClient.put<GastoPedidoResponse>(`/pedidos/gastos/${gastoId}`, data);
    return res.data;
  },

  eliminarGasto: async (gastoId: number) => {
    await httpClient.delete(`/pedidos/gastos/${gastoId}`);
  },
};
