import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  Typography,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { compraSchema, type CompraFormValues } from "../schemas/compras.schemas";
import { useProveedoresList } from "../../proveedores/hooks/useProveedores";

interface CompraFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CompraFormValues) => void;
  isPending: boolean;
}

export default function CompraFormDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: CompraFormDialogProps) {
  const { data: proveedoresData } = useProveedoresList("", 0, 100);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<CompraFormValues>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      proveedorId: 0,
      fechaCompra: new Date().toISOString().substring(0, 10),
      numeroComprobanteProveedor: "",
      tipoComprobanteProveedor: "FACTURA",
      observaciones: "",
      items: [
        {
          nombreMaterial: "",
          unidadMedida: "UNIDAD",
          cantidad: 1,
          precioUnitario: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const tipoComp = watch("tipoComprobanteProveedor");
  const provId = watch("proveedorId");
  const items = watch("items") || [];

  useEffect(() => {
    if (open) {
      reset({
        proveedorId: 0,
        fechaCompra: new Date().toISOString().substring(0, 10),
        numeroComprobanteProveedor: "",
        tipoComprobanteProveedor: "FACTURA",
        observaciones: "",
        items: [
          {
            nombreMaterial: "",
            unidadMedida: "UNIDAD",
            cantidad: 1,
            precioUnitario: 0,
          },
        ],
      });
    }
  }, [open, reset]);

  const totalCompra = items.reduce((acc, curr) => {
    const qty = Number(curr.cantidad) || 0;
    const price = Number(curr.precioUnitario) || 0;
    return acc + qty * price;
  }, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Registrar Nueva Compra de Almacén</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 mt-2"
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.proveedorId}>
                <InputLabel id="proveedor-compra-label">Proveedor</InputLabel>
                <Select
                  labelId="proveedor-compra-label"
                  label="Proveedor"
                  value={provId || 0}
                  {...register("proveedorId", { valueAsNumber: true })}
                  onChange={(e) => setValue("proveedorId", e.target.value as any)}
                >
                  <MenuItem value={0}>Seleccione un proveedor</MenuItem>
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
                label="Fecha de Compra"
                type="date"
                fullWidth
                size="small"
                error={!!errors.fechaCompra}
                helperText={errors.fechaCompra?.message}
                {...register("fechaCompra")}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" error={!!errors.tipoComprobanteProveedor}>
                <InputLabel id="tipo-comprobante-label">Tipo Comprobante</InputLabel>
                <Select
                  labelId="tipo-comprobante-label"
                  label="Tipo Comprobante"
                  {...register("tipoComprobanteProveedor")}
                  value={tipoComp || "FACTURA"}
                  onChange={(e) => setValue("tipoComprobanteProveedor", e.target.value as any)}
                >
                  <MenuItem value="FACTURA">Factura</MenuItem>
                  <MenuItem value="BOLETA">Boleta</MenuItem>
                  <MenuItem value="TICKET">Ticket</MenuItem>
                  <MenuItem value="OTRO">Otro</MenuItem>
                </Select>
                <FormHelperText>{errors.tipoComprobanteProveedor?.message}</FormHelperText>
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
                label="Observaciones Generales"
                multiline
                rows={1}
                fullWidth
                size="small"
                error={!!errors.observaciones}
                helperText={errors.observaciones?.message}
                {...register("observaciones")}
              />
            </Grid>
          </Grid>

          <Divider />

          <Box className="flex justify-between items-center">
            <Typography variant="subtitle1" fontWeight={700}>Detalle de Insumos / Materiales</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() =>
                append({
                  nombreMaterial: "",
                  unidadMedida: "UNIDAD",
                  cantidad: 1,
                  precioUnitario: 0,
                })
              }
            >
              Agregar Fila
            </Button>
          </Box>

          {errors.items?.message && (
            <Alert severity="error" sx={{ py: 0.5, borderRadius: 2 }}>{errors.items.message}</Alert>
          )}

          <Box className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const itemQty = watch(`items.${index}.cantidad`) || 0;
              const itemPrice = watch(`items.${index}.precioUnitario`) || 0;
              const subtotal = itemQty * itemPrice;

              return (
                <Grid container spacing={2} key={field.id} alignItems="center">
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      label="Insumo / Material"
                      fullWidth
                      size="small"
                      error={!!errors.items?.[index]?.nombreMaterial}
                      helperText={errors.items?.[index]?.nombreMaterial?.message}
                      {...register(`items.${index}.nombreMaterial` as const)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                      label="U. Medida"
                      fullWidth
                      size="small"
                      placeholder="Millar, Resma..."
                      error={!!errors.items?.[index]?.unidadMedida}
                      helperText={errors.items?.[index]?.unidadMedida?.message}
                      {...register(`items.${index}.unidadMedida` as const)}
                    />
                  </Grid>

                  <Grid size={{ xs: 6, sm: 1.5 }}>
                    <TextField
                      label="Cant."
                      type="number"
                      fullWidth
                      size="small"
                      slotProps={{ htmlInput: { step: "any" } }}
                      error={!!errors.items?.[index]?.cantidad}
                      helperText={errors.items?.[index]?.cantidad?.message}
                      {...register(`items.${index}.cantidad` as const, { valueAsNumber: true })}
                    />
                  </Grid>

                  <Grid size={{ xs: 6, sm: 1.5 }}>
                    <TextField
                      label="P. Unitario"
                      type="number"
                      fullWidth
                      size="small"
                      slotProps={{ htmlInput: { step: "any" } }}
                      error={!!errors.items?.[index]?.precioUnitario}
                      helperText={errors.items?.[index]?.precioUnitario?.message}
                      {...register(`items.${index}.precioUnitario` as const, { valueAsNumber: true })}
                    />
                  </Grid>

                  <Grid size={{ xs: 10, sm: 1.5 }} className="text-right">
                    <Typography variant="body2" fontWeight={600} sx={{ pr: 1 }}>
                      S/ {subtotal.toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 2, sm: 0.5 }} className="text-center">
                    <IconButton
                      color="error"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      size="small"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              );
            })}
          </Box>

          <Box className="flex justify-between items-center mt-4 pt-4 border-t border-divider">
            <Typography variant="h6" fontWeight={700}>
              Total Compra: S/ {totalCompra.toFixed(2)}
            </Typography>
            <Box className="flex gap-2">
              <Button onClick={onClose} variant="outlined" color="secondary" size="small" disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" size="small" disabled={isPending}>
                Guardar Compra
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
