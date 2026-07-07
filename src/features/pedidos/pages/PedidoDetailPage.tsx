import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrafficOutlinedIcon from "@mui/icons-material/TrafficOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PrintIcon from "@mui/icons-material/Print";
import {
  usePedidoDetail,
  useGastosPedido,
  useAsignacionesPedido,
  useAgregarNotaPedido,
  useRegistrarGastoPedido,
  useEditarGastoPedido,
  useEliminarGastoPedido,
  useCambiarEstadoPedido,
} from "../hooks/usePedidos";
import { useComprasList } from "../../compras/hooks/useCompras";
import {
  useComprobantePorPedido,
  useEmitirComprobante,
  useAnularComprobante,
} from "../../comprobantes/hooks/useComprobantes";
import {
  useListarPagosPorPedido,
  useRegistrarPago,
  useCorregirPago,
} from "../../pagos/hooks/usePagos";
import CambiarEstadoDialog from "../components/CambiarEstadoDialog";
import GastoFormDialog from "../components/GastoFormDialog";
import EmitirComprobanteDialog from "../../comprobantes/components/EmitirComprobanteDialog";
import AnularComprobanteDialog from "../../comprobantes/components/AnularComprobanteDialog";
import PagoFormDialog from "../../pagos/components/PagoFormDialog";
import NotaCorreccionDialog from "../../pagos/components/NotaCorreccionDialog";
import type { GastoPedidoResponse } from "../types/pedidos.types";
import type { CambiarEstadoFormValues, GastoPedidoFormValues } from "../schemas/pedidos.schemas";

