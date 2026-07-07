import { z } from "zod";

export const pagoSchema = z.object({
  pedidoId: z.number({ required_error: "El pedido es obligatorio" }),
  tipoPago: z.enum(["ADELANTO", "SALDO"], { required_error: "El tipo de pago es obligatorio" }),
  monto: z.number({ required_error: "El monto es obligatorio" })
    .min(0.01, "El monto debe ser mayor a 0"),
  fechaPago: z.string({ required_error: "La fecha de pago es obligatoria" })
    .min(1, "La fecha de pago es obligatoria"),
  formaPago: z.enum(["EFECTIVO", "TRANSFERENCIA", "YAPE_PLIN", "OTRO"], { required_error: "La forma de pago es obligatoria" }),
  observacion: z.string().optional(),
});

export const notaCorreccionSchema = z.object({
  pagoId: z.number({ required_error: "El pago es obligatorio" }),
  justificacion: z.string({ required_error: "La justificación es obligatoria" })
    .min(1, "La justificación es obligatoria")
    .max(500, "La justificación no puede exceder los 500 caracteres"),
});
