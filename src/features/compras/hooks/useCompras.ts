import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { comprasApi } from "../api/compras.api";
import type { CompraRequest, CompraPedidoRequest } from "../types/compras.types";

export const useComprasList = (proveedorId?: number, desde?: string, hasta?: string) => {
  return useQuery({
    queryKey: ["compras", "list", proveedorId, desde, hasta],
    queryFn: () => comprasApi.listarCompras(proveedorId, desde, hasta),
  });
};

export const useCompraDetail = (id: number) => {
  return useQuery({
    queryKey: ["compras", "detail", id],
    queryFn: () => comprasApi.obtenerCompra(id),
    enabled: !!id,
  });
};

export const useRegistrarCompra = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompraRequest) => comprasApi.registrarCompra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },
  });
};

export const useAsignarCompraAPedido = (compraId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompraPedidoRequest) => comprasApi.asignarCompraAPedido(compraId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras", "detail", compraId] });
      queryClient.invalidateQueries({ queryKey: ["compras", compraId, "asignaciones"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};

export const useAsignacionesPorCompra = (compraId: number) => {
  return useQuery({
    queryKey: ["compras", compraId, "asignaciones"],
    queryFn: () => comprasApi.listarAsignacionesPorCompra(compraId),
    enabled: !!compraId,
  });
};

export const useEditarAsignacion = (compraId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ asignacionId, data }: { asignacionId: number; data: CompraPedidoRequest }) =>
      comprasApi.editarAsignacion(asignacionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras", "detail", compraId] });
      queryClient.invalidateQueries({ queryKey: ["compras", compraId, "asignaciones"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};

export const useEliminarAsignacion = (compraId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (asignacionId: number) => comprasApi.eliminarAsignacion(asignacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras", "detail", compraId] });
      queryClient.invalidateQueries({ queryKey: ["compras", compraId, "asignaciones"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};
