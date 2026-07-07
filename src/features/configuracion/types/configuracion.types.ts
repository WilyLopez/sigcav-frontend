export type TipoDato = "TEXTO" | "ENTERO" | "DECIMAL" | "BOOLEANO";

export interface ParametroSistemaResponse {
  id: number;
  clave: string;
  valor: string;
  descripcion: string;
  tipoDato: TipoDato;
  actualizadoEn: string;
  actualizadoPorNombre: string;
}

export interface ActualizarParametroRequest {
  valor: string;
}

export type AccionAuditoria =
  | "CREAR"
  | "EDITAR"
  | "ACTUALIZAR"
  | "ELIMINAR"
  | "ANULAR"
  | "ACTIVAR"
  | "DESACTIVAR"
  | "LOGIN"
  | "LOGOUT"
  | "CAMBIO_ESTADO"
  | "EMITIR_COMPROBANTE"
  | "ANULAR_COMPROBANTE"
  | "CAMBIO_CONTRASENA";

export type EntidadAuditoria =
  | "USUARIO"
  | "CLIENTE"
  | "CONTACTO_CLIENTE"
  | "PROVEEDOR"
  | "CATEGORIA_PRODUCTO"
  | "CATEGORIA_PROVEEDOR"
  | "COTIZACION"
  | "PEDIDO"
  | "COMPRA"
  | "COMPRA_PEDIDO"
  | "GASTO_PEDIDO"
  | "PAGO"
  | "COMPROBANTE"
  | "PARAMETRO_SISTEMA";

export interface LogAuditoriaResponse {
  id: number;
  nombreUsuario: string;
  accion: AccionAuditoria;
  entidad: EntidadAuditoria;
  entidadId: number;
  detalle: string;
  ipOrigen: string;
  creadoEn: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
