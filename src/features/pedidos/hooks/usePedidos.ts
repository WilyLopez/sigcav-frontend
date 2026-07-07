import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pedidosApi } from "../api/pedidos.api";
import type {
  CrearPedidoRequest,
  ActualizarPedidoRequest,
  CambiarEstadoPedidoRequest,
  CrearNotaInternaRequest,
  GastoPedidoRequest,
  EstadoPedido,
} from "../types/pedidos.types";

export const usePedidosList = (
  clienteId?: number,
  estado?: EstadoPedido,
  desdeIngreso?: string,
  hastaIngreso?: string,
  page = 0,
  size = 20
) => {
  return useQuery({
    queryKey: ["pedidos", "list", clienteId, estado, desdeIngreso, hastaIngreso, page, size],
    queryFn: () => pedidosApi.buscar(clienteId, estado, desdeIngreso, hastaIngreso, page, size),
  });
};

export const usePedidoDetail = (id: number) => {
  return useQuery({
    queryKey: ["pedidos", "detail", id],
    queryFn: () => pedidosApi.obtenerFicha(id),
    enabled: !!id,
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearPedidoRequest) => pedidosApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};

export const useUpdatePedido = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarPedidoRequest }) =>
      pedidosApi.actualizar(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", data.id] });
    },
  });
};

export const useCambiarEstadoPedido = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CambiarEstadoPedidoRequest }) =>
      pedidosApi.cambiarEstado(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", data.id] });
    },
  });
};

export const useAgregarNotaPedido = (pedidoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearNotaInternaRequest) => pedidosApi.agregarNota(pedidoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", pedidoId] });
    },
  });
};

export const useGastosPedido = (pedidoId: number) => {
  return useQuery({
    queryKey: ["pedidos", pedidoId, "gastos"],
    queryFn: () => pedidosApi.listarGastos(pedidoId),
    enabled: !!pedidoId,
  });
};

export const useAsignacionesPedido = (pedidoId: number) => {
  return useQuery({
    queryKey: ["pedidos", pedidoId, "asignaciones"],
    queryFn: () => pedidosApi.listarAsignaciones(pedidoId),
    enabled: !!pedidoId,
  });
};

export const useRegistrarGastoPedido = (pedidoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GastoPedidoRequest) => pedidosApi.registrarGasto(pedidoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos", pedidoId, "gastos"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", pedidoId] });
    },
  });
};

export const useEditarGastoPedido = (pedidoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gastoId, data }: { gastoId: number; data: GastoPedidoRequest }) =>
      pedidosApi.editarGasto(gastoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos", pedidoId, "gastos"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", pedidoId] });
    },
  });
};

export const useEliminarGastoPedido = (pedidoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gastoId: number) => pedidosApi.eliminarGasto(gastoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos", pedidoId, "gastos"] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", pedidoId] });
    },
  });
};
