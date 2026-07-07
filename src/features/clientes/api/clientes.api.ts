import { httpClient } from "@config/http.client";
import type {
  ClienteRequest,
  ClienteResumenResponse,
  ClienteDetalleResponse,
  ClienteFichaResponse,
  ContactoClienteRequest,
  ContactoClienteResponse,
  PageResponse,
} from "../types/clientes.types";

export const clientesApi = {
  buscar: async (termino: string, page = 0, size = 20) => {
    const res = await httpClient.get<PageResponse<ClienteResumenResponse>>("/clientes", {
      params: { termino, page, size },
    });
    return res.data;
  },

  obtenerPorId: async (id: number) => {
    const res = await httpClient.get<ClienteDetalleResponse>(`/clientes/${id}`);
    return res.data;
  },

  obtenerFicha: async (id: number) => {
    const res = await httpClient.get<ClienteFichaResponse>(`/clientes/${id}/ficha`);
    return res.data;
  },

  crear: async (data: ClienteRequest) => {
    const res = await httpClient.post<ClienteDetalleResponse>("/clientes", data);
    return res.data;
  },

  actualizar: async (id: number, data: ClienteRequest) => {
    const res = await httpClient.put<ClienteDetalleResponse>(`/clientes/${id}`, data);
    return res.data;
  },

  desactivar: async (id: number) => {
    await httpClient.patch(`/clientes/${id}/desactivar`);
  },

  activar: async (id: number) => {
    await httpClient.patch(`/clientes/${id}/activar`);
  },

  listarContactos: async (clienteId: number) => {
    const res = await httpClient.get<ContactoClienteResponse[]>(`/clientes/${clienteId}/contactos`);
    return res.data;
  },

  crearContacto: async (clienteId: number, data: ContactoClienteRequest) => {
    const res = await httpClient.post<ContactoClienteResponse>(`/clientes/${clienteId}/contactos`, data);
    return res.data;
  },

  actualizarContacto: async (clienteId: number, contactoId: number, data: ContactoClienteRequest) => {
    const res = await httpClient.put<ContactoClienteResponse>(
      `/clientes/${clienteId}/contactos/${contactoId}`,
      data
    );
    return res.data;
  },

  eliminarContacto: async (clienteId: number, contactoId: number) => {
    await httpClient.delete(`/clientes/${clienteId}/contactos/${contactoId}`);
  },
};
