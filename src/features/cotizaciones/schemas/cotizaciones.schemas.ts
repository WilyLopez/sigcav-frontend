import { z } from "zod";

export const cotizacionSchema = z.object({
  clienteId: z.number({ required_error: "El cliente es obligatorio" }).positive("El cliente es obligatorio"),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria").refine((val) => {
    const selected = new Date(val + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "La fecha de vencimiento debe ser hoy o una fecha futura"),
  descripcionProducto: z.string().min(1, "La descripción del producto es obligatoria"),
  tipoImpresion: z.string().optional().or(z.literal("")),
  material: z.string().optional().or(z.literal("")),
  dimensiones: z.string().optional().or(z.literal("")),
  acabados: z.string().optional().or(z.literal("")),
  cantidad: z.number({ required_error: "La cantidad es obligatoria" })
    .int("Debe ser un número entero")
    .positive("La cantidad debe ser mayor a cero"),
  precioUnitario: z.number({ required_error: "El precio unitario es obligatorio" })
    .positive("El precio unitario debe ser mayor a cero"),
  descuentoPorcentaje: z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
  recargoPorcentaje: z.number().min(0, "Mínimo 0%"),
  aplicaIgv: z.boolean(),
  tiempoEntregaEstimado: z.string().optional().or(z.literal("")),
  condicionesPago: z.string().optional().or(z.literal("")),
  observaciones: z.string().optional().or(z.literal("")),
});

export type CotizacionFormValues = z.infer<typeof cotizacionSchema>;
