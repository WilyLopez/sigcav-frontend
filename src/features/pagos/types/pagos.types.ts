export type TipoPago = "ADELANTO" | "SALDO";
export type FormaPago = "EFECTIVO" | "TRANSFERENCIA" | "YAPE_PLIN" | "OTRO";

export interface PagoRequest {
  pedidoId: number;
  tipoPago: TipoPago;
  monto: number;
  fechaPago: string;
  formaPago: FormaPago;
  observacion?: string;
}

export interface PagoResponse {
  id: number;
  pedidoId: number;
  numeroPedido: string;
  tipoPago: TipoPago;
  monto: number;
  fechaPago: string;
  formaPago: FormaPago;
  observacion?: string;
  registradoPorNombre: string;
  creadoEn: string;
}

export interface NotaCorreccionPagoRequest {
  pagoId: number;
  justificacion: string;
}

export interface NotaCorreccionPagoResponse {
  id: number;
  pagoId: number;
  justificacion: string;
  usuarioNombre: string;
  creadoEn: string;
}
