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
import { gastoPedidoSchema, type GastoPedidoFormValues } from "../schemas/pedidos.schemas";
import { useProveedoresList } from "../../proveedores/hooks/useProveedores";
import type { GastoPedidoResponse } from "../types/pedidos.types";

interface GastoFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: GastoPedidoFormValues) => void;
  isPending: boolean;
  initialData?: GastoPedidoResponse;
}

export default function GastoFormDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  initialData,
}: GastoFormDialogProps) {
  const { data: proveedoresData } = useProveedoresList("", 0, 100);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<GastoPedidoFormValues>({
    resolver: zodResolver(gastoPedidoSchema),
    defaultValues: {
      tipoGasto: "OTRO",
      descripcion: "",
      proveedorId: 0,
      fechaGasto: new Date().toISOString().substring(0, 10),
      monto: 0.01,
      numeroComprobanteProveedor: "",
      observaciones: "",
    },
  });

  const tipoG = watch("tipoGasto");
  const provId = watch("proveedorId");

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          tipoGasto: initialData.tipoGasto,
          descripcion: initialData.descripcion,
          proveedorId: initialData.proveedorId || 0,
          fechaGasto: initialData.fechaGasto,
          monto: initialData.monto,
          numeroComprobanteProveedor: initialData.numeroComprobanteProveedor || "",
          observaciones: initialData.observaciones || "",
        });
      } else {
        reset({
          tipoGasto: "OTRO",
          descripcion: "",
          proveedorId: 0,
          fechaGasto: new Date().toISOString().substring(0, 10),
          monto: 0.01,
          numeroComprobanteProveedor: "",
          observaciones: "",
        });
      }
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Editar Gasto Directo" : "Registrar Gasto Directo"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.tipoGasto}>
                <InputLabel id="tipo-gasto-label">Tipo Gasto</InputLabel>
                <Select
                  labelId="tipo-gasto-label"
                  label="Tipo Gasto"
                  {...register("tipoGasto")}
                  value={tipoG || "OTRO"}
                  onChange={(e) => setValue("tipoGasto", e.target.value as any)}
                >
                  <MenuItem value="MANO_OBRA_EXTERNA">Mano de Obra Externa</MenuItem>
                  <MenuItem value="SERVICIO_EXTERNO">Servicio Externo</MenuItem>
                  <MenuItem value="TRANSPORTE">Transporte / Courier</MenuItem>
                  <MenuItem value="OTRO">Otro Gasto</MenuItem>
                </Select>
                <FormHelperText>{errors.tipoGasto?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Fecha de Gasto"
                type="date"
                fullWidth
                size="small"
                error={!!errors.fechaGasto}
                helperText={errors.fechaGasto?.message}
                {...register("fechaGasto")}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Monto (S/)"
                type="number"
                slotProps={{ htmlInput: { step: "0.01", min: 0.01 } }}
                fullWidth
                size="small"
                error={!!errors.monto}
                helperText={errors.monto?.message}
                {...register("monto", { valueAsNumber: true })}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.proveedorId}>
                <InputLabel id="proveedor-gasto-label">Proveedor</InputLabel>
                <Select
                  labelId="proveedor-gasto-label"
                  label="Proveedor"
                  value={provId || 0}
                  {...register("proveedorId", {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" || v === 0 ? null : Number(v)),
                  })}
                  onChange={(e) => setValue("proveedorId", e.target.value as any)}
                >
                  <MenuItem value={0}>Ninguno / Sin Proveedor</MenuItem>
                  {proveedoresData?.content.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombreRazonSocial}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.proveedorId?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nro. Comprobante Proveedor"
                fullWidth
                size="small"
                error={!!errors.numeroComprobanteProveedor}
                helperText={errors.numeroComprobanteProveedor?.message}
                {...register("numeroComprobanteProveedor")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Descripción del Gasto"
                fullWidth
                size="small"
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                {...register("descripcion")}
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

          <Box className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="small" disabled={isPending}>
              Guardar Gasto
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
