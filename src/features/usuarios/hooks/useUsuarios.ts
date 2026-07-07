import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuariosApi } from "../api/usuarios.api";
import type {
  RegistroUsuarioRequest,
  ActualizarUsuarioRequest,
  CambioContrasenaRequest,
  CambiarRolRequest,
} from "../types/usuarios.types";

export const useListarUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios", "list"],
    queryFn: () => usuariosApi.listarTodos(),
  });
};

export const useUsuarioDetail = (id: number) => {
  return useQuery({
    queryKey: ["usuarios", "detail", id],
    queryFn: () => usuariosApi.obtenerPorId(id),
    enabled: !!id,
  });
};

export const useUsuarioPerfil = () => {
  return useQuery({
    queryKey: ["usuarios", "perfil"],
    queryFn: () => usuariosApi.obtenerPerfil(),
  });
};

export const useRegistrarUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegistroUsuarioRequest) => usuariosApi.registrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};

export const useActualizarUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarUsuarioRequest }) =>
      usuariosApi.actualizar(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios", "detail", data.id] });
      queryClient.invalidateQueries({ queryKey: ["usuarios", "perfil"] });
    },
  });
};

export const useCambiarContrasenaUsuario = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CambioContrasenaRequest }) =>
      usuariosApi.cambiarContrasena(id, data),
  });
};

export const useDesactivarUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosApi.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};

export const useActivarUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosApi.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};

export const useCambiarRolUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CambiarRolRequest }) =>
      usuariosApi.cambiarRol(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios", "detail", data.id] });
    },
  });
};
