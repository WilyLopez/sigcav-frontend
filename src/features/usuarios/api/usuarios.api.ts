import { httpClient } from "@config/http.client";
import type {
  RegistroUsuarioRequest,
  ActualizarUsuarioRequest,
  CambioContrasenaRequest,
  CambiarRolRequest,
  UsuarioResponse,
} from "../types/usuarios.types";

export interface ApiResponse<T> {
  mensaje: string;
  datos: T;
  exito: boolean;
}

export const usuariosApi = {
  registrar: async (data: RegistroUsuarioRequest) => {
    const res = await httpClient.post<ApiResponse<UsuarioResponse>>("/usuarios", data);
    return res.data.datos;
  },

  listarTodos: async () => {
    const res = await httpClient.get<ApiResponse<UsuarioResponse[]>>("/usuarios");
    return res.data.datos;
  },

  obtenerPorId: async (id: number) => {
    const res = await httpClient.get<ApiResponse<UsuarioResponse>>(`/usuarios/${id}`);
    return res.data.datos;
  },

  obtenerPerfil: async () => {
    const res = await httpClient.get<ApiResponse<UsuarioResponse>>("/usuarios/perfil");
    return res.data.datos;
  },

  actualizar: async (id: number, data: ActualizarUsuarioRequest) => {
    const res = await httpClient.put<ApiResponse<UsuarioResponse>>(`/usuarios/${id}`, data);
    return res.data.datos;
  },

  cambiarContrasena: async (id: number, data: CambioContrasenaRequest) => {
    const res = await httpClient.patch<ApiResponse<void>>(`/usuarios/${id}/contrasena`, data);
    return res.data;
  },

  desactivar: async (id: number) => {
    const res = await httpClient.delete<ApiResponse<void>>(`/usuarios/${id}`);
    return res.data;
  },

  activar: async (id: number) => {
    const res = await httpClient.patch<ApiResponse<void>>(`/usuarios/${id}/activar`);
    return res.data;
  },

  cambiarRol: async (id: number, data: CambiarRolRequest) => {
    const res = await httpClient.patch<ApiResponse<UsuarioResponse>>(`/usuarios/${id}/rol`, data);
    return res.data.datos;
  },
};
