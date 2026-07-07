import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import {
  useCotizacionDetail,
  useCambiarEstadoCotizacion,
  useReactivarCotizacion,
  useDuplicarCotizacion,
  useConvertirCotizacion,
} from "../hooks/useCotizaciones";

export default function CotizacionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/admin") ? "admin" : "asistente";
  const cotizacionId = Number(id);

  const [openReactivar, setOpenReactivar] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");

  const { data: cotizacion, isLoading, error } = useCotizacionDetail(cotizacionId);

  const { mutate: cambiarEstado } = useCambiarEstadoCotizacion();
  const { mutate: reactivar } = useReactivarCotizacion();
  const { mutate: duplicar } = useDuplicarCotizacion();
  const { mutate: convertir } = useConvertirCotizacion();

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Cargando detalles de cotización...</Typography>;
  }

  if (error || !cotizacion) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          No se pudo cargar la cotización o esta no existe.
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  const handleEstado = (nuevoEstado: any) => {
    cambiarEstado({ id: cotizacionId, data: { nuevoEstado } });
  };

  const handleReactivar = () => {
    if (nuevaFecha) {
      reactivar(
        { id: cotizacionId, nuevaFechaVencimiento: nuevaFecha },
        {
          onSuccess: () => {
            setOpenReactivar(false);
            setNuevaFecha("");
          },
        }
      );
    }
  };

  const handleDuplicar = () => {
    duplicar(cotizacionId, {
      onSuccess: () => {
        navigate(`/${basePath}/cotizaciones`);
      },
    });
  };

  const handleConvertir = () => {
    convertir(cotizacionId, {
      onSuccess: () => {
        navigate(`/${basePath}/pedidos`);
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex items-center justify-between flex-wrap gap-4 no-print">
        <Box className="flex items-center gap-3">
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            Detalle de Cotización
          </Typography>
        </Box>

        <Box className="flex gap-2 flex-wrap">
          <Button
            variant="outlined"
            startIcon={<PrintOutlinedIcon />}
            onClick={handlePrint}
            size="small"
          >
            Imprimir
          </Button>

          <Button
            variant="outlined"
            startIcon={<ContentCopyOutlinedIcon />}
            onClick={handleDuplicar}
            size="small"
          >
            Duplicar
          </Button>

          {cotizacion.estado === "BORRADOR" && (
            <Button
              variant="contained"
              onClick={() => handleEstado("ENVIADA")}
              size="small"
            >
              Marcar como Enviada
            </Button>
          )}

          {cotizacion.estado === "ENVIADA" && (
            <Box className="flex gap-2">
              <Button
                variant="contained"
                color="success"
                onClick={() => handleEstado("APROBADA")}
                size="small"
              >
                Aprobar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleEstado("RECHAZADA")}
                size="small"
              >
                Rechazar
              </Button>
            </Box>
          )}

          {cotizacion.estado === "VENCIDA" && (
            <Button
              variant="contained"
              startIcon={<AutorenewOutlinedIcon />}
              onClick={() => setOpenReactivar(true)}
              size="small"
            >
              Reactivar
            </Button>
          )}

          {cotizacion.estado === "APROBADA" && !cotizacion.convertidaEnPedido && (
            <Button
              variant="contained"
              color="success"
              startIcon={<ShoppingBagOutlinedIcon />}
              onClick={handleConvertir}
              size="small"
            >
              Convertir a Pedido
            </Button>
          )}
        </Box>
      </Box>

      {cotizacion.convertidaEnPedido && (
        <Alert severity="success" sx={{ borderRadius: 2 }} className="no-print">
          Esta cotización ya fue convertida en una orden de producción (Pedido).
        </Alert>
      )}

      <Card id="printable-cotizacion" sx={{ p: 4, borderRadius: 3, border: "1px solid #e2e8f0" }}>
        <Box className="flex justify-between items-start border-b border-divider pb-6 mb-6">
          <Box className="flex flex-col gap-2">
            <Typography variant="h3" fontWeight={800} color="primary.main">
              SIGCAV
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Servicios Generales de Imprenta y Publicidad
            </Typography>
          </Box>
          <Box className="text-right">
            <Typography variant="h5" fontWeight={700}>
              COTIZACIÓN
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary.main" mt={0.5}>
              {cotizacion.numeroCotizacion}
            </Typography>
            <Box className="mt-2">
              <Chip
                label={cotizacion.estado}
                color={
                  cotizacion.estado === "APROBADA"
                    ? "success"
                    : cotizacion.estado === "ENVIADA"
                    ? "info"
                    : cotizacion.estado === "VENCIDA"
                    ? "error"
                    : "default"
                }
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4} mb={6}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={1}>
              Cliente
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {cotizacion.clienteNombre}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              RUC / DNI: {cotizacion.clienteNumeroDocumento}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} className="text-right">
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={1}>
              Información de la Cotización
            </Typography>
            <Typography variant="body2">
              Fecha Emisión: <strong>{new Date(cotizacion.creadoEn).toLocaleDateString()}</strong>
            </Typography>
            <Typography variant="body2" mt={0.5}>
              Fecha Vencimiento: <strong>{new Date(cotizacion.fechaVencimiento).toLocaleDateString()}</strong>
            </Typography>
            <Typography variant="body2" mt={0.5}>
              Elaborado por: <strong>{cotizacion.creadoPorNombre || "Sistema"}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Divider />

        <Box className="my-6">
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Descripción del Trabajo
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {cotizacion.descripcionProducto}
          </Typography>

          <Grid container spacing={2} mt={3}>
            {cotizacion.tipoImpresion && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">TIPO IMPRESIÓN</Typography>
                <Typography variant="body2" fontWeight={600}>{cotizacion.tipoImpresion}</Typography>
              </Grid>
            )}
            {cotizacion.material && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">MATERIAL / SUSTRATO</Typography>
                <Typography variant="body2" fontWeight={600}>{cotizacion.material}</Typography>
              </Grid>
            )}
            {cotizacion.dimensiones && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">DIMENSIONES</Typography>
                <Typography variant="body2" fontWeight={600}>{cotizacion.dimensiones}</Typography>
              </Grid>
            )}
            {cotizacion.acabados && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">ACABADOS</Typography>
                <Typography variant="body2" fontWeight={600}>{cotizacion.acabados}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell>Descripción</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">P. Unitario</TableCell>
                <TableCell align="right">Desc. (%)</TableCell>
                <TableCell align="right">Rec. (%)</TableCell>
                <TableCell align="right">Total Item</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ verticalAlign: "top" }}>
                  <Typography variant="body2" fontWeight={600}>
                    Servicio de Impresión Personalizada
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {cotizacion.descripcionProducto}
                  </Typography>
                </TableCell>
                <TableCell align="right">{cotizacion.cantidad}</TableCell>
                <TableCell align="right">S/ {cotizacion.precioUnitario?.toFixed(2)}</TableCell>
                <TableCell align="right">{cotizacion.descuentoPorcentaje}%</TableCell>
                <TableCell align="right">{cotizacion.recargoPorcentaje}%</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  S/ {cotizacion.subtotal?.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="flex justify-end mb-6">
          <Box sx={{ width: 280 }} className="flex flex-col gap-2">
            <Box className="flex justify-between">
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" fontWeight={600}>S/ {cotizacion.subtotal?.toFixed(2)}</Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="body2" color="text.secondary">IGV (18%)</Typography>
              <Typography variant="body2" fontWeight={600}>S/ {cotizacion.igvMonto?.toFixed(2)}</Typography>
            </Box>
            <Divider />
            <Box className="flex justify-between">
              <Typography variant="subtitle1" fontWeight={700}>Total General</Typography>
              <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                S/ {cotizacion.total?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box className="mt-6">
          <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={1}>
            Condiciones Comerciales
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tiempo de entrega estimado: <strong>{cotizacion.tiempoEntregaEstimado || "A convenir"}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Condiciones de pago: <strong>{cotizacion.condicionesPago || "50% adelanto y 50% contra entrega"}</strong>
          </Typography>
          {cotizacion.observaciones && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Notas adicionales: {cotizacion.observaciones}
            </Typography>
          )}
        </Box>
      </Card>

      <Dialog open={openReactivar} onClose={() => setOpenReactivar(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Reactivar Cotización</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-4 mt-2">
            <Typography variant="body2" color="text.secondary">
              Selecciona una nueva fecha de vencimiento para reactivar esta cotización:
            </Typography>
            <TextField
              label="Nueva Fecha"
              type="date"
              fullWidth
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Box className="flex justify-end gap-2">
              <Button onClick={() => setOpenReactivar(false)} variant="outlined" color="secondary" size="small">
                Cancelar
              </Button>
              <Button onClick={handleReactivar} variant="contained" size="small" disabled={!nuevaFecha}>
                Reactivar
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
