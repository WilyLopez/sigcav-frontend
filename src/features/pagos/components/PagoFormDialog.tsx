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
} from "@mui/material";
import { pagoSchema } from "../schemas/pagos.schemas";
import type { PagoRequest } from "../types/pagos.types";

interface PagoFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PagoRequest) => void;
  isPending: boolean;
  pedidoId: number;
  saldoPendiente?: number;
  sugerirTipo?: "ADELANTO" | "SALDO";
}

export default function PagoFormDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  pedidoId,
  saldoPendiente,
  sugerirTipo = "ADELANTO",
}: PagoFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PagoRequest>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      pedidoId: pedidoId,
      tipoPago: sugerirTipo,
      monto: saldoPendiente || 0.01,
      fechaPago: new Date().toISOString().substring(0, 10),
      formaPago: "EFECTIVO",
      observacion: "",
    },
  });

  const tipoP = watch("tipoPago");
  const formaP = watch("formaPago");

  useEffect(() => {
    if (open) {
      reset({
        pedidoId: pedidoId,
        tipoPago: sugerirTipo,
        monto: saldoPendiente || 0.01,
        fechaPago: new Date().toISOString().substring(0, 10),
        formaPago: "EFECTIVO",
        observacion: "",
      });
    }
  }, [open, pedidoId, saldoPendiente, sugerirTipo, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Registrar Pago
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.tipoPago}>
                <InputLabel id="tipo-pago-label">Tipo Pago</InputLabel>
                <Select
                  labelId="tipo-pago-label"
                  label="Tipo Pago"
                  {...register("tipoPago")}
                  value={tipoP || "ADELANTO"}
                  onChange={(e) => setValue("tipoPago", e.target.value as any)}
                >
                  <MenuItem value="ADELANTO">Adelanto (50%)</MenuItem>
                  <MenuItem value="SALDO">Saldo / Liquidación</MenuItem>
                </Select>
                <FormHelperText>{errors.tipoPago?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Fecha de Pago"
                type="date"
                fullWidth
                size="small"
                error={!!errors.fechaPago}
                helperText={errors.fechaPago?.message}
                {...register("fechaPago")}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Monto (S/)"
                type="number"
                slotProps={{ htmlInput: { step: "0.01", min: 0.01 } }}
                fullWidth
                size="small"
                error={!!errors.monto}
                helperText={errors.monto?.message}
                {...register("monto", { valueAsNumber: true })}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.formaPago}>
                <InputLabel id="forma-pago-label">Forma de Pago</InputLabel>
                <Select
                  labelId="forma-pago-label"
                  label="Forma de Pago"
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
                label="Observación / Comentario"
                multiline
                rows={2}
                fullWidth
                size="small"
                error={!!errors.observacion}
                helperText={errors.observacion?.message}
                {...register("observacion")}
              />
            </Grid>
          </Grid>

          <Box className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="small" disabled={isPending}>
              Registrar Pago
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
