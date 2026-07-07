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
} from "@mui/material";
import { cambiarEstadoSchema, type CambiarEstadoFormValues } from "../schemas/pedidos.schemas";
import type { EstadoPedido } from "../types/pedidos.types";

interface CambiarEstadoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CambiarEstadoFormValues) => void;
  isPending: boolean;
  currentEstado: EstadoPedido;
}

export default function CambiarEstadoDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  currentEstado,
}: CambiarEstadoDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CambiarEstadoFormValues>({
    resolver: zodResolver(cambiarEstadoSchema),
    defaultValues: {
      estadoDestino: currentEstado,
      justificacion: "",
    },
  });

  const destEstado = watch("estadoDestino");

  useEffect(() => {
    if (open) {
      reset({
        estadoDestino: currentEstado,
        justificacion: "",
      });
    }
  }, [open, currentEstado, reset]);

  const esJustificacionRequerida = destEstado === "CANCELADO" || destEstado === "COMPLETADO";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Cambiar Estado de Pedido</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <FormControl fullWidth size="small" error={!!errors.estadoDestino}>
            <InputLabel id="estado-destino-label">Nuevo Estado</InputLabel>
            <Select
              labelId="estado-destino-label"
              label="Nuevo Estado"
              {...register("estadoDestino")}
              value={destEstado || ""}
              onChange={(e) => setValue("estadoDestino", e.target.value as any)}
            >
              <MenuItem value="NUEVO">Nuevo (Pendiente)</MenuItem>
              <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
              <MenuItem value="COMPLETADO">Completado</MenuItem>
              <MenuItem value="ENTREGADO">Entregado</MenuItem>
              <MenuItem value="CANCELADO">Cancelado</MenuItem>
            </Select>
            <FormHelperText>{errors.estadoDestino?.message}</FormHelperText>
          </FormControl>

          <TextField
            label={esJustificacionRequerida ? "Justificación (Obligatoria)" : "Justificación / Observaciones"}
            multiline
            rows={3}
            fullWidth
            size="small"
            error={!!errors.justificacion}
            helperText={errors.justificacion?.message}
            {...register("justificacion")}
          />

          <Box className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="small" disabled={isPending}>
              Cambiar Estado
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
