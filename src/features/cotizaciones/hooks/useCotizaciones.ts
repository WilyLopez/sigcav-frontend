import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cotizacionesApi } from "../api/cotizaciones.api";
import type {
  CotizacionRequest,
  CambiarEstadoCotizacionRequest,
  EstadoCotizacion,
} from "../types/cotizaciones.types";

export const useCotizacionesList = (
  clienteId?: number,
  estado?: EstadoCotizacion | "",
  desde?: string,
  hasta?: string,
  page = 0,
  size = 20
) => {
  return useQuery({
    queryKey: ["cotizaciones", "list", clienteId, estado, desde, hasta, page, size],
    queryFn: () => cotizacionesApi.buscar(clienteId, estado, desde, hasta, page, size),
  });
};

export const useCotizacionDetail = (id: number) => {
  return useQuery({
    queryKey: ["cotizaciones", "detail", id],
    queryFn: () => cotizacionesApi.obtenerPorId(id),
    enabled: !!id,
  });
};

export const useCreateCotizacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CotizacionRequest) => cotizacionesApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "list"] });
    },
  });
};

export const useUpdateCotizacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CotizacionRequest }) =>
      cotizacionesApi.actualizar(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "detail", data.id] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha"] });
    },
  });
};

export const useCambiarEstadoCotizacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CambiarEstadoCotizacionRequest }) =>
      cotizacionesApi.cambiarEstado(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "detail", data.id] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha"] });
    },
  });
};

export const useReactivarCotizacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nuevaFechaVencimiento }: { id: number; nuevaFechaVencimiento: string }) =>
      cotizacionesApi.reactivar(id, nuevaFechaVencimiento),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "list"] });
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "detail", data.id] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha"] });
    },
  });
};

export const useDuplicarCotizacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cotizacionesApi.duplicar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "list"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha"] });
    },
  });
};

export const useConvertirCotizacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cotizacionesApi.convertir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cotizaciones", "list"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "list"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha"] });
    },
  });
};
