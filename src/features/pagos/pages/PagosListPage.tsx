import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
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
  Pagination,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { usePedidosList } from "../../pedidos/hooks/usePedidos";
import { useClientesList } from "../../clientes/hooks/useClientes";
import {
  useListarPagosPorPedido,
  useRegistrarPago,
  useCorregirPago,
  useListarCorreccionesPago,
} from "../hooks/usePagos";
import PagoFormDialog from "../components/PagoFormDialog";
import NotaCorreccionDialog from "../components/NotaCorreccionDialog";
import type { PagoResponse } from "../types/pagos.types";

export default function PagosListPage() {
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [selectedPedidoData, setSelectedPedidoData] = useState<{
    numero: string;
    cliente: string;
    total: number;
    estadoPago: string;
  } | null>(null);

  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);
  const [pedidosPage, setPedidosPage] = useState(0);

  const [openPagoDialog, setOpenPagoDialog] = useState(false);
  const [openCorrDialog, setOpenCorrDialog] = useState(false);
  const [selectedPagoId, setSelectedPagoId] = useState<number | null>(null);

  const { data: clientesData } = useClientesList(clientSearch, 0, 100);
  const { data: pedidosData, isLoading: isLoadingPedidos } = usePedidosList(
    selectedClientId,
    undefined,
    undefined,
    undefined,
    pedidosPage,
    10
  );

  const handleSelectPedido = (id: number, numero: string, cliente: string, total: number, estadoPago: string) => {
    setSelectedPedidoId(id);
    setSelectedPedidoData({ numero, cliente, total, estadoPago });
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Caja y Cobranzas
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Registro de adelantos, liquidación de saldos y bitácora de correcciones de pagos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card className="p-4 flex flex-col gap-4">
            <Box className="flex gap-2 items-center">
              <FormControl size="small" fullWidth>
                <InputLabel id="cliente-select-label">Filtrar por Cliente</InputLabel>
                <Select
                  labelId="cliente-select-label"
                  label="Filtrar por Cliente"
                  value={selectedClientId || ""}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value ? Number(e.target.value) : undefined);
                    setPedidosPage(0);
                  }}
                >
                  <MenuItem value="">Todos los Clientes</MenuItem>
                  {clientesData?.content.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombreRazonSocial}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Buscar cliente..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                sx={{ width: 250 }}
              />
            </Box>

            {isLoadingPedidos ? (
              <Box className="flex justify-center p-8">
                <CircularProgress size={30} />
              </Box>
            ) : !pedidosData?.content || pedidosData.content.length === 0 ? (
              <Alert severity="warning">No se encontraron pedidos de producción.</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pedido</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Monto Total</TableCell>
                      <TableCell>Estado Pago</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidosData.content.map((p) => (
                      <TableRow
                        key={p.id}
                        hover
                        selected={selectedPedidoId === p.id}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleSelectPedido(p.id, p.numeroPedido, p.clienteNombre, p.precioVenta, p.estadoPago)
                        }
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{p.numeroPedido}</TableCell>
                        <TableCell>{p.clienteNombre}</TableCell>
                        <TableCell align="right">S/ {p.precioVenta.toFixed(2)}</TableCell>
                        <TableCell>
                          <EstadoPagoChip estado={p.estadoPago} />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {pedidosData && pedidosData.totalPages > 1 && (
              <Box className="flex justify-center mt-2">
                <Pagination
                  count={pedidosData.totalPages}
                  page={pedidosPage + 1}
                  onChange={(_, val) => setPedidosPage(val - 1)}
                  size="small"
                />
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          {selectedPedidoId && selectedPedidoData ? (
            <DetallePagosPedido
              pedidoId={selectedPedidoId}
              pedidoNumero={selectedPedidoData.numero}
              clienteNombre={selectedPedidoData.cliente}
              totalPedido={selectedPedidoData.total}
              estadoPago={selectedPedidoData.estadoPago}
              onRegistrarPagoClick={() => setOpenPagoDialog(true)}
              onCorregirPagoClick={(pagoId) => {
                setSelectedPagoId(pagoId);
                setOpenCorrDialog(true);
              }}
            />
          ) : (
            <Card>
              <CardContent className="flex justify-center items-center p-12 text-slate-400">
                Seleccione un pedido para ver y registrar sus pagos.
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {selectedPedidoId && selectedPedidoData && (
        <PagoFormDialogWrapper
          open={openPagoDialog}
          onClose={() => setOpenPagoDialog(false)}
          pedidoId={selectedPedidoId}
          totalPedido={selectedPedidoData.total}
          estadoPago={selectedPedidoData.estadoPago}
        />
      )}

      {selectedPagoId && selectedPedidoId && (
        <NotaCorreccionDialogWrapper
          open={openCorrDialog}
          onClose={() => {
            setOpenCorrDialog(false);
            setSelectedPagoId(null);
          }}
          pagoId={selectedPagoId}
          pedidoId={selectedPedidoId}
        />
      )}
    </Box>
  );
}

function EstadoPagoChip({ estado }: { estado: string }) {
  let label = estado;
  let color: "error" | "warning" | "success" | "info" = "info";

  if (estado === "PENDIENTE_ADELANTO") {
    label = "Pendiente Adelanto (50%)";
    color = "error";
  } else if (estado === "ADELANTO_PAGADO") {
    label = "Adelanto Pagado (50%)";
    color = "warning";
  } else if (estado === "PAGADO_TOTAL") {
    label = "Pagado Total";
    color = "success";
  } else if (estado === "CORREGIDO") {
    label = "Corregido";
    color = "info";
  }

  return <Chip label={label} color={color} size="small" variant="outlined" />;
}

interface DetallePagosPedidoProps {
  pedidoId: number;
  pedidoNumero: string;
  clienteNombre: string;
  totalPedido: number;
  estadoPago: string;
  onRegistrarPagoClick: () => void;
  onCorregirPagoClick: (pagoId: number) => void;
}

function DetallePagosPedido({
  pedidoId,
  pedidoNumero,
  clienteNombre,
  totalPedido,
  estadoPago,
  onRegistrarPagoClick,
  onCorregirPagoClick,
}: DetallePagosPedidoProps) {
  const { data: pagos, isLoading } = useListarPagosPorPedido(pedidoId);

  const totalCobrado = pagos?.reduce((acc, p) => acc + p.monto, 0) || 0;
  const saldoPendiente = Math.max(0, totalPedido - totalCobrado);

  return (
    <Card className="flex flex-col gap-4 p-4">
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Pedido {pedidoNumero}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {clienteNombre}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onRegistrarPagoClick}
          disabled={saldoPendiente <= 0}
        >
          Registrar Pago
        </Button>
      </Box>

      {estadoPago === "PENDIENTE_ADELANTO" && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Requiere depósito del 50% (S/ {(totalPedido / 2).toFixed(2)}) para iniciar la producción.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }}>
          <Box className="p-2 border border-slate-100 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900/50 text-center">
            <Typography variant="caption" color="text.secondary">Total Venta</Typography>
            <Typography variant="body2" fontWeight={700}>S/ {totalPedido.toFixed(2)}</Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box className="p-2 border border-slate-100 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900/50 text-center">
            <Typography variant="caption" color="text.secondary">Cobrado</Typography>
            <Typography variant="body2" fontWeight={700} color="success.main">S/ {totalCobrado.toFixed(2)}</Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box className="p-2 border border-slate-100 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900/50 text-center">
            <Typography variant="caption" color="text.secondary">Saldo</Typography>
            <Typography variant="body2" fontWeight={700} color={saldoPendiente > 0 ? "error.main" : "text.primary"}>
              S/ {saldoPendiente.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="subtitle2" fontWeight={700} mt={1}>
        Historial de Abonos
      </Typography>

      {isLoading ? (
        <Box className="flex justify-center p-4">
          <CircularProgress size={20} />
        </Box>
      ) : !pagos || pagos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No hay abonos registrados para este pedido.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 40 }} />
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Medio</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagos.map((pago) => (
                <PagoRow
                  key={pago.id}
                  pago={pago}
                  onCorregirClick={onCorregirPagoClick}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
}

function PagoRow({
  pago,
  onCorregirClick,
}: {
  pago: PagoResponse;
  onCorregirClick: (pagoId: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{pago.tipoPago === "ADELANTO" ? "Adelanto" : "Saldo"}</TableCell>
        <TableCell align="right">S/ {pago.monto.toFixed(2)}</TableCell>
        <TableCell>{pago.fechaPago}</TableCell>
        <TableCell>{pago.formaPago}</TableCell>
        <TableCell align="center">
          <IconButton size="small" color="warning" onClick={() => onCorregirClick(pago.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-100 dark:border-slate-800 mb-2">
              <Typography variant="caption" display="block">
                Registrado por: <strong>{pago.registradoPorNombre}</strong> ({new Date(pago.creadoEn).toLocaleString()})
              </Typography>
              {pago.observacion && (
                <Typography variant="caption" display="block" mt={0.5}>
                  Observación: {pago.observacion}
                </Typography>
              )}
              <CorreccionesList pagoId={pago.id} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function CorreccionesList({ pagoId }: { pagoId: number }) {
  const { data: correcciones, isLoading } = useListarCorreccionesPago(pagoId);

  if (isLoading) return <CircularProgress size={12} className="mt-1" />;
  if (!correcciones || correcciones.length === 0) return null;

  return (
    <Box className="mt-2 pl-4 border-l-2 border-red-200">
      <Typography variant="caption" color="error.main" fontWeight={700}>
        Historial de Correcciones:
      </Typography>
      {correcciones.map((c) => (
        <Box key={c.id} className="mt-1">
          <Typography variant="caption" color="text.secondary" display="block">
            - Justificación: {c.justificacion} (por {c.usuarioNombre} el {new Date(c.creadoEn).toLocaleString()})
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function PagoFormDialogWrapper({
  open,
  onClose,
  pedidoId,
  totalPedido,
  estadoPago,
}: {
  open: boolean;
  onClose: () => void;
  pedidoId: number;
  totalPedido: number;
  estadoPago: string;
}) {
  const { data: pagos } = useListarPagosPorPedido(pedidoId);
  const totalCobrado = pagos?.reduce((acc, p) => acc + p.monto, 0) || 0;
  const saldoPendiente = Math.max(0, totalPedido - totalCobrado);

  const { mutate: registrarPago, isPending } = useRegistrarPago(pedidoId);

  const handleSubmit = (values: any) => {
    registrarPago(values, {
      onSuccess: () => onClose(),
    });
  };

  const sugerirTipo = estadoPago === "PENDIENTE_ADELANTO" ? "ADELANTO" : "SALDO";
  const sugerirMonto = estadoPago === "PENDIENTE_ADELANTO" ? totalPedido / 2 : saldoPendiente;

  return (
    <PagoFormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      pedidoId={pedidoId}
      saldoPendiente={sugerirMonto}
      sugerirTipo={sugerirTipo}
    />
  );
}

function NotaCorreccionDialogWrapper({
  open,
  onClose,
  pagoId,
  pedidoId,
}: {
  open: boolean;
  onClose: () => void;
  pagoId: number;
  pedidoId: number;
}) {
  const { mutate: corregirPago, isPending } = useCorregirPago(pedidoId);

  const handleSubmit = (values: any) => {
    corregirPago(values, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <NotaCorreccionDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={isPending}
      pagoId={pagoId}
    />
  );
}
