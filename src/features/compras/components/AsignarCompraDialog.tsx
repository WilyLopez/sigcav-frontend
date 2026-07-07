import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { compraPedidoSchema, type CompraPedidoFormValues } from "../schemas/compras.schemas";
import { usePedidosList } from "../../pedidos/hooks/usePedidos";
import {
  useAsignacionesPorCompra,
  useAsignarCompraAPedido,
  useEliminarAsignacion,
} from "../hooks/useCompras";
import type { CompraResponse } from "../types/compras.types";

interface AsignarCompraDialogProps {
  open: boolean;
  onClose: () => void;
  compra: CompraResponse | null;
}

export default function AsignarCompraDialog({ open, onClose, compra }: AsignarCompraDialogProps) {
  const compraId = compra?.id || 0;

  const { data: asignaciones, isLoading: isLoadingAsignaciones } = useAsignacionesPorCompra(compraId);
  const { data: pedidosData } = usePedidosList(undefined, undefined, undefined, undefined, 0, 100);

  const { mutate: asignar, isPending: isAssigning } = useAsignarCompraAPedido(compraId);
  const { mutate: eliminarAsignacion } = useEliminarAsignacion(compraId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CompraPedidoFormValues>({
    resolver: zodResolver(compraPedidoSchema),
    defaultValues: {
      pedidoId: 0,
      montoAsignado: 0.01,
    },
  });

  const selectedPedId = watch("pedidoId");

  useEffect(() => {
    if (open) {
      reset({
        pedidoId: 0,
        montoAsignado: 0.01,
      });
    }
  }, [open, reset]);

  const totalAsignado = asignaciones?.reduce((acc, curr) => acc + curr.montoAsignado, 0) || 0;
  const remanente = (compra?.total || 0) - totalAsignado;

  const handleAddAssignment = (values: CompraPedidoFormValues) => {
    asignar(values as any, {
      onSuccess: () => {
        reset({
          pedidoId: 0,
          montoAsignado: 0.01,
        });
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Asignar Compra a Pedidos de Producción</DialogTitle>
      <DialogContent>
        {compra && (
          <Box className="flex flex-col gap-4 mt-2">
            <Box className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Box>
                <Typography variant="caption" color="text.secondary">COMPRA / COMPROBANTE</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {compra.tipoComprobanteProveedor}: {compra.numeroComprobanteProveedor || "S/N"}
                </Typography>
                <Typography variant="caption" color="text.secondary">Proveedor: {compra.proveedorNombre}</Typography>
              </Box>
              <Box className="text-right">
                <Typography variant="caption" color="text.secondary">MONTO TOTAL</Typography>
                <Typography variant="body1" fontWeight={700} color="primary.main">S/ {compra.total?.toFixed(2)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Disponible: <strong>S/ {remanente.toFixed(2)}</strong>
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Typography variant="subtitle2" fontWeight={700}>Nueva Asignación de Costo</Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(handleAddAssignment)}
              className="flex flex-col gap-3"
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 7 }}>
                  <FormControl fullWidth size="small" error={!!errors.pedidoId}>
                    <InputLabel id="pedido-assign-label">Pedido</InputLabel>
                    <Select
                      labelId="pedido-assign-label"
                      label="Pedido"
                      value={selectedPedId || 0}
                      {...register("pedidoId", { valueAsNumber: true })}
                      onChange={(e) => setValue("pedidoId", e.target.value as any)}
                    >
                      <MenuItem value={0}>Seleccione un pedido</MenuItem>
                      {pedidosData?.content
                        .filter((p) => p.estado !== "ENTREGADO" && p.estado !== "CANCELADO")
                        .map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.numeroPedido} - {p.clienteNombre}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.pedidoId?.message}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    label="Monto (S/)"
                    type="number"
                    slotProps={{ htmlInput: { step: "0.01", min: 0.01, max: remanente } }}
                    fullWidth
                    size="small"
                    error={!!errors.montoAsignado}
                    helperText={errors.montoAsignado?.message}
                    {...register("montoAsignado", { valueAsNumber: true })}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isAssigning || remanente <= 0}
                    size="small"
                  >
                    Asignar
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Typography variant="subtitle2" fontWeight={700}>Asignaciones Activas</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nro. Pedido</TableCell>
                    <TableCell align="right">Monto Asignado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingAsignaciones ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">Cargando asignaciones...</TableCell>
                    </TableRow>
                  ) : !asignaciones || asignaciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No se han asignado montos de esta compra aún.</TableCell>
                    </TableRow>
                  ) : (
                    asignaciones.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.pedidoNumero}</TableCell>
                        <TableCell align="right">S/ {a.montoAsignado?.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => eliminarAsignacion(a.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box className="flex justify-end mt-2">
              <Button onClick={onClose} variant="outlined" color="secondary" size="small">
                Cerrar
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
