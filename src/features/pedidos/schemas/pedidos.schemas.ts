import { z } from "zod";

const EstadoPedidoEnum = z.enum(["NUEVO", "EN_PROCESO", "COMPLETADO", "ENTREGADO", "CANCELADO"]);
const TipoGastoEnum = z.enum(["MANO_OBRA_EXTERNA", "SERVICIO_EXTERNO", "TRANSPORTE", "OTRO"]);

export const cambiarEstadoSchema = z.object({
  estadoDestino: EstadoPedidoEnum,
  justificacion: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.estadoDestino === "CANCELADO" || data.estadoDestino === "COMPLETADO") {
    return !!data.justificacion && data.justificacion.trim().length > 0;
  }
  return true;
}, {
  message: "La justificación es obligatoria para cancelar o completar un pedido",
  path: ["justificacion"],
});

export const notaInternaSchema = z.object({
  contenido: z.string().min(1, "El contenido de la nota es obligatorio"),
});

export const gastoPedidoSchema = z.object({
  tipoGasto: TipoGastoEnum,
  descripcion: z.string().min(1, "La descripción es obligatoria").max(300, "Máximo 300 caracteres"),
  proveedorId: z.number().optional().nullable().or(z.literal(0)),
  fechaGasto: z.string().min(1, "La fecha del gasto es obligatoria"),
  monto: z.number({ required_error: "El monto es obligatorio" }).positive("El monto debe ser mayor a cero"),
  numeroComprobanteProveedor: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  observaciones: z.string().optional().or(z.literal("")),
});

export type CambiarEstadoFormValues = z.infer<typeof cambiarEstadoSchema>;
export type NotaInternaFormValues = z.infer<typeof notaInternaSchema>;
export type GastoPedidoFormValues = z.infer<typeof gastoPedidoSchema>;
