export type TipoComprobanteProveedor = "FACTURA" | "BOLETA" | "TICKET" | "OTRO";

export interface ItemCompraRequest {
  nombreMaterial: string;
  unidadMedida: string;
  cantidad: number;
  precioUnitario: number;
}

export interface ItemCompraResponse {
  id: number;
  nombreMaterial: string;
  unidadMedida: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CompraRequest {
  proveedorId: number;
  fechaCompra: string;
  numeroComprobanteProveedor?: string;
  tipoComprobanteProveedor: TipoComprobanteProveedor;
  observaciones?: string;
  items: ItemCompraRequest[];
}

export interface CompraResponse {
  id: number;
  proveedorId: number;
  proveedorNombre: string;
  fechaCompra: string;
  numeroComprobanteProveedor?: string;
  tipoComprobanteProveedor: TipoComprobanteProveedor;
  total: number;
  observaciones?: string;
  registradoPorId: number;
  creadoEn: string;
  actualizadoEn: string;
  items: ItemCompraResponse[];
}

export interface CompraPedidoRequest {
  pedidoId: number;
  montoAsignado: number;
}

export interface CompraPedidoResponse {
  id: number;
  compraId: number;
  pedidoId: number;
  pedidoNumero: string;
  montoAsignado: number;
  creadoEn: string;
}
