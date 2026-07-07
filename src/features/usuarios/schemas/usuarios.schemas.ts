import { z } from "zod";

export const registroUsuarioSchema = z.object({
  nombreCompleto: z.string({ required_error: "El nombre completo es obligatorio" })
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(200, "El nombre completo no puede superar los 200 caracteres"),
  nombreUsuario: z.string({ required_error: "El nombre de usuario es obligatorio" })
    .min(4, "El nombre de usuario debe tener entre 4 y 100 caracteres")
    .max(100, "El nombre de usuario no puede superar los 100 caracteres"),
  correo: z.string({ required_error: "El correo es obligatorio" })
    .email("El correo no tiene un formato válido")
    .max(150, "El correo no puede superar los 150 caracteres"),
  contrasena: z.string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.enum(["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"], { required_error: "El rol es obligatorio" }),
});

export const actualizarUsuarioSchema = z.object({
  nombreCompleto: z.string({ required_error: "El nombre completo es obligatorio" })
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(200, "El nombre completo no puede superar los 200 caracteres"),
  correo: z.string({ required_error: "El correo es obligatorio" })
    .email("El correo no tiene un formato válido")
    .max(150, "El correo no puede superar los 150 caracteres"),
});

export const cambioContrasenaSchema = z.object({
  contrasenaActual: z.string({ required_error: "La contraseña actual es obligatoria" })
    .min(1, "La contraseña actual es obligatoria"),
  contrasenaNueva: z.string({ required_error: "La nueva contraseña es obligatoria" })
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
  confirmarContrasena: z.string({ required_error: "La confirmación es obligatoria" })
    .min(8, "La confirmación de la nueva contraseña debe tener al menos 8 caracteres"),
}).refine((data) => data.contrasenaNueva === data.confirmarContrasena, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContrasena"],
});

export const cambiarRolSchema = z.object({
  rol: z.enum(["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"], { required_error: "El rol es obligatorio" }),
});
