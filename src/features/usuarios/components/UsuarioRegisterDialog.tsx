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
import { registroUsuarioSchema } from "../schemas/usuarios.schemas";
import type { RegistroUsuarioRequest } from "../types/usuarios.types";

interface UsuarioRegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RegistroUsuarioRequest) => void;
  isPending: boolean;
}

export default function UsuarioRegisterDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: UsuarioRegisterDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegistroUsuarioRequest>({
    resolver: zodResolver(registroUsuarioSchema),
    defaultValues: {
      nombreCompleto: "",
      nombreUsuario: "",
      correo: "",
      contrasena: "",
      rol: "ASISTENTE_ADMINISTRATIVO",
    },
  });

  const rolValue = watch("rol");

  useEffect(() => {
    if (open) {
      reset({
        nombreCompleto: "",
        nombreUsuario: "",
        correo: "",
        contrasena: "",
        rol: "ASISTENTE_ADMINISTRATIVO",
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Registrar Usuario
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nombre de Usuario"
                fullWidth
                size="small"
                error={!!errors.nombreUsuario}
                helperText={errors.nombreUsuario?.message}
                {...register("nombreUsuario")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.rol}>
                <InputLabel id="rol-select-label">Rol</InputLabel>
                <Select
                  labelId="rol-select-label"
                  label="Rol"
                  {...register("rol")}
                  value={rolValue || "ASISTENTE_ADMINISTRATIVO"}
                  onChange={(e) => setValue("rol", e.target.value as any)}
                >
                  <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                  <MenuItem value="ASISTENTE_ADMINISTRATIVO">Asistente Administrativo</MenuItem>
                </Select>
                <FormHelperText>{errors.rol?.message}</FormHelperText>
              </FormControl>
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

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                size="small"
                error={!!errors.contrasena}
                helperText={errors.contrasena?.message}
                {...register("contrasena")}
              />
            </Grid>
          </Grid>

          <Box className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="small" disabled={isPending}>
              Registrar Usuario
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
