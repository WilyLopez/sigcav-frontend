import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagosApi } from "../api/pagos.api";
import type {
  PagoRequest,
  NotaCorreccionPagoRequest,
} from "../types/pagos.types";

export const useListarPagosPorPedido = (pedidoId: number) => {
  return useQuery({
    queryKey: ["pagos", "pedido", pedidoId],
    queryFn: () => pagosApi.listarPorPedido(pedidoId),
    enabled: !!pedidoId,
  });
};

export const useListarCorreccionesPago = (pagoId: number) => {
  return useQuery({
    queryKey: ["pagos", pagoId, "correcciones"],
    queryFn: () => pagosApi.listarCorrecciones(pagoId),
    enabled: !!pagoId,
  });
};

export const useRegistrarPago = (pedidoId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PagoRequest) => pagosApi.registrarPago(data),
    onSuccess: (data) => {
      const pid = pedidoId || data.pedidoId;
      queryClient.invalidateQueries({ queryKey: ["pagos", "pedido", pid] });
      queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", pid] });
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
};

export const useCorregirPago = (pedidoId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NotaCorreccionPagoRequest) => pagosApi.corregirPago(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      if (pedidoId) {
        queryClient.invalidateQueries({ queryKey: ["pagos", "pedido", pedidoId] });
        queryClient.invalidateQueries({ queryKey: ["pedidos", "detail", pedidoId] });
      }
    },
  });
};
