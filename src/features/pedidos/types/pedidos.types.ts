import type { PageResponse } from "../../clientes/types/clientes.types";

export type EstadoPedido = "NUEVO" | "EN_PROCESO" | "COMPLETADO" | "ENTREGADO" | "CANCELADO";
export type EstadoPagoPedido = "PENDIENTE_ADELANTO" | "ADELANTO_PAGADO" | "PAGADO_TOTAL" | "CORREGIDO";
export type TipoGasto = "MANO_OBRA_EXTERNA" | "SERVICIO_EXTERNO" | "TRANSPORTE" | "OTRO";

export interface PedidoResponse {
  id: number;
  numeroPedido: string;
  clienteId: number;
  clienteNombre: string;
  clienteNumeroDocumento: string;
  categoriaProductoId: number;
  categoriaProductoNombre: string;
  descripcion: string;
  especificaciones: string;
  cantidad: number;
  precioVenta: number;
  fechaIngreso: string;
  fechaEntregaComprometida: string;
  estado: EstadoPedido;
  estadoPago: EstadoPagoPedido;
  costoTotal: number;
  gananciaBruta: number;
  margenGananciaPorcentaje: number;
  semaforoColor: string;
  alertaEntregaProxima: boolean;
  creadoPorNombre: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ResumenFinanciero {
  precioVenta: number;
  costoTotal: number;
  gananciaBruta: number;
  margenGananciaPorcentaje: number;
  semaforoColor: string;
}

export interface HistorialEstadoPedido {
  id: number;
  estadoAnterior?: EstadoPedido;
  estadoNuevo: EstadoPedido;
  justificacion?: string;
  cambiadoPorNombre: string;
  creadoEn: string;
}

export interface NotaInternaPedido {
  id: number;
  contenido: string;
  creadoPorNombre: string;
  creadoEn: string;
}

export interface PedidoFichaResponse {
  datosgenerales: PedidoResponse;
  resumenFinanciero: ResumenFinanciero;
  historialEstados: HistorialEstadoPedido[];
  notasInternas: NotaInternaPedido[];
}

export interface GastoPedidoResponse {
  id: number;
  pedidoId: number;
  tipoGasto: TipoGasto;
  descripcion: string;
  proveedorId?: number;
  proveedorNombre?: string;
  fechaGasto: string;
  monto: number;
  numeroComprobanteProveedor?: string;
  observaciones?: string;
  registradoPorId: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CompraPedidoResponse {
  id: number;
  compraId: number;
  pedidoId: number;
  pedidoNumero: string;
  montoAsignado: number;
  creadoEn: string;
}

export interface CrearPedidoRequest {
  clienteId: number;
  cotizacionId?: number;
  categoriaProductoId: number;
  descripcion: string;
  especificaciones: string;
  cantidad: number;
  precioVenta: number;
  fechaEntregaComprometida: string;
}

export interface ActualizarPedidoRequest {
  categoriaProductoId: number;
  descripcion: string;
  especificaciones: string;
  cantidad: number;
  precioVenta: number;
  fechaEntregaComprometida: string;
}

export interface CambiarEstadoPedidoRequest {
  estadoDestino: EstadoPedido;
  justificacion?: string;
}

export interface CrearNotaInternaRequest {
  contenido: string;
}

export interface GastoPedidoRequest {
  tipoGasto: TipoGasto;
  descripcion: string;
  proveedorId?: number;
  fechaGasto: string;
  monto: number;
  numeroComprobanteProveedor?: string;
  observaciones?: string;
}

export type { PageResponse };
