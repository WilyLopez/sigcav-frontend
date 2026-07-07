import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesApi } from "../api/clientes.api";
import type { ClienteRequest, ContactoClienteRequest } from "../types/clientes.types";

export const useClientesList = (termino: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ["clientes", "list", termino, page, size],
    queryFn: () => clientesApi.buscar(termino, page, size),
  });
};

export const useClienteDetail = (id: number) => {
  return useQuery({
    queryKey: ["clientes", "detail", id],
    queryFn: () => clientesApi.obtenerPorId(id),
    enabled: !!id,
  });
};

export const useClienteFicha = (id: number) => {
  return useQuery({
    queryKey: ["clientes", "ficha", id],
    queryFn: () => clientesApi.obtenerFicha(id),
    enabled: !!id,
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClienteRequest) => clientesApi.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes", "list"] });
    },
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClienteRequest }) =>
      clientesApi.actualizar(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clientes", "list"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "detail", data.id] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha", data.id] });
    },
  });
};

export const useDesactivarCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientesApi.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
};

export const useActivarCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientesApi.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
};

export const useContactosList = (clienteId: number) => {
  return useQuery({
    queryKey: ["clientes", clienteId, "contactos"],
    queryFn: () => clientesApi.listarContactos(clienteId),
    enabled: !!clienteId,
  });
};

export const useCreateContacto = (clienteId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactoClienteRequest) => clientesApi.crearContacto(clienteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes", clienteId, "contactos"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "detail", clienteId] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha", clienteId] });
    },
  });
};

export const useUpdateContacto = (clienteId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contactoId, data }: { contactoId: number; data: ContactoClienteRequest }) =>
      clientesApi.actualizarContacto(clienteId, contactoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes", clienteId, "contactos"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "detail", clienteId] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha", clienteId] });
    },
  });
};

export const useDeleteContacto = (clienteId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contactoId: number) => clientesApi.eliminarContacto(clienteId, contactoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes", clienteId, "contactos"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "detail", clienteId] });
      queryClient.invalidateQueries({ queryKey: ["clientes", "ficha", clienteId] });
    },
  });
};
