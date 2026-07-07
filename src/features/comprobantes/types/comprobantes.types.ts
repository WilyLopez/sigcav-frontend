import { FormaPago } from "../../pagos/types/pagos.types";

export type TipoComprobante = "FACTURA" | "BOLETA" | "NOTA_VENTA";

export interface ComprobanteRequest {
  pedidoId: number;
  tipoComprobante: TipoComprobante;
  formaPago: FormaPago;
  descripcionServicio: string;
}

export interface ComprobanteResponse {
  id: number;
  pedidoId: number;
  numeroPedido: string;
  tipoComprobante: TipoComprobante;
  serie: string;
  correlativo: number;
  numeroCompleto: string;
  fechaEmision: string;
  clienteId: number;
  clienteNombreRazonSocial: string;
  clienteNumeroDocumento: string;
  descripcionServicio: string;
  subtotal: number;
  igvPorcentaje: number;
  igvMonto: number;
  total: number;
  formaPago: FormaPago;
  anulado: boolean;
  emitidoPorNombre: string;
  creadoEn: string;
}

export interface AnulacionComprobanteRequest {
  comprobanteId: number;
  justificacion: string;
}

export interface AnulacionComprobanteResponse {
  id: number;
  comprobanteId: number;
  numeroCompleto: string;
  justificacion: string;
  usuarioNombre: string;
  creadoEn: string;
}
