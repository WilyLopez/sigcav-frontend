import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
} from "@mui/icons-material";
import { useProveedoresList } from "../../proveedores/hooks/useProveedores";
import {
  useDescargarReporteVentas,
  useDescargarReporteRentabilidad,
  useDescargarReporteCompras,
  useDescargarReportePedidosEstado,
  useDescargarResumenFinanciero,
} from "../hooks/useReportes";

export default function ReportesPage() {
  const [desde, setDesde] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().substring(0, 10);
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().substring(0, 10));

  const [tipoComprobante, setTipoComprobante] = useState<string>("");
  const [proveedorId, setProveedorId] = useState<string>("");

  const { data: proveedores } = useProveedoresList("", 0, 100);

  const { mutate: descargarVentas, isPending: isVentasPending } = useDescargarReporteVentas();
  const { mutate: descargarRentabilidad, isPending: isRentabilidadPending } = useDescargarReporteRentabilidad();
  const { mutate: descargarCompras, isPending: isComprasPending } = useDescargarReporteCompras();
  const { mutate: descargarPedidosEstado, isPending: isPedidosPending } = useDescargarReportePedidosEstado();
  const { mutate: descargarResumenFinanciero, isPending: isResumenPending } = useDescargarResumenFinanciero();

  const getFiltro = () => ({
    desde,
    hasta,
    tipoComprobante: tipoComprobante ? (tipoComprobante as any) : undefined,
    proveedorId: proveedorId ? Number(proveedorId) : undefined,
  });

  const handleDescargar = (reportType: string, format: "pdf" | "excel") => {
    const filtro = getFiltro();
    if (reportType === "ventas") {
      descargarVentas({ filtro, formato: format });
    } else if (reportType === "rentabilidad") {
      descargarRentabilidad({ filtro, formato: format });
    } else if (reportType === "compras") {
      descargarCompras({ filtro, formato: format });
    } else if (reportType === "pedidos") {
      descargarPedidosEstado({ filtro, formato: format });
    } else if (reportType === "resumen") {
      descargarResumenFinanciero({ filtro, formato: format });
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Reportes y Exportaciones
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Módulo de descargas de reportes contables, financieros y de control de producción
        </Typography>
      </Box>

      <Card className="p-4">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Desde"
              type="date"
              fullWidth
              size="small"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Hasta"
              type="date"
              fullWidth
              size="small"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="h-full flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Reporte de Ventas y Comprobantes
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Detalle de facturación de boletas, facturas y notas de venta oficiales.
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel id="reporte-tipo-comp-label">Tipo Comprobante (Opcional)</InputLabel>
                <Select
                  labelId="reporte-tipo-comp-label"
                  label="Tipo Comprobante (Opcional)"
                  value={tipoComprobante}
                  onChange={(e) => setTipoComprobante(e.target.value)}
                >
                  <MenuItem value="">Todos los comprobantes</MenuItem>
                  <MenuItem value="FACTURA">Factura</MenuItem>
                  <MenuItem value="BOLETA">Boleta</MenuItem>
                  <MenuItem value="NOTA_VENTA">Nota de Venta</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
            <Box>
              <Divider />
              <Box className="p-4 flex gap-2 justify-end">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PdfIcon />}
                  onClick={() => handleDescargar("ventas", "pdf")}
                  disabled={isVentasPending}
                >
                  Exportar PDF
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ExcelIcon />}
                  onClick={() => handleDescargar("ventas", "excel")}
                  disabled={isVentasPending}
                >
                  Exportar Excel
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="h-full flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Reporte de Compras e Insumos
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Historial de adquisición de materiales e insumos cargados a almacén.
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel id="reporte-prov-label">Proveedor (Opcional)</InputLabel>
                <Select
                  labelId="reporte-prov-label"
                  label="Proveedor (Opcional)"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                >
                  <MenuItem value="">Todos los proveedores</MenuItem>
                  {proveedores?.content.map((p) => (
                    <MenuItem key={p.id} value={p.id.toString()}>
                      {p.nombreRazonSocial}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
            <Box>
              <Divider />
              <Box className="p-4 flex gap-2 justify-end">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PdfIcon />}
                  onClick={() => handleDescargar("compras", "pdf")}
                  disabled={isComprasPending}
                >
                  Exportar PDF
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ExcelIcon />}
                  onClick={() => handleDescargar("compras", "excel")}
                  disabled={isComprasPending}
                >
                  Exportar Excel
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="h-full flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Reporte de Rentabilidad Operativa
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Análisis detallado del margen de utilidad bruta por pedido registrado.
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" className="min-h-[40px]">
                Compara precios de venta cobrados frente a los gastos directos e indirectos imputados.
              </Typography>
            </CardContent>
            <Box>
              <Divider />
              <Box className="p-4 flex gap-2 justify-end">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PdfIcon />}
                  onClick={() => handleDescargar("rentabilidad", "pdf")}
                  disabled={isRentabilidadPending}
                >
                  Exportar PDF
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ExcelIcon />}
                  onClick={() => handleDescargar("rentabilidad", "excel")}
                  disabled={isRentabilidadPending}
                >
                  Exportar Excel
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="h-full flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Seguimiento de Pedidos por Estado
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Indicadores de volumen de producción agrupados por estado del taller.
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" className="min-h-[40px]">
                Permite auditar los tiempos de entrega, volumen de pedidos nuevos, en proceso y completados.
              </Typography>
            </CardContent>
            <Box>
              <Divider />
              <Box className="p-4 flex gap-2 justify-end">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PdfIcon />}
                  onClick={() => handleDescargar("pedidos", "pdf")}
                  disabled={isPedidosPending}
                >
                  Exportar PDF
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ExcelIcon />}
                  onClick={() => handleDescargar("pedidos", "excel")}
                  disabled={isPedidosPending}
                >
                  Exportar Excel
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="h-full flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Resumen Financiero y Utilidad
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Resumen consolidad de ingresos netos, costos acumulados y margen global.
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" className="min-h-[40px]">
                Reporte gerencial consolidado ideal para la toma de decisiones contables mensuales.
              </Typography>
            </CardContent>
            <Box>
              <Divider />
              <Box className="p-4 flex gap-2 justify-end">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PdfIcon />}
                  onClick={() => handleDescargar("resumen", "pdf")}
                  disabled={isResumenPending}
                >
                  Exportar PDF
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ExcelIcon />}
                  onClick={() => handleDescargar("resumen", "excel")}
                  disabled={isResumenPending}
                >
                  Exportar Excel
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
