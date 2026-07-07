import { z } from "zod";

export const proveedorSchema = z.object({
  tipoDocumento: z.enum(["DNI", "RUC"]),
  numeroDocumento: z.string().min(1, "El número de documento es obligatorio"),
  nombreRazonSocial: z.string().min(1, "El nombre o razón social es obligatorio").max(200, "Máximo 200 caracteres"),
  categoriaProveedorId: z.number({ required_error: "La categoría es obligatoria" }).positive("La categoría es obligatoria"),
  telefono: z.string().min(1, "El teléfono es obligatorio").max(20, "Máximo 20 caracteres"),
  correo: z.string().email("El correo no es válido").max(150, "Máximo 150 caracteres").optional().or(z.literal("")),
  direccion: z.string().max(300, "Máximo 300 caracteres").optional().or(z.literal("")),
  nombreRepresentante: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
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

export const categoriaProveedorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
});

export type ProveedorFormValues = z.infer<typeof proveedorSchema>;
export type CategoriaProveedorFormValues = z.infer<typeof categoriaProveedorSchema>;
