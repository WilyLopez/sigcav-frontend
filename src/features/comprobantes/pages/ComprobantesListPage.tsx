import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Alert,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Block as BlockIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import {
  useListarComprobantes,
  useAnularComprobante,
} from "../hooks/useComprobantes";
import AnularComprobanteDialog from "../components/AnularComprobanteDialog";
import type { ComprobanteResponse, TipoComprobante } from "../types/comprobantes.types";

export default function ComprobantesListPage() {
  const [desde, setDesde] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().substring(0, 10);
  });
  const [hasta, setHasta] = useState(() => new Date().toISOString().substring(0, 10));
  const [tipo, setTipo] = useState<TipoComprobante | "ALL">("ALL");

  const [selectedComp, setSelectedComp] = useState<ComprobanteResponse | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const [voidComp, setVoidComp] = useState<ComprobanteResponse | null>(null);
  const [openVoidDialog, setOpenVoidDialog] = useState(false);

  const { data: comprobantes, isLoading, refetch } = useListarComprobantes(
    desde,
    hasta,
    tipo === "ALL" ? undefined : tipo
  );

  const { mutate: anularComprobante, isPending: isVoiding } = useAnularComprobante(
    voidComp?.pedidoId || undefined
  );

  const handleOpenDetail = (comp: ComprobanteResponse) => {
    setSelectedComp(comp);
    setOpenDetail(true);
  };

  const handleOpenVoid = (comp: ComprobanteResponse) => {
    setVoidComp(comp);
    setOpenVoidDialog(true);
  };

  const handleVoidSubmit = (values: any) => {
    anularComprobante(values, {
      onSuccess: () => {
        setOpenVoidDialog(false);
        setVoidComp(null);
        refetch();
      },
    });
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Comprobantes de Pago
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Facturación oficial, boletas de venta y notas de venta emitidas
        </Typography>
      </Box>

      <Card className="p-4">
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 3 }}>
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
          <Grid size={{ xs: 12, sm: 3 }}>
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
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-comprobante-filter-label">Tipo</InputLabel>
              <Select
                labelId="tipo-comprobante-filter-label"
                label="Tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="NOTA_VENTA">Nota de Venta</MenuItem>
                <MenuItem value="BOLETA">Boleta</MenuItem>
                <MenuItem value="FACTURA">Factura</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button variant="contained" fullWidth size="small" onClick={() => refetch()}>
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Card>

      {isLoading ? (
        <Box className="flex justify-center p-12">
          <CircularProgress />
        </Box>
      ) : !comprobantes || comprobantes.length === 0 ? (
        <Alert severity="warning">No se encontraron comprobantes en el rango de fechas seleccionado.</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Pedido</TableCell>
                <TableCell>Fecha Emisión</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">IGV</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comprobantes.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{c.numeroCompleto}</TableCell>
                  <TableCell>
                    <TipoCompChip tipo={c.tipoComprobante} />
                  </TableCell>
                  <TableCell>{c.numeroPedido}</TableCell>
                  <TableCell>{c.fechaEmision}</TableCell>
                  <TableCell>{c.clienteNombreRazonSocial}</TableCell>
                  <TableCell align="right">S/ {c.subtotal.toFixed(2)}</TableCell>
                  <TableCell align="right">S/ {c.igvMonto.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    S/ {c.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.anulado ? "Anulado" : "Emitido"}
                      color={c.anulado ? "error" : "success"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex justify-center gap-1">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDetail(c)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenVoid(c)}
                        disabled={c.anulado}
                      >
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedComp && (
        <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
          <DialogTitle className="flex justify-between items-center" sx={{ fontWeight: 700 }}>
            <span>Detalle de Comprobante</span>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Imprimir
            </Button>
          </DialogTitle>
          <DialogContent dividers>
            <Box className="flex flex-col gap-4 p-2">
              <Box className="flex justify-between items-start">
                <Box>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    SIGCAV S.A.C.
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Servicios de Imprenta y Confección
                  </Typography>
                </Box>
                <Box className="border border-slate-300 dark:border-slate-700 p-2 rounded text-center bg-slate-50 dark:bg-slate-900/50">
                  <Typography variant="caption" display="block" fontWeight={700}>
                    R.U.C. 20123456789
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="error.main">
                    {selectedComp.tipoComprobante}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {selectedComp.numeroCompleto}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2">
                    <strong>Adquiriente:</strong> {selectedComp.clienteNombreRazonSocial}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>R.U.C. / D.N.I.:</strong> {selectedComp.clienteNumeroDocumento}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>Fecha Emisión:</strong> {selectedComp.fechaEmision}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>Pedido Origen:</strong> {selectedComp.numeroPedido}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>Medio de Pago:</strong> {selectedComp.formaPago}
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción del Servicio</TableCell>
                    <TableCell align="right">Importe</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedComp.descripcionServicio}</TableCell>
                    <TableCell align="right">S/ {selectedComp.total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box className="flex flex-col align-end items-end gap-1 mt-2">
                <Box className="flex justify-between w-48">
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">S/ {selectedComp.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between w-48">
                  <Typography variant="body2">IGV ({selectedComp.igvPorcentaje}%):</Typography>
                  <Typography variant="body2">S/ {selectedComp.igvMonto.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between w-48 font-bold border-t border-slate-300 dark:border-slate-700 pt-1">
                  <Typography variant="body2" fontWeight={700}>TOTAL:</Typography>
                  <Typography variant="body2" fontWeight={700}>S/ {selectedComp.total.toFixed(2)}</Typography>
                </Box>
              </Box>

              {selectedComp.anulado && (
                <Box className="p-2 border border-red-300 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded text-center mt-2">
                  <Typography variant="body2" fontWeight={700}>
                    COMPROBANTE ANULADO
                  </Typography>
                </Box>
              )}

              <Box className="mt-4 text-center">
                <Typography variant="caption" color="text.secondary">
                  Emitido por: {selectedComp.emitidoPorNombre} | Creado: {new Date(selectedComp.creadoEn).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {voidComp && (
        <AnularComprobanteDialog
          open={openVoidDialog}
          onClose={() => {
            setOpenVoidDialog(false);
            setVoidComp(null);
          }}
          onSubmit={handleVoidSubmit}
          isPending={isVoiding}
          comprobanteId={voidComp.id}
          numeroCompleto={voidComp.numeroCompleto}
        />
      )}
    </Box>
  );
}

function TipoCompChip({ tipo }: { tipo: string }) {
  let label = tipo;
  let color: "primary" | "secondary" | "info" = "info";

  if (tipo === "FACTURA") {
    label = "Factura";
    color = "primary";
  } else if (tipo === "BOLETA") {
    label = "Boleta";
    color = "secondary";
  } else if (tipo === "NOTA_VENTA") {
    label = "Nota de Venta";
    color = "info";
  }

  return <Chip label={label} color={color} size="small" variant="outlined" />;
}
