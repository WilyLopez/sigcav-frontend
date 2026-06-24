import { z } from "zod";

export const loginSchema = z.object({
  nombreUsuario: z.string().min(1, "El nombre de usuario es obligatorio"),
  contrasena: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;