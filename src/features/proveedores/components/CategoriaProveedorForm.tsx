import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { categoriaProveedorSchema, type CategoriaProveedorFormValues } from "../schemas/proveedores.schemas";
import type { CategoriaProveedor } from "../types/proveedores.types";

interface CategoriaProveedorFormProps {
  onSubmit: (values: CategoriaProveedorFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  initialData?: CategoriaProveedor;
}

export default function CategoriaProveedorForm({ onSubmit, onCancel, isPending, initialData }: CategoriaProveedorFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoriaProveedorFormValues>({
    resolver: zodResolver(categoriaProveedorSchema),
    defaultValues: {
      nombre: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("nombre", initialData.nombre);
    }
  }, [initialData, setValue]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        label="Nombre de Categoría"
        fullWidth
        size="small"
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        {...register("nombre")}
      />

      <Box className="flex justify-end gap-2 mt-2">
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
