import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { comprobantesApi } from "../api/comprobantes.api";
import type {
  ComprobanteRequest,
  AnulacionComprobanteRequest,
  TipoComprobante,
} from "../types/comprobantes.types";

export const useListarComprobantes = (desde: string, hasta: string, tipo?: TipoComprobante) => {
  return useQuery({
    queryKey: ["comprobantes", "list", desde, hasta, tipo],
    queryFn: () => comprobantesApi.listarPorFiltros(desde, hasta, tipo),
    enabled: !!desde && !!hasta,
  });
};

export const useComprobanteDetail = (id: number) => {
  return useQuery({
    queryKey: ["comprobantes", "detail", id],
    queryFn: () => comprobantesApi.obtenerPorId(id),
    enabled: !!id,
  });
};

export const useComprobantePorPedido = (pedidoId: number) => {
  return useQuery({
    queryKey: ["comprobantes", "pedido", pedidoId],
    queryFn: () => comprobantesApi.obtenerPorPedido(pedidoId),
    enabled: !!pedidoId,
    retry: false,
  });
};

export const useEmitirComprobante = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ComprobanteRequest) => comprobantesApi.emitir(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comprobantes"] });
      queryClient.invalidateQueries({ queryKey: ["comprobantes", "pedido", data.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", data.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};

export const useAnularComprobante = (pedidoId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AnulacionComprobanteRequest) => comprobantesApi.anular(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comprobantes"] });
      queryClient.invalidateQueries({ queryKey: ["comprobantes", "detail", data.comprobanteId] });
      if (pedidoId) {
        queryClient.invalidateQueries({ queryKey: ["comprobantes", "pedido", pedidoId] });
        queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", pedidoId] });
      }
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};
