import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { anulacionComprobanteSchema } from "../schemas/comprobantes.schemas";
import type { AnulacionComprobanteRequest } from "../types/comprobantes.types";

interface AnularComprobanteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AnulacionComprobanteRequest) => void;
  isPending: boolean;
  comprobanteId: number;
  numeroCompleto: string;
}

export default function AnularComprobanteDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  comprobanteId,
  numeroCompleto,
}: AnularComprobanteDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AnulacionComprobanteRequest>({
    resolver: zodResolver(anulacionComprobanteSchema),
    defaultValues: {
      comprobanteId: comprobanteId,
      justificacion: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        comprobanteId: comprobanteId,
        justificacion: "",
      });
    }
  }, [open, comprobanteId, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Anular Comprobante
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="error" className="mb-4">
          ¿Está seguro de que desea anular el comprobante <strong>{numeroCompleto}</strong>? Esta acción es irreversible y afectará los registros contables.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <TextField
            label="Motivo / Justificación de anulación"
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
            <Button type="submit" variant="contained" color="error" size="small" disabled={isPending}>
              Confirmar Anulación
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
