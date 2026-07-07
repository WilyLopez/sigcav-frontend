import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import { clienteSchema, type ClienteFormValues } from "../schemas/clientes.schemas";
import type { ClienteDetalleResponse } from "../types/clientes.types";

interface ClienteFormProps {
  initialValues?: ClienteDetalleResponse;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function ClienteForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipoDocumento: "DNI",
      numeroDocumento: "",
      nombreRazonSocial: "",
      telefonoPrincipal: "",
      telefonoSecundario: "",
      correo: "",
      direccionEntrega: "",
      nombreContactoRef: "",
      observaciones: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue("tipoDocumento", initialValues.tipoDocumento);
      setValue("numeroDocumento", initialValues.numeroDocumento);
      setValue("nombreRazonSocial", initialValues.nombreRazonSocial);
      setValue("telefonoPrincipal", initialValues.telefonoPrincipal);
      setValue("telefonoSecundario", initialValues.telefonoSecundario || "");
      setValue("correo", initialValues.correo);
      setValue("direccionEntrega", initialValues.direccionEntrega);
      setValue("nombreContactoRef", initialValues.nombreContactoRef || "");
      setValue("observaciones", initialValues.observaciones || "");
    }
  }, [initialValues, setValue]);

  const tipoDocumento = watch("tipoDocumento");

  const submitHandler = (values: ClienteFormValues) => {
    onSubmit({
      ...values,
      contactos: initialValues ? initialValues.contactos : [],
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small" error={!!errors.tipoDocumento}>
            <InputLabel id="tipo-documento-label">Tipo Documento</InputLabel>
            <Select
              labelId="tipo-documento-label"
              label="Tipo Documento"
              value={tipoDocumento || "DNI"}
              onChange={(e) => setValue("tipoDocumento", e.target.value as any, { shouldValidate: true })}
            >
              <MenuItem value="DNI">DNI</MenuItem>
              <MenuItem value="RUC">RUC</MenuItem>
            </Select>
            <FormHelperText>{errors.tipoDocumento?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            label="Número Documento"
            fullWidth
            error={!!errors.numeroDocumento}
            helperText={errors.numeroDocumento?.message}
            {...register("numeroDocumento")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Nombre o Razón Social"
            fullWidth
            error={!!errors.nombreRazonSocial}
            helperText={errors.nombreRazonSocial?.message}
            {...register("nombreRazonSocial")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Teléfono Principal"
            fullWidth
            error={!!errors.telefonoPrincipal}
            helperText={errors.telefonoPrincipal?.message}
            {...register("telefonoPrincipal")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Teléfono Secundario"
            fullWidth
            error={!!errors.telefonoSecundario}
            helperText={errors.telefonoSecundario?.message}
            {...register("telefonoSecundario")}
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
          <TextField
            label="Dirección de Entrega"
            fullWidth
            error={!!errors.direccionEntrega}
            helperText={errors.direccionEntrega?.message}
            {...register("direccionEntrega")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Contacto de Referencia (Nombre)"
            fullWidth
            error={!!errors.nombreContactoRef}
            helperText={errors.nombreContactoRef?.message}
            {...register("nombreContactoRef")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Observaciones"
            multiline
            rows={3}
            fullWidth
            error={!!errors.observaciones}
            helperText={errors.observaciones?.message}
            {...register("observaciones")}
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
