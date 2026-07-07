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
import { cambioContrasenaSchema } from "../schemas/usuarios.schemas";
import type { CambioContrasenaRequest } from "../types/usuarios.types";

interface UsuarioPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CambioContrasenaRequest) => void;
  isPending: boolean;
}

export default function UsuarioPasswordDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: UsuarioPasswordDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CambioContrasenaRequest>({
    resolver: zodResolver(cambioContrasenaSchema),
    defaultValues: {
      contrasenaActual: "",
      contrasenaNueva: "",
      confirmarContrasena: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        contrasenaActual: "",
        contrasenaNueva: "",
        confirmarContrasena: "",
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Cambiar Contraseña
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
                label="Contraseña Actual"
                type="password"
                fullWidth
                size="small"
                error={!!errors.contrasenaActual}
                helperText={errors.contrasenaActual?.message}
                {...register("contrasenaActual")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Nueva Contraseña"
                type="password"
                fullWidth
                size="small"
                error={!!errors.contrasenaNueva}
                helperText={errors.contrasenaNueva?.message}
                {...register("contrasenaNueva")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                fullWidth
                size="small"
                error={!!errors.confirmarContrasena}
                helperText={errors.confirmarContrasena?.message}
                {...register("confirmarContrasena")}
              />
            </Grid>
          </Grid>

          <Box className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" size="small" disabled={isPending}>
              Cambiar Contraseña
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
