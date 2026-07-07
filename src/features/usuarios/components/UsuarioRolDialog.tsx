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
} from "@mui/material";
import { cambiarRolSchema } from "../schemas/usuarios.schemas";
import type { CambiarRolRequest, Rol } from "../types/usuarios.types";

interface UsuarioRolDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CambiarRolRequest) => void;
  isPending: boolean;
  initialRol?: Rol;
}

export default function UsuarioRolDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  initialRol,
}: UsuarioRolDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CambiarRolRequest>({
    resolver: zodResolver(cambiarRolSchema),
    defaultValues: {
      rol: initialRol || "ASISTENTE_ADMINISTRATIVO",
    },
  });

  const rolValue = watch("rol");

  useEffect(() => {
    if (open && initialRol) {
      reset({
        rol: initialRol,
      });
    }
  }, [open, initialRol, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Cambiar Rol de Usuario
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <FormControl fullWidth size="small" error={!!errors.rol}>
            <InputLabel id="rol-change-select-label">Nuevo Rol</InputLabel>
            <Select
              labelId="rol-change-select-label"
              label="Nuevo Rol"
              {...register("rol")}
              value={rolValue || "ASISTENTE_ADMINISTRATIVO"}
              onChange={(e) => setValue("rol", e.target.value as any)}
            >
              <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
              <MenuItem value="ASISTENTE_ADMINISTRATIVO">Asistente Administrativo</MenuItem>
            </Select>
            <FormHelperText>{errors.rol?.message}</FormHelperText>
          </FormControl>

          <Box className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="warning" size="small" disabled={isPending}>
              Actualizar Rol
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
