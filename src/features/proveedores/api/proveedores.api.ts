import { httpClient } from "@config/http.client";
import type {
  ProveedorRequest,
  ProveedorResumen,
  ProveedorDetalle,
  CategoriaProveedor,
  CategoriaProveedorRequest,
  PageResponse,
} from "../types/proveedores.types";

export const proveedoresApi = {
  buscar: async (termino: string, page = 0, size = 20) => {
    const res = await httpClient.get<PageResponse<ProveedorResumen>>("/proveedores", {
      params: { termino, page, size },
    });
    return res.data;
  },

  obtenerPorId: async (id: number) => {
    const res = await httpClient.get<ProveedorDetalle>(`/proveedores/${id}`);
    return res.data;
  },

  crear: async (data: ProveedorRequest) => {
    const res = await httpClient.post<ProveedorDetalle>("/proveedores", data);
    return res.data;
  },

  actualizar: async (id: number, data: ProveedorRequest) => {
    const res = await httpClient.put<ProveedorDetalle>(`/proveedores/${id}`, data);
    return res.data;
  },

  desactivar: async (id: number) => {
    await httpClient.patch(`/proveedores/${id}/desactivar`);
  },

  activar: async (id: number) => {
    await httpClient.patch(`/proveedores/${id}/activar`);
  },

  listarActivas: async () => {
    const res = await httpClient.get<CategoriaProveedor[]>("/categorias-proveedor");
    return res.data;
  },

  listarTodas: async () => {
    const res = await httpClient.get<CategoriaProveedor[]>("/categorias-proveedor/todas");
    return res.data;
  },

  crearCategoria: async (data: CategoriaProveedorRequest) => {
    const res = await httpClient.post<CategoriaProveedor>("/categorias-proveedor", data);
    return res.data;
  },

  actualizarCategoria: async (id: number, data: CategoriaProveedorRequest) => {
    const res = await httpClient.put<CategoriaProveedor>(`/categorias-proveedor/${id}`, data);
    return res.data;
  },

  desactivarCategoria: async (id: number) => {
    await httpClient.patch(`/categorias-proveedor/${id}/desactivar`);
  },

  activarCategoria: async (id: number) => {
    await httpClient.patch(`/categorias-proveedor/${id}/activar`);
  },
};
