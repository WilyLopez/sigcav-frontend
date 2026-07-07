export type Rol = "ADMINISTRADOR" | "ASISTENTE_ADMINISTRATIVO";

export interface UsuarioResponse {
  id: number;
  nombreCompleto: string;
  nombreUsuario: string;
  correo: string;
  rol: Rol;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RegistroUsuarioRequest {
  nombreCompleto: string;
  nombreUsuario: string;
  correo: string;
  contrasena: string;
  rol: Rol;
}

export interface ActualizarUsuarioRequest {
  nombreCompleto: string;
  correo: string;
}

export interface CambioContrasenaRequest {
  contrasenaActual: string;
  contrasenaNueva: string;
  confirmarContrasena: string;
}

export interface CambiarRolRequest {
  rol: Rol;
}
