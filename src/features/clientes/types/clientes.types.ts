export type TipoDocumento = "DNI" | "RUC";

export interface ContactoClienteRequest {
  nombre: string;
  telefono?: string;
  correo?: string;
  cargo?: string;
  esPrincipal: boolean;
}

export interface ContactoClienteResponse {
  id: number;
  clienteId: number;
  nombre: string;
  telefono: string | null;
  correo: string | null;
  cargo: string | null;
  esPrincipal: boolean;
  creadoEn: string;
}

export interface ClienteRequest {
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombreRazonSocial: string;
  telefonoPrincipal: string;
  telefonoSecundario?: string;
  correo: string;
  direccionEntrega: string;
  nombreContactoRef?: string;
  observaciones?: string;
  contactos: ContactoClienteRequest[];
}

export interface ClienteResumenResponse {
  id: number;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombreRazonSocial: string;
  telefonoPrincipal: string;
  correo: string;
  activo: boolean;
}

export interface ClienteDetalleResponse {
  id: number;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombreRazonSocial: string;
  telefonoPrincipal: string;
  telefonoSecundario: string | null;
  correo: string;
  direccionEntrega: string;
  nombreContactoRef: string | null;
  observaciones: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
  contactos: ContactoClienteResponse[];
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

export interface ClienteFichaResponse {
  id: number;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombreRazonSocial: string;
  telefonoPrincipal: string;
  telefonoSecundario: string | null;
  correo: string;
  direccionEntrega: string;
  nombreContactoRef: string | null;
  observaciones: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
  contactos: ContactoClienteResponse[];
  cotizaciones: any[];
  pedidos: any[];
  comprobantes: any[];
  montoAcumuladoVentas: number;
}
