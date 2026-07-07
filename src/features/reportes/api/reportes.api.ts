import { httpClient } from "@config/http.client";
import type { ReporteFiltroRequest } from "../types/reportes.types";

export const reportesApi = {
  descargarVentasPdf: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/ventas/pdf", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarVentasExcel: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/ventas/excel", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarRentabilidadPdf: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/rentabilidad/pdf", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarRentabilidadExcel: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/rentabilidad/excel", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarComprasPdf: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/compras/pdf", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarComprasExcel: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/compras/excel", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarPedidosEstadoPdf: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/pedidos-estado/pdf", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarPedidosEstadoExcel: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/pedidos-estado/excel", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarResumenFinancieroPdf: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/resumen-financiero/pdf", filtro, { responseType: "blob" });
    return res.data;
  },
  descargarResumenFinancieroExcel: async (filtro: ReporteFiltroRequest) => {
    const res = await httpClient.post("/reportes/resumen-financiero/excel", filtro, { responseType: "blob" });
    return res.data;
  },
};