export default function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pedidoId = Number(id);

  const [openEstado, setOpenEstado] = useState(false);
  const [openGasto, setOpenGasto] = useState(false);
  const [editingGasto, setEditingGasto] = useState<GastoPedidoResponse | undefined>(undefined);
  const [nuevaNota, setNuevaNota] = useState("");

  const [openEmitirComp, setOpenEmitirComp] = useState(false);
  const [openAnularComp, setOpenAnularComp] = useState(false);
  const [openRegPago, setOpenRegPago] = useState(false);
  const [openCorrPago, setOpenCorrPago] = useState(false);
  const [selectedPagoId, setSelectedPagoId] = useState<number | null>(null);
  const [openPreviewComp, setOpenPreviewComp] = useState(false);

  const { data: pedidoFicha, isLoading, error } = usePedidoDetail(pedidoId);
  const { data: gastos } = useGastosPedido(pedidoId);
  const { data: asignaciones } = useAsignacionesPedido(pedidoId);
  const { data: compras } = useComprasList();

  const { data: comprobante, isLoading: isLoadingComp } = useComprobantePorPedido(pedidoId);
  const { data: pagos } = useListarPagosPorPedido(pedidoId);

  const { mutate: cambiarEstado, isPending: isChangingState } = useCambiarEstadoPedido();
  const { mutate: agregarNota } = useAgregarNotaPedido(pedidoId);
  const { mutate: registrarGasto, isPending: isRegisteringGasto } = useRegistrarGastoPedido(pedidoId);
  const { mutate: editarGasto, isPending: isEditingGasto } = useEditarGastoPedido(pedidoId);
  const { mutate: eliminarGasto } = useEliminarGastoPedido(pedidoId);

  const { mutate: emitirComprobante, isPending: isEmittingComp } = useEmitirComprobante();
  const { mutate: anularComprobante, isPending: isVoidingComp } = useAnularComprobante(pedidoId);
  const { mutate: registrarPago, isPending: isRegisteringPago } = useRegistrarPago(pedidoId);
  const { mutate: corregirPago, isPending: isCorrectingPago } = useCorregirPago(pedidoId);

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Cargando ficha del pedido...</Typography>;
  }

  if (error || !pedidoFicha) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          No se pudo cargar la ficha técnica del pedido.
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  const { datosgenerales, resumenFinanciero, historialEstados, notasInternas } = pedidoFicha;

  const totalCobrado = pagos?.reduce((acc, p) => acc + p.monto, 0) || 0;
  const saldoCobroPendiente = Math.max(0, datosgenerales.precioVenta - totalCobrado);

  const handleEstadoSubmit = (values: CambiarEstadoFormValues) => {
    cambiarEstado(
      { id: pedidoId, data: values },
      {
        onSuccess: () => {
          setOpenEstado(false);
        },
      }
    );
  };

  const handleGastoSubmit = (values: GastoPedidoFormValues) => {
    if (editingGasto) {
      editarGasto(
        { gastoId: editingGasto.id, data: values as any },
        {
          onSuccess: () => {
            setOpenGasto(false);
            setEditingGasto(undefined);
          },
        }
      );
    } else {
      registrarGasto(values as any, {
        onSuccess: () => {
          setOpenGasto(false);
        },
      });
    }
  };

  const handleNotaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaNota.trim()) {
      agregarNota(
        { contenido: nuevaNota },
        {
          onSuccess: () => {
            setNuevaNota("");
          },
        }
      );
    }
  };

  const handleEmitirCompSubmit = (values: any) => {
    emitirComprobante(values, {
      onSuccess: () => {
        setOpenEmitirComp(false);
      },
    });
  };

  const handleAnularCompSubmit = (values: any) => {
    anularComprobante(values, {
      onSuccess: () => {
        setOpenAnularComp(false);
      },
    });
  };

  const handleRegistrarPagoSubmit = (values: any) => {
    registrarPago(values, {
      onSuccess: () => {
        setOpenRegPago(false);
      },
    });
  };

  const handleCorregirPagoSubmit = (values: any) => {
    corregirPago(values, {
      onSuccess: () => {
        setOpenCorrPago(false);
        setSelectedPagoId(null);
      },
    });
  };

  const getCompraDetalles = (compraId: number) => {
    const matched = compras?.find((c) => c.id === compraId);
    return matched
      ? { proveedor: matched.proveedorNombre, doc: matched.numeroComprobanteProveedor }
      : { proveedor: "Desconocido", doc: "N/A" };
  };

  const sugerirTipoPago = datosgenerales.estadoPago === "PENDIENTE_ADELANTO" ? "ADELANTO" : "SALDO";
  const sugerirMontoPago = datosgenerales.estadoPago === "PENDIENTE_ADELANTO" ? datosgenerales.precioVenta / 2 : saldoCobroPendiente;

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex items-center justify-between flex-wrap gap-4">
        <Box className="flex items-center gap-3">
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            Ficha de Pedido: {datosgenerales.numeroPedido}
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpenEstado(true)} size="small">
          Cambiar Estado
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <Typography variant="caption" color="text.secondary">PRECIO VENTA</Typography>
              <Typography variant="h5" fontWeight={700}>S/ {resumenFinanciero.precioVenta?.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <Typography variant="caption" color="text.secondary">COSTO TOTAL</Typography>
              <Typography variant="h5" fontWeight={700}>S/ {resumenFinanciero.costoTotal?.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <Typography variant="caption" color="text.secondary">GANANCIA BRUTA</Typography>
              <Typography variant="h5" fontWeight={700}>S/ {resumenFinanciero.gananciaBruta?.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent className="p-4 flex flex-col gap-1">
              <Typography variant="caption" color="text.secondary">MARGEN UTILIDAD</Typography>
              <Box className="flex justify-between items-center">
                <Typography variant="h5" fontWeight={700}>
                  {resumenFinanciero.margenGananciaPorcentaje?.toFixed(1)}%
                </Typography>
                <Chip
                  icon={<TrafficOutlinedIcon fontSize="small" />}
                  label={resumenFinanciero.semaforoColor}
                  size="small"
                  color={
                    resumenFinanciero.semaforoColor === "VERDE"
                      ? "success"
                      : resumenFinanciero.semaforoColor === "AMARILLO"
                      ? "warning"
                      : "error"
                  }
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }} className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <Typography variant="h6" fontWeight={700}>Datos del Trabajo</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">CLIENTE</Typography>
                  <Typography variant="body2" fontWeight={600}>{datosgenerales.clienteNombre}</Typography>
                  <Typography variant="caption" color="text.secondary">{datosgenerales.clienteNumeroDocumento}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">CANTIDAD</Typography>
                  <Typography variant="body2" fontWeight={600}>{datosgenerales.cantidad}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">CATEGORÍA</Typography>
                  <Typography variant="body2" fontWeight={600}>{datosgenerales.categoriaProductoNombre}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">DESCRIPCIÓN</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{datosgenerales.descripcion}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">ESPECIFICACIONES TÉCNICAS</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{datosgenerales.especificaciones}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">FECHA INGRESO</Typography>
                  <Typography variant="body2">{new Date(datosgenerales.fechaIngreso).toLocaleDateString()}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">ENTREGA COMPROMETIDA</Typography>
                  <Typography variant="body2" fontWeight={600}>{new Date(datosgenerales.fechaEntregaComprometida).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <Box className="flex justify-between items-center">
                <Typography variant="h6" fontWeight={700}>Gastos Directos Operativos</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingGasto(undefined);
                    setOpenGasto(true);
                  }}
                >
                  Agregar Gasto
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Proveedor</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!gastos || gastos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No hay gastos directos registrados.</TableCell>
                      </TableRow>
                    ) : (
                      gastos.map((g) => (
                        <TableRow key={g.id}>
                          <TableCell><Chip label={g.tipoGasto} size="small" variant="outlined" /></TableCell>
                          <TableCell>{g.descripcion}</TableCell>
                          <TableCell>{g.proveedorNombre || "N/A"}</TableCell>
                          <TableCell>{new Date(g.fechaGasto).toLocaleDateString()}</TableCell>
                          <TableCell align="right">S/ {g.monto?.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <Box className="flex justify-end gap-1">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingGasto(g);
                                  setOpenGasto(true);
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => eliminarGasto(g.id)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <Typography variant="h6" fontWeight={700}>Compras e Insumos Asignados</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Proveedor</TableCell>
                      <TableCell>Nro. Comprobante</TableCell>
                      <TableCell>Fecha Asignación</TableCell>
                      <TableCell align="right">Monto Asignado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!asignaciones || asignaciones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No hay compras de almacén asignadas a este pedido.</TableCell>
                      </TableRow>
                    ) : (
                      asignaciones.map((a) => {
                        const compraDetails = getCompraDetalles(a.compraId);
                        return (
                          <TableRow key={a.id}>
                            <TableCell>{compraDetails.proveedor}</TableCell>
                            <TableCell>{compraDetails.doc}</TableCell>
                            <TableCell>{new Date(a.creadoEn).toLocaleDateString()}</TableCell>
                            <TableCell align="right">S/ {a.montoAsignado?.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <Typography variant="h6" fontWeight={700}>Finanzas y Facturación</Typography>

              <Box className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-100 dark:border-slate-800">
                <Box>
                  <Typography variant="caption" color="text.secondary">Estado de Pago</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {datosgenerales.estadoPago === "PENDIENTE_ADELANTO" && "Pendiente Adelanto (50%)"}
                    {datosgenerales.estadoPago === "ADELANTO_PAGADO" && "Adelanto Pagado (50%)"}
                    {datosgenerales.estadoPago === "PAGADO_TOTAL" && "Pagado Total"}
                    {datosgenerales.estadoPago === "CORREGIDO" && "Corregido"}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={saldoCobroPendiente <= 0}
                  onClick={() => setOpenRegPago(true)}
                >
                  Registrar Cobro
                </Button>
              </Box>

              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Cobrado:</Typography>
                  <Typography variant="body2" fontWeight={600}>S/ {totalCobrado.toFixed(2)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Saldo Pendiente:</Typography>
                  <Typography variant="body2" fontWeight={600} color={saldoCobroPendiente > 0 ? "error.main" : "success.main"}>
                    S/ {saldoCobroPendiente.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              <Box className="flex flex-col gap-2">
                <Typography variant="subtitle2" fontWeight={700}>Comprobante de Pago</Typography>
                {isLoadingComp ? (
                  <CircularProgress size={20} />
                ) : !comprobante ? (
                  <Box className="flex flex-col gap-2">
                    <Alert severity="info" sx={{ py: 0.5, borderRadius: 2 }}>
                      No se ha emitido ningún comprobante para este pedido.
                    </Alert>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ReceiptIcon />}
                      onClick={() => setOpenEmitirComp(true)}
                    >
                      Emitir Comprobante
                    </Button>
                  </Box>
                ) : (
                  <Box className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-900/30">
                    <Box className="flex justify-between items-center">
                      <Typography variant="body2" fontWeight={700}>
                        {comprobante.tipoComprobante}: {comprobante.numeroCompleto}
                      </Typography>
                      <Chip
                        label={comprobante.anulado ? "Anulado" : "Emitido"}
                        color={comprobante.anulado ? "error" : "success"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Emitido el: {comprobante.fechaEmision} por {comprobante.emitidoPorNombre}
                    </Typography>
                    <Box className="flex gap-2 justify-end mt-1">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOpenPreviewComp(true)}
                      >
                        Ver Detalle
                      </Button>
                      {!comprobante.anulado && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => setOpenAnularComp(true)}
                        >
                          Anular
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <Typography variant="h6" fontWeight={700}>Bitácora de Notas Internas</Typography>
              <Box component="form" onSubmit={handleNotaSubmit} className="flex flex-col gap-2">
                <TextField
                  placeholder="Escribe una nota interna para producción..."
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  value={nuevaNota}
                  onChange={(e) => setNuevaNota(e.target.value)}
                />
                <Button type="submit" variant="contained" size="small" disabled={!nuevaNota.trim()} sx={{ alignSelf: "flex-end" }}>
                  Agregar Nota
                </Button>
              </Box>
              <Divider />
              <Box className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {notasInternas.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">Sin notas internas aún.</Typography>
                ) : (
                  notasInternas.map((n) => (
                    <Box key={n.id} className="p-3 bg-slate-50 rounded-lg flex flex-col gap-1 border border-slate-100">
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{n.contenido}</Typography>
                      <Box className="flex justify-between items-center mt-1">
                        <Typography variant="caption" fontWeight={600} color="text.secondary">{n.creadoPorNombre}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(n.creadoEn).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <Typography variant="h6" fontWeight={700}>Historial de Estados</Typography>
              <Box className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
                {historialEstados.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Sin registros históricos.</Typography>
                ) : (
                  historialEstados.map((h) => (
                    <Box key={h.id} className="flex gap-3">
                      <Box className="flex flex-col items-center">
                        <Box className="w-2.5 h-2.5 rounded-full bg-primary-main" />
                        <Box className="w-[2px] flex-grow bg-slate-200 min-h-[40px]" />
                      </Box>
                      <Box className="flex flex-col gap-0.5">
                        <Typography variant="body2" fontWeight={600}>
                          {h.estadoAnterior ? `${h.estadoAnterior} → ` : ""}{h.estadoNuevo}
                        </Typography>
                        {h.justificacion && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            "{h.justificacion}"
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Por {h.cambiadoPorNombre} el {new Date(h.creadoEn).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CambiarEstadoDialog
        open={openEstado}
        onClose={() => setOpenEstado(false)}
        onSubmit={handleEstadoSubmit}
        isPending={isChangingState}
        currentEstado={datosgenerales.estado}
      />

      <GastoFormDialog
        open={openGasto}
        onClose={() => {
          setOpenGasto(false);
          setEditingGasto(undefined);
        }}
        onSubmit={handleGastoSubmit}
        isPending={isRegisteringGasto || isEditingGasto}
        initialData={editingGasto}
      />

      {openEmitirComp && (
        <EmitirComprobanteDialog
          open={openEmitirComp}
          onClose={() => setOpenEmitirComp(false)}
          onSubmit={handleEmitirCompSubmit}
          isPending={isEmittingComp}
          pedidoId={pedidoId}
          totalPedido={datosgenerales.precioVenta}
          clienteNombre={datosgenerales.clienteNombre}
          pedidoNumero={datosgenerales.numeroPedido}
        />
      )}

      {comprobante && openAnularComp && (
        <AnularComprobanteDialog
          open={openAnularComp}
          onClose={() => setOpenAnularComp(false)}
          onSubmit={handleAnularCompSubmit}
          isPending={isVoidingComp}
          comprobanteId={comprobante.id}
          numeroCompleto={comprobante.numeroCompleto}
        />
      )}

      {openRegPago && (
        <PagoFormDialog
          open={openRegPago}
          onClose={() => setOpenRegPago(false)}
          onSubmit={handleRegistrarPagoSubmit}
          isPending={isRegisteringPago}
          pedidoId={pedidoId}
          saldoPendiente={sugerirMontoPago}
          sugerirTipo={sugerirTipoPago}
        />
      )}

      {selectedPagoId && openCorrPago && (
        <NotaCorreccionDialog
          open={openCorrPago}
          onClose={() => {
            setOpenCorrPago(false);
            setSelectedPagoId(null);
          }}
          onSubmit={handleCorregirPagoSubmit}
          isPending={isCorrectingPago}
          pagoId={selectedPagoId}
        />
      )}

      {comprobante && (
        <Dialog open={openPreviewComp} onClose={() => setOpenPreviewComp(false)} maxWidth="sm" fullWidth>
          <DialogTitle className="flex justify-between items-center" sx={{ fontWeight: 700 }}>
            <span>Comprobante de Pago</span>
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
                    {comprobante.tipoComprobante}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {comprobante.numeroCompleto}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2">
                    <strong>Adquiriente:</strong> {comprobante.clienteNombreRazonSocial}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>R.U.C. / D.N.I.:</strong> {comprobante.clienteNumeroDocumento}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>Fecha Emisión:</strong> {comprobante.fechaEmision}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>Pedido Origen:</strong> {comprobante.numeroPedido}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    <strong>Medio de Pago:</strong> {comprobante.formaPago}
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
                    <TableCell>{comprobante.descripcionServicio}</TableCell>
                    <TableCell align="right">S/ {comprobante.total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box className="flex flex-col align-end items-end gap-1 mt-2">
                <Box className="flex justify-between w-48">
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">S/ {comprobante.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between w-48">
                  <Typography variant="body2">IGV ({comprobante.igvPorcentaje}%):</Typography>
                  <Typography variant="body2">S/ {comprobante.igvMonto.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between w-48 font-bold border-t border-slate-300 dark:border-slate-700 pt-1">
                  <Typography variant="body2" fontWeight={700}>TOTAL:</Typography>
                  <Typography variant="body2" fontWeight={700}>S/ {comprobante.total.toFixed(2)}</Typography>
                </Box>
              </Box>

              {comprobante.anulado && (
                <Box className="p-2 border border-red-300 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded text-center mt-2">
                  <Typography variant="body2" fontWeight={700}>
                    COMPROBANTE ANULADO
                  </Typography>
                </Box>
              )}

              <Box className="mt-4 text-center">
                <Typography variant="caption" color="text.secondary">
                  Emitido por: {comprobante.emitidoPorNombre} | Creado: {new Date(comprobante.creadoEn).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

