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
} from "@mui/material";
import { proveedorSchema, type ProveedorFormValues } from "../schemas/proveedores.schemas";
import { useCategoriasActivasList } from "../hooks/useProveedores";
import type { ProveedorDetalle } from "../types/proveedores.types";

interface ProveedorFormProps {
  onSubmit: (values: ProveedorFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  initialData?: ProveedorDetalle;
}

export default function ProveedorForm({ onSubmit, onCancel, isPending, initialData }: ProveedorFormProps) {
  const { data: categorias } = useCategoriasActivasList();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      tipoDocumento: "RUC",
      numeroDocumento: "",
      nombreRazonSocial: "",
      categoriaProveedorId: 0,
      telefono: "",
      correo: "",
      direccion: "",
      nombreRepresentante: "",
      observaciones: "",
    },
  });

  const tipoDoc = watch("tipoDocumento");

  useEffect(() => {
    if (initialData) {
      setValue("tipoDocumento", initialData.tipoDocumento);
      setValue("numeroDocumento", initialData.numeroDocumento);
      setValue("nombreRazonSocial", initialData.nombreRazonSocial);
      setValue("categoriaProveedorId", initialData.categoriaProveedorId);
      setValue("telefono", initialData.telefono);
      setValue("correo", initialData.correo || "");
      setValue("direccion", initialData.direccion || "");
      setValue("nombreRepresentante", initialData.nombreRepresentante || "");
      setValue("observaciones", initialData.observaciones || "");
    }
  }, [initialData, setValue]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small" error={!!errors.tipoDocumento}>
            <InputLabel id="tipo-doc-label">Tipo Documento</InputLabel>
            <Select
              labelId="tipo-doc-label"
              label="Tipo Documento"
              {...register("tipoDocumento")}
              value={tipoDoc || "RUC"}
              onChange={(e) => setValue("tipoDocumento", e.target.value as any)}
            >
              <MenuItem value="RUC">RUC</MenuItem>
              <MenuItem value="DNI">DNI</MenuItem>
            </Select>
            <FormHelperText>{errors.tipoDocumento?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            label="Número Documento"
            fullWidth
            size="small"
            error={!!errors.numeroDocumento}
            helperText={errors.numeroDocumento?.message}
            {...register("numeroDocumento")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Nombre / Razón Social"
            fullWidth
            size="small"
            error={!!errors.nombreRazonSocial}
            helperText={errors.nombreRazonSocial?.message}
            {...register("nombreRazonSocial")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small" error={!!errors.categoriaProveedorId}>
            <InputLabel id="categoria-select-label">Categoría</InputLabel>
            <Select
              labelId="categoria-select-label"
              label="Categoría"
              defaultValue={0}
              {...register("categoriaProveedorId", { valueAsNumber: true })}
            >
              <MenuItem value={0}>Seleccione una categoría</MenuItem>
              {categorias?.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.categoriaProveedorId?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Teléfono"
            fullWidth
            size="small"
            error={!!errors.telefono}
            helperText={errors.telefono?.message}
            {...register("telefono")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Correo Electrónico"
            fullWidth
            size="small"
            error={!!errors.correo}
            helperText={errors.correo?.message}
            {...register("correo")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Representante"
            fullWidth
            size="small"
            error={!!errors.nombreRepresentante}
            helperText={errors.nombreRepresentante?.message}
            {...register("nombreRepresentante")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Dirección"
            fullWidth
            size="small"
            error={!!errors.direccion}
            helperText={errors.direccion?.message}
            {...register("direccion")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Observaciones"
            multiline
            rows={2}
            fullWidth
            size="small"
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
          Guardar
        </Button>
      </Box>
    </Box>
  );
}
