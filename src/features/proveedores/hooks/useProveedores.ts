import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proveedoresApi } from "../api/proveedores.api";
import type { ProveedorRequest, CategoriaProveedorRequest } from "../types/proveedores.types";

export const useProveedoresList = (termino: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ["proveedores", "list", termino, page, size],
    queryFn: () => proveedoresApi.buscar(termino, page, size),
  });
};

export const useProveedorDetail = (id: number) => {
  return useQuery({
    queryKey: ["proveedores", "detail", id],
    queryFn: () => proveedoresApi.obtenerPorId(id),
    enabled: !!id,
  });
};

export const useCreateProveedor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProveedorRequest) => proveedoresApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
};

export const useUpdateProveedor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProveedorRequest }) =>
      proveedoresApi.actualizar(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      queryClient.invalidateQueries({ queryKey: ["proveedores", "detail", data.id] });
    },
  });
};

export const useDesactivarProveedor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => proveedoresApi.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
};

export const useActivarProveedor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => proveedoresApi.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
};

export const useCategoriasActivasList = () => {
  return useQuery({
    queryKey: ["categorias-proveedor", "activas"],
    queryFn: () => proveedoresApi.listarActivas(),
  });
};

export const useCategoriasTodasList = () => {
  return useQuery({
    queryKey: ["categorias-proveedor", "todas"],
    queryFn: () => proveedoresApi.listarTodas(),
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoriaProveedorRequest) => proveedoresApi.crearCategoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-proveedor"] });
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaProveedorRequest }) =>
      proveedoresApi.actualizarCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-proveedor"] });
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
};

export const useDesactivarCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => proveedoresApi.desactivarCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-proveedor"] });
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
};

export const useActivarCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => proveedoresApi.activarCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias-proveedor"] });
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
};
