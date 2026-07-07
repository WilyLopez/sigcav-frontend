import { TipoComprobante } from "../../comprobantes/types/comprobantes.types";

export interface ReporteFiltroRequest {
  desde: string;
  hasta: string;
  tipoComprobante?: TipoComprobante;
  proveedorId?: number;
}
