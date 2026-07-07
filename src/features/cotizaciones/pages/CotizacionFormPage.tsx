import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useClientesList } from "../../clientes/hooks/useClientes";
import {
  useCreateCotizacion,
  useUpdateCotizacion,
  useCotizacionDetail,
} from "../hooks/useCotizaciones";
import { cotizacionSchema, type CotizacionFormValues } from "../schemas/cotizaciones.schemas";

export default function CotizacionFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/admin") ? "admin" : "asistente";
  const isEdit = !!id;
  const cotizacionId = Number(id);

  const { data: clientsData } = useClientesList("", 0, 100);
  const { data: cotizacion, isLoading: isLoadingCotizacion } = useCotizacionDetail(cotizacionId);

  const { mutate: crear, isPending: isCreating } = useCreateCotizacion();
  const { mutate: actualizar, isPending: isUpdating } = useUpdateCotizacion();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CotizacionFormValues>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      clienteId: 0,
      fechaVencimiento: "",
      descripcionProducto: "",
      tipoImpresion: "",
      material: "",
      dimensiones: "",
      acabados: "",
      cantidad: 1,
      precioUnitario: 0.01,
      descuentoPorcentaje: 0,
      recargoPorcentaje: 0,
      aplicaIgv: false,
      tiempoEntregaEstimado: "",
      condicionesPago: "",
      observaciones: "",
    },
  });

  useEffect(() => {
    if (isEdit && cotizacion) {
      setValue("clienteId", cotizacion.clienteId);
      setValue("fechaVencimiento", cotizacion.fechaVencimiento);
      setValue("descripcionProducto", cotizacion.descripcionProducto);
      setValue("tipoImpresion", cotizacion.tipoImpresion || "");
      setValue("material", cotizacion.material || "");
      setValue("dimensiones", cotizacion.dimensiones || "");
      setValue("acabados", cotizacion.acabados || "");
      setValue("cantidad", cotizacion.cantidad);
      setValue("precioUnitario", Number(cotizacion.precioUnitario));
      setValue("descuentoPorcentaje", Number(cotizacion.descuentoPorcentaje));
      setValue("recargoPorcentaje", Number(cotizacion.recargoPorcentaje));
      setValue("aplicaIgv", cotizacion.aplicaIgv);
      setValue("tiempoEntregaEstimado", cotizacion.tiempoEntregaEstimado || "");
      setValue("condicionesPago", cotizacion.condicionesPago || "");
      setValue("observaciones", cotizacion.observaciones || "");
    }
  }, [isEdit, cotizacion, setValue]);

  const cantidad = watch("cantidad") || 0;
  const precioUnitario = watch("precioUnitario") || 0;
  const descuentoPorcentaje = watch("descuentoPorcentaje") || 0;
  const recargoPorcentaje = watch("recargoPorcentaje") || 0;
  const aplicaIgv = watch("aplicaIgv") || false;

  const subtotal = cantidad * precioUnitario;
  const descuento = subtotal * (descuentoPorcentaje / 100);
  const recargo = subtotal * (recargoPorcentaje / 100);
  const baseCalculo = subtotal - descuento + recargo;
  const igv = aplicaIgv ? baseCalculo * 0.18 : 0;
  const total = baseCalculo + igv;

  const handleFormSubmit = (values: CotizacionFormValues) => {
    if (isEdit) {
      actualizar(
        { id: cotizacionId, data: values as any },
        {
          onSuccess: () => {
            navigate(`/${basePath}/cotizaciones`);
          },
        }
      );
    } else {
      crear(values as any, {
        onSuccess: () => {
          navigate(`/${basePath}/cotizaciones`);
        },
      });
    }
  };

  if (isEdit && isLoadingCotizacion) {
    return <Typography sx={{ p: 4 }}>Cargando cotización...</Typography>;
  }

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex items-center gap-3">
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          size="small"
        >
          Volver
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {isEdit ? "Editar Cotización" : "Nueva Cotización"}
        </Typography>
      </Box>

      {isEdit && cotizacion?.estado !== "BORRADOR" && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Solo se pueden editar cotizaciones que estén en estado BORRADOR.
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-6"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <Typography variant="h6" fontWeight={700} mb={1}>
                  Datos Generales
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small" error={!!errors.clienteId}>
                      <InputLabel id="cliente-select-label">Cliente</InputLabel>
                      <Select
                        labelId="cliente-select-label"
                        label="Cliente"
                        defaultValue={0}
                        {...register("clienteId", { valueAsNumber: true })}
                      >
                        <MenuItem value={0}>Selecciona un cliente</MenuItem>
                        {clientsData?.content.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.nombreRazonSocial}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.clienteId?.message}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Fecha de Vencimiento"
                      type="date"
                      fullWidth
                      error={!!errors.fechaVencimiento}
                      helperText={errors.fechaVencimiento?.message}
                      {...register("fechaVencimiento")}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Descripción del Producto"
                      multiline
                      rows={2}
                      fullWidth
                      error={!!errors.descripcionProducto}
                      helperText={errors.descripcionProducto?.message}
                      {...register("descripcionProducto")}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" fontWeight={700} mt={2} mb={1}>
                  Especificaciones Técnicas
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Tipo de Impresión"
                      placeholder="Offset, Digital, Serigrafía..."
                      fullWidth
                      error={!!errors.tipoImpresion}
                      helperText={errors.tipoImpresion?.message}
                      {...register("tipoImpresion")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Material / Sustrato"
                      placeholder="Papel Couché 300g, Lona, Vinil..."
                      fullWidth
                      error={!!errors.material}
                      helperText={errors.material?.message}
                      {...register("material")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Dimensiones"
                      placeholder="A4, 10x15cm, 2x1m..."
                      fullWidth
                      error={!!errors.dimensiones}
                      helperText={errors.dimensiones?.message}
                      {...register("dimensiones")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Acabados / Post-prensa"
                      placeholder="Plastificado Mate, Barniz UV, Troquelado..."
                      fullWidth
                      error={!!errors.acabados}
                      helperText={errors.acabados?.message}
                      {...register("acabados")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Tiempo de Entrega Estimado"
                      placeholder="3 días hábiles, inmediato..."
                      fullWidth
                      error={!!errors.tiempoEntregaEstimado}
                      helperText={errors.tiempoEntregaEstimado?.message}
                      {...register("tiempoEntregaEstimado")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Condiciones de Pago"
                      placeholder="50% adelanto, saldo contra entrega..."
                      fullWidth
                      error={!!errors.condicionesPago}
                      helperText={errors.condicionesPago?.message}
                      {...register("condicionesPago")}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Observaciones Comerciales"
                      multiline
                      rows={2}
                      fullWidth
                      error={!!errors.observaciones}
                      helperText={errors.observaciones?.message}
                      {...register("observaciones")}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="flex flex-col gap-6 sticky top-20">
              <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    Cálculo de Precios
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Cantidad"
                        type="number"
                        fullWidth
                        error={!!errors.cantidad}
                        helperText={errors.cantidad?.message}
                        {...register("cantidad", { valueAsNumber: true })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Precio Unitario"
                        type="number"
                        slotProps={{ htmlInput: { step: "0.01" } }}
                        fullWidth
                        error={!!errors.precioUnitario}
                        helperText={errors.precioUnitario?.message}
                        {...register("precioUnitario", { valueAsNumber: true })}
                      />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Descuento (%)"
                        type="number"
                        slotProps={{ htmlInput: { min: 0, max: 100 } }}
                        fullWidth
                        error={!!errors.descuentoPorcentaje}
                        helperText={errors.descuentoPorcentaje?.message}
                        {...register("descuentoPorcentaje", { valueAsNumber: true })}
                      />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Recargo (%)"
                        type="number"
                        slotProps={{ htmlInput: { min: 0 } }}
                        fullWidth
                        error={!!errors.recargoPorcentaje}
                        helperText={errors.recargoPorcentaje?.message}
                        {...register("recargoPorcentaje", { valueAsNumber: true })}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={aplicaIgv}
                            onChange={(e) => setValue("aplicaIgv", e.target.checked)}
                          />
                        }
                        label="Aplicar IGV (18%)"
                      />
                    </Grid>
                  </Grid>

                  <Box className="flex flex-col gap-2 mt-4 pt-4 border-t border-divider">
                    <Box className="flex justify-between">
                      <Typography variant="body2" color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        S/ {subtotal.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box className="flex justify-between">
                      <Typography variant="body2" color="text.secondary">
                        Descuento
                      </Typography>
                      <Typography variant="body2" color="error.main" fontWeight={600}>
                        - S/ {descuento.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box className="flex justify-between">
                      <Typography variant="body2" color="text.secondary">
                        Recargo
                      </Typography>
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        + S/ {recargo.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box className="flex justify-between">
                      <Typography variant="body2" color="text.secondary">
                        IGV (18%)
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        S/ {igv.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box className="flex justify-between mt-2 pt-2 border-t border-divider">
                      <Typography variant="subtitle1" fontWeight={700}>
                        Total
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                        S/ {total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={(isEdit && cotizacion?.estado !== "BORRADOR") || isCreating || isUpdating}
                    sx={{ mt: 2 }}
                  >
                    {isCreating || isUpdating ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Guardar Cotización"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
