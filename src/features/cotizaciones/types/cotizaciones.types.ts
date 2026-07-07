export type EstadoCotizacion = "BORRADOR" | "ENVIADA" | "APROBADA" | "RECHAZADA" | "VENCIDA";

export interface CotizacionRequest {
  clienteId: number;
  fechaVencimiento: string;
  descripcionProducto: string;
  tipoImpresion?: string;
  material?: string;
  dimensiones?: string;
  acabados?: string;
  cantidad: number;
  precioUnitario: number;
  descuentoPorcentaje: number;
  recargoPorcentaje: number;
  aplicaIgv: boolean;
  tiempoEntregaEstimado?: string;
  condicionesPago?: string;
  observaciones?: string;
}

export interface CambiarEstadoCotizacionRequest {
  nuevoEstado: EstadoCotizacion;
}

export interface CotizacionResponse {
  id: number;
  numeroCotizacion: string;
  clienteId: number;
  clienteNombre: string;
  clienteNumeroDocumento: string;
  fechaEmision: string;
  fechaVencimiento: string;
  descripcionProducto: string;
  tipoImpresion: string | null;
  material: string | null;
  dimensiones: string | null;
  acabados: string | null;
  cantidad: number;
  precioUnitario: number;
  descuentoPorcentaje: number;
  recargoPorcentaje: number;
  subtotal: number;
  aplicaIgv: boolean;
  igvMonto: number;
  total: number;
  tiempoEntregaEstimado: string | null;
  condicionesPago: string | null;
  observaciones: string | null;
  estado: EstadoCotizacion;
  convertidaEnPedido: boolean;
  creadoPorNombre: string | null;
  creadoEn: string;
  actualizadoEn: string;
  alertaVencimientoProximo: boolean;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
