import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import { contactoSchema, type ContactoFormValues } from "../schemas/clientes.schemas";
import type { ContactoClienteResponse } from "../types/clientes.types";

interface ContactoFormProps {
  initialValues?: ContactoClienteResponse;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function ContactoForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
}: ContactoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      nombre: "",
      telefono: "",
      correo: "",
      cargo: "",
      esPrincipal: false,
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue("nombre", initialValues.nombre);
      setValue("telefono", initialValues.telefono || "");
      setValue("correo", initialValues.correo || "");
      setValue("cargo", initialValues.cargo || "");
      setValue("esPrincipal", initialValues.esPrincipal || false);
    }
  }, [initialValues, setValue]);

  const esPrincipal = watch("esPrincipal");

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Nombre Completo"
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre?.message}
            {...register("nombre")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Teléfono"
            fullWidth
            error={!!errors.telefono}
            helperText={errors.telefono?.message}
            {...register("telefono")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Cargo / Puesto"
            fullWidth
            error={!!errors.cargo}
            helperText={errors.cargo?.message}
            {...register("cargo")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Correo Electrónico"
            type="email"
            fullWidth
            error={!!errors.correo}
            helperText={errors.correo?.message}
            {...register("correo")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={esPrincipal || false}
                onChange={(e) => setValue("esPrincipal", e.target.checked)}
              />
            }
            label="Es el contacto principal"
          />
        </Grid>
      </Grid>

      <Box className="flex justify-end gap-2 mt-4">
        <Button onClick={onCancel} variant="outlined" color="secondary" size="small" disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" size="small" disabled={isPending}>
          {isPending ? <CircularProgress size={20} color="inherit" /> : "Guardar"}
        </Button>
      </Box>
    </Box>
  );
}
