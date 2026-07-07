import { z } from "zod";

export const comprobanteSchema = z.object({
  pedidoId: z.number({ required_error: "El pedido es obligatorio" }),
  tipoComprobante: z.enum(["FACTURA", "BOLETA", "NOTA_VENTA"], { required_error: "El tipo de comprobante es obligatorio" }),
  formaPago: z.enum(["EFECTIVO", "TRANSFERENCIA", "YAPE_PLIN", "OTRO"], { required_error: "La forma de pago es obligatoria" }),
  descripcionServicio: z.string({ required_error: "La descripción del servicio es obligatoria" })
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(250, "La descripción no puede exceder los 250 caracteres"),
});

export const anulacionComprobanteSchema = z.object({
  comprobanteId: z.number({ required_error: "El comprobante es obligatorio" }),
  justificacion: z.string({ required_error: "La justificación de anulación es obligatoria" })
    .min(5, "La justificación debe tener al menos 5 caracteres")
    .max(500, "La justificación no puede exceder los 500 caracteres"),
});
