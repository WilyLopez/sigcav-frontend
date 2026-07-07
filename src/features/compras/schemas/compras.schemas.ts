import { z } from "zod";

const TipoComprobanteEnum = z.enum(["FACTURA", "BOLETA", "TICKET", "OTRO"]);

export const itemCompraSchema = z.object({
  nombreMaterial: z.string().min(1, "El nombre del material es obligatorio").max(200, "Máximo 200 caracteres"),
  unidadMedida: z.string().min(1, "La unidad de medida es obligatoria").max(30, "Máximo 30 caracteres"),
  cantidad: z.number({ required_error: "La cantidad es obligatoria" }).positive("Debe ser mayor a cero"),
  precioUnitario: z.number({ required_error: "El precio unitario es obligatorio" }).min(0, "No puede ser negativo"),
});

export const compraSchema = z.object({
  proveedorId: z.number({ required_error: "El proveedor es obligatorio" }).positive("El proveedor es obligatorio"),
  fechaCompra: z.string().min(1, "La fecha es obligatoria"),
  numeroComprobanteProveedor: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  tipoComprobanteProveedor: TipoComprobanteEnum,
  observaciones: z.string().optional().or(z.literal("")),
  items: z.array(itemCompraSchema).min(1, "Debe agregar al menos un ítem a la compra"),
});

export const compraPedidoSchema = z.object({
  pedidoId: z.number({ required_error: "El pedido es obligatorio" }).positive("El pedido es obligatorio"),
  montoAsignado: z.number({ required_error: "El monto asignado es obligatorio" }).positive("Debe ser mayor a cero"),
});

export type CompraFormValues = z.infer<typeof compraSchema>;
export type ItemCompraFormValues = z.infer<typeof itemCompraSchema>;
export type CompraPedidoFormValues = z.infer<typeof compraPedidoSchema>;
