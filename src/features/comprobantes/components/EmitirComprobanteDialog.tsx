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
} from "@mui/material";
import { comprobanteSchema } from "../schemas/comprobantes.schemas";
import type { ComprobanteRequest } from "../types/comprobantes.types";

interface EmitirComprobanteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ComprobanteRequest) => void;
  isPending: boolean;
  pedidoId: number;
  totalPedido: number;
  clienteNombre: string;
  pedidoNumero: string;
}

export default function EmitirComprobanteDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  pedidoId,
  totalPedido,
  clienteNombre,
  pedidoNumero,
}: EmitirComprobanteDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ComprobanteRequest>({
    resolver: zodResolver(comprobanteSchema),
    defaultValues: {
      pedidoId: pedidoId,
      tipoComprobante: "NOTA_VENTA",
      formaPago: "EFECTIVO",
      descripcionServicio: "",
    },
  });

  const tipoC = watch("tipoComprobante");
  const formaP = watch("formaPago");

  useEffect(() => {
    if (open) {
      reset({
        pedidoId: pedidoId,
        tipoComprobante: "NOTA_VENTA",
        formaPago: "EFECTIVO",
        descripcionServicio: `Servicio de confección publicitaria según pedido Nro ${pedidoNumero}`,
      });
    }
  }, [open, pedidoId, pedidoNumero, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Emitir Comprobante
      </DialogTitle>
      <DialogContent>
        <Box className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <Typography variant="body2" color="text.secondary">
            Cliente: <strong>{clienteNombre}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Pedido: <strong>{pedidoNumero}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Monto Total: <strong>S/ {totalPedido.toFixed(2)}</strong>
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.tipoComprobante}>
                <InputLabel id="tipo-comprobante-label">Tipo Comprobante</InputLabel>
                <Select
                  labelId="tipo-comprobante-label"
                  label="Tipo Comprobante"
                  {...register("tipoComprobante")}
                  value={tipoC || "NOTA_VENTA"}
                  onChange={(e) => setValue("tipoComprobante", e.target.value as any)}
                >
                  <MenuItem value="NOTA_VENTA">Nota de Venta (Interno)</MenuItem>
                  <MenuItem value="BOLETA">Boleta de Venta</MenuItem>
                  <MenuItem value="FACTURA">Factura (IGV 18%)</MenuItem>
                </Select>
                <FormHelperText>{errors.tipoComprobante?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.formaPago}>
                <InputLabel id="forma-pago-comp-label">Medio de Pago</InputLabel>
                <Select
                  labelId="forma-pago-comp-label"
                  label="Medio de Pago"
                  {...register("formaPago")}
                  value={formaP || "EFECTIVO"}
                  onChange={(e) => setValue("formaPago", e.target.value as any)}
                >
                  <MenuItem value="EFECTIVO">Efectivo</MenuItem>
                  <MenuItem value="TRANSFERENCIA">Transferencia Bancaria</MenuItem>
                  <MenuItem value="YAPE_PLIN">Yape / Plin</MenuItem>
                  <MenuItem value="OTRO">Otro</MenuItem>
                </Select>
                <FormHelperText>{errors.formaPago?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Descripción del Servicio"
                fullWidth
                size="small"
                error={!!errors.descripcionServicio}
                helperText={errors.descripcionServicio?.message}
                {...register("descripcionServicio")}
              />
            </Grid>
          </Grid>

          <Box className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="small" disabled={isPending}>
              Emitir Comprobante
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
