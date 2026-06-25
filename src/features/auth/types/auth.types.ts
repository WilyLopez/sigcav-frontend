export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type Rol = 'ADMINISTRADOR' | 'ASISTENTE_ADMINISTRATIVO';

export interface UsuarioResponse {
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  correo: string;
  rol: Rol;
  activo: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tipo: string;
  expiraEnSegundos: number;
  usuario: UsuarioResponse;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
}