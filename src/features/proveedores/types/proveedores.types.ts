export interface CategoriaProveedor {
  id: number;
  nombre: string;
  activo: boolean;
  creadoEn: string;
}

export interface ProveedorResumen {
  id: number;
  tipoDocumento: "DNI" | "RUC";
  numeroDocumento: string;
  nombreRazonSocial: string;
  categoriaNombre: string;
  telefono: string;
  activo: boolean;
}

export interface ProveedorDetalle {
  id: number;
  tipoDocumento: "DNI" | "RUC";
  numeroDocumento: string;
  nombreRazonSocial: string;
  categoriaProveedorId: number;
  categoriaNombre: string;
  telefono: string;
  correo?: string;
  direccion?: string;
  nombreRepresentante?: string;
  observaciones?: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ProveedorRequest {
  tipoDocumento: "DNI" | "RUC";
  numeroDocumento: string;
  nombreRazonSocial: string;
  categoriaProveedorId: number;
  telefono: string;
  correo?: string;
  direccion?: string;
  nombreRepresentante?: string;
  observaciones?: string;
}

export interface CategoriaProveedorRequest {
  nombre: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
