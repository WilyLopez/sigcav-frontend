import { z } from "zod";

export const contactoSchema = z.object({
  nombre: z.string().min(1, "El nombre del contacto es obligatorio").max(200, "Máximo 200 caracteres"),
  telefono: z.string().max(20, "Máximo 20 caracteres").optional().or(z.literal("")),
  correo: z.string().email("El correo no es válido").max(150, "Máximo 150 caracteres").optional().or(z.literal("")),
  cargo: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  esPrincipal: z.boolean(),
});

export const clienteSchema = z.object({
  tipoDocumento: z.enum(["DNI", "RUC"]),
  numeroDocumento: z.string().min(1, "El número de documento es obligatorio"),
  nombreRazonSocial: z.string().min(1, "El nombre o razón social es obligatorio").max(200, "Máximo 200 caracteres"),
  telefonoPrincipal: z.string().min(1, "El teléfono principal es obligatorio").max(20, "Máximo 20 caracteres"),
  telefonoSecundario: z.string().max(20, "Máximo 20 caracteres").optional().or(z.literal("")),
  correo: z.string().min(1, "El correo es obligatorio").email("El correo no es válido").max(150, "Máximo 150 caracteres"),
  direccionEntrega: z.string().min(1, "La dirección de entrega es obligatoria").max(300, "Máximo 300 caracteres"),
  nombreContactoRef: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  observaciones: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.tipoDocumento === "DNI") {
    return /^\d{8}$/.test(data.numeroDocumento);
  }
  if (data.tipoDocumento === "RUC") {
    return /^\d{11}$/.test(data.numeroDocumento);
  }
  return false;
}, {
  message: "El DNI debe tener 8 dígitos y el RUC debe tener 11 dígitos",
  path: ["numeroDocumento"],
});

export type ContactoFormValues = z.infer<typeof contactoSchema>;
export type ClienteFormValues = z.infer<typeof clienteSchema>;
