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
import { parametroSchema } from "../schemas/configuracion.schemas";
import type { ActualizarParametroRequest, ParametroSistemaResponse } from "../types/configuracion.types";

interface ParametroFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ActualizarParametroRequest) => void;
  isPending: boolean;
  parametro: ParametroSistemaResponse;
}

export default function ParametroFormDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  parametro,
}: ParametroFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActualizarParametroRequest>({
    resolver: zodResolver(parametroSchema),
    defaultValues: {
      valor: "",
    },
  });

  useEffect(() => {
    if (open && parametro) {
      reset({
        valor: parametro.valor,
      });
    }
  }, [open, parametro, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Editar Parámetro
      </DialogTitle>
      <DialogContent>
        <Box className="mb-4">
          <Typography variant="body2" color="primary" fontWeight={700}>
            {parametro.clave}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {parametro.descripcion}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <TextField
            label="Valor del Parámetro"
            fullWidth
            size="small"
            error={!!errors.valor}
            helperText={errors.valor?.message}
            {...register("valor")}
          />

          <Box className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="small" disabled={isPending}>
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
