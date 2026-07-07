import { useMutation } from "@tanstack/react-query";
import { reportesApi } from "../api/reportes.api";
import type { ReporteFiltroRequest } from "../types/reportes.types";

const helperTriggerDownload = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const useDescargarReporteVentas = () => {
  return useMutation({
    mutationFn: async ({ filtro, formato }: { filtro: ReporteFiltroRequest; formato: "pdf" | "excel" }) => {
      const data = formato === "pdf"
        ? await reportesApi.descargarVentasPdf(filtro)
        : await reportesApi.descargarVentasExcel(filtro);
      helperTriggerDownload(data, `reporte_ventas.${formato === "pdf" ? "pdf" : "xlsx"}`);
    },
  });
};

export const useDescargarReporteRentabilidad = () => {
  return useMutation({
    mutationFn: async ({ filtro, formato }: { filtro: ReporteFiltroRequest; formato: "pdf" | "excel" }) => {
      const data = formato === "pdf"
        ? await reportesApi.descargarRentabilidadPdf(filtro)
        : await reportesApi.descargarRentabilidadExcel(filtro);
      helperTriggerDownload(data, `reporte_rentabilidad.${formato === "pdf" ? "pdf" : "xlsx"}`);
    },
  });
};

export const useDescargarReporteCompras = () => {
  return useMutation({
    mutationFn: async ({ filtro, formato }: { filtro: ReporteFiltroRequest; formato: "pdf" | "excel" }) => {
      const data = formato === "pdf"
        ? await reportesApi.descargarComprasPdf(filtro)
        : await reportesApi.descargarComprasExcel(filtro);
      helperTriggerDownload(data, `reporte_compras.${formato === "pdf" ? "pdf" : "xlsx"}`);
    },
  });
};

export const useDescargarReportePedidosEstado = () => {
  return useMutation({
    mutationFn: async ({ filtro, formato }: { filtro: ReporteFiltroRequest; formato: "pdf" | "excel" }) => {
      const data = formato === "pdf"
        ? await reportesApi.descargarPedidosEstadoPdf(filtro)
        : await reportesApi.descargarPedidosEstadoExcel(filtro);
      helperTriggerDownload(data, `reporte_pedidos_estado.${formato === "pdf" ? "pdf" : "xlsx"}`);
    },
  });
};

export const useDescargarResumenFinanciero = () => {
  return useMutation({
    mutationFn: async ({ filtro, formato }: { filtro: ReporteFiltroRequest; formato: "pdf" | "excel" }) => {
      const data = formato === "pdf"
        ? await reportesApi.descargarResumenFinancieroPdf(filtro)
        : await reportesApi.descargarResumenFinancieroExcel(filtro);
      helperTriggerDownload(data, `resumen_financiero.${formato === "pdf" ? "pdf" : "xlsx"}`);
    },
  });
};
