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
} from "@mui/material";
import { notaCorreccionSchema } from "../schemas/pagos.schemas";
import type { NotaCorreccionPagoRequest } from "../types/pagos.types";

interface NotaCorreccionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: NotaCorreccionPagoRequest) => void;
  isPending: boolean;
  pagoId: number;
}

export default function NotaCorreccionDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  pagoId,
}: NotaCorreccionDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NotaCorreccionPagoRequest>({
    resolver: zodResolver(notaCorreccionSchema),
    defaultValues: {
      pagoId: pagoId,
      justificacion: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        pagoId: pagoId,
        justificacion: "",
      });
    }
  }, [open, pagoId, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Corregir Pago (Bitácora)
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <TextField
            label="Justificación de la corrección"
            multiline
            rows={4}
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
              Corregir Pago
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
