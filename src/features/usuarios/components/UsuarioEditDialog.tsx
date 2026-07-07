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
  Grid,
} from "@mui/material";
import { actualizarUsuarioSchema } from "../schemas/usuarios.schemas";
import type { ActualizarUsuarioRequest, UsuarioResponse } from "../types/usuarios.types";

interface UsuarioEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ActualizarUsuarioRequest) => void;
  isPending: boolean;
  initialData?: UsuarioResponse;
}

export default function UsuarioEditDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  initialData,
}: UsuarioEditDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActualizarUsuarioRequest>({
    resolver: zodResolver(actualizarUsuarioSchema),
    defaultValues: {
      nombreCompleto: "",
      correo: "",
    },
  });

  useEffect(() => {
    if (open && initialData) {
      reset({
        nombreCompleto: initialData.nombreCompleto,
        correo: initialData.correo,
      });
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Editar Usuario
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Nombre Completo"
                fullWidth
                size="small"
                error={!!errors.nombreCompleto}
                helperText={errors.nombreCompleto?.message}
                {...register("nombreCompleto")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Correo Electrónico"
                fullWidth
                size="small"
                error={!!errors.correo}
                helperText={errors.correo?.message}
                {...register("correo")}
              />
            </Grid>
          </Grid>

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
