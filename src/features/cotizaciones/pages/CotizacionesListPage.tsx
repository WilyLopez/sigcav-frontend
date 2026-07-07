import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  Paper,
  Chip,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  useCotizacionesList,
  useDuplicarCotizacion,
  useReactivarCotizacion,
  useConvertirCotizacion,
  useCambiarEstadoCotizacion,
} from "../hooks/useCotizaciones";
import type { EstadoCotizacion } from "../types/cotizaciones.types";

export default function CotizacionesListPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/admin") ? "admin" : "asistente";

  const [estadoFilter, setEstadoFilter] = useState<EstadoCotizacion | "">("");
  const [desdeFilter, setDesdeFilter] = useState("");
  const [hastaFilter, setHastaFilter] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [reactivarId, setReactivarId] = useState<number | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState("");

  const { data, isLoading } = useCotizacionesList(
    undefined,
    estadoFilter,
    desdeFilter || undefined,
    hastaFilter || undefined,
    page,
    size
  );

  const { mutate: duplicar } = useDuplicarCotizacion();
  const { mutate: reactivar } = useReactivarCotizacion();
  const { mutate: convertir } = useConvertirCotizacion();
  const { mutate: cambiarEstado } = useCambiarEstadoCotizacion();

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReactivarSubmit = () => {
    if (reactivarId && nuevaFecha) {
      reactivar(
        { id: reactivarId, nuevaFechaVencimiento: nuevaFecha },
        {
          onSuccess: () => {
            setReactivarId(null);
            setNuevaFecha("");
          },
        }
      );
    }
  };

  const handleDuplicar = (id: number) => {
    duplicar(id);
  };

  const handleConvertir = (id: number) => {
    convertir(id, {
      onSuccess: () => {
        navigate(`/${basePath}/pedidos`);
      },
    });
  };

  const handleCambiarEstado = (id: number, nuevoEstado: EstadoCotizacion) => {
    cambiarEstado({ id, data: { nuevoEstado } });
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex justify-between items-center flex-wrap gap-4">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Cotizaciones
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Gestión y seguimiento de presupuestos de impresión
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/${basePath}/cotizaciones/crear`)}
          size="small"
        >
          Nueva Cotización
        </Button>
      </Box>

      <Card>
        <Box className="p-4 flex flex-wrap gap-4 items-center">
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="estado-filter-label">Estado</InputLabel>
            <Select
              labelId="estado-filter-label"
              label="Estado"
              value={estadoFilter}
              onChange={(e) => {
                setEstadoFilter(e.target.value as any);
                setPage(0);
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="BORRADOR">Borrador</MenuItem>
              <MenuItem value="ENVIADA">Enviada</MenuItem>
              <MenuItem value="APROBADA">Aprobada</MenuItem>
              <MenuItem value="RECHAZADA">Rechazada</MenuItem>
              <MenuItem value="VENCIDA">Vencida</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Desde"
            type="date"
            size="small"
            value={desdeFilter}
            onChange={(e) => {
              setDesdeFilter(e.target.value);
              setPage(0);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Hasta"
            type="date"
            size="small"
            value={hastaFilter}
            onChange={(e) => {
              setHastaFilter(e.target.value);
              setPage(0);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nro. Cotización</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha Emisión</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    Cargando cotizaciones...
                  </TableCell>
                </TableRow>
              ) : !data?.content || data.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No se encontraron cotizaciones
                  </TableCell>
                </TableRow>
              ) : (
                data.content.map((cot) => (
                  <TableRow key={cot.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {cot.numeroCotizacion}
                      </Typography>
                    </TableCell>
                    <TableCell>{cot.clienteNombre}</TableCell>
                    <TableCell>{new Date(cot.fechaEmision).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={cot.alertaVencimientoProximo && cot.estado === "ENVIADA" ? "error.main" : "text.primary"}
                        fontWeight={cot.alertaVencimientoProximo && cot.estado === "ENVIADA" ? 600 : 400}
                      >
                        {new Date(cot.fechaVencimiento).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{cot.cantidad}</TableCell>
                    <TableCell>S/ {cot.total?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={cot.estado}
                        size="small"
                        color={
                          cot.estado === "APROBADA"
                            ? "success"
                            : cot.estado === "ENVIADA"
                            ? "info"
                            : cot.estado === "VENCIDA"
                            ? "error"
                            : cot.estado === "RECHAZADA"
                            ? "default"
                            : "secondary"
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box className="flex justify-end gap-1">
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/${basePath}/cotizaciones/${cot.id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {cot.estado === "BORRADOR" && (
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/${basePath}/cotizaciones/${cot.id}/editar`)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Duplicar">
                          <IconButton
                            size="small"
                            onClick={() => handleDuplicar(cot.id)}
                          >
                            <ContentCopyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {cot.estado === "VENCIDA" && (
                          <Tooltip title="Reactivar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setReactivarId(cot.id)}
                            >
                              <AutorenewOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {cot.estado === "APROBADA" && !cot.convertidaEnPedido && (
                          <Tooltip title="Convertir a Pedido">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleConvertir(cot.id)}
                            >
                              <ShoppingBagOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {cot.estado === "ENVIADA" && (
                          <Box className="flex gap-1">
                            <Button
                              variant="text"
                              size="small"
                              color="success"
                              onClick={() => handleCambiarEstado(cot.id, "APROBADA")}
                              sx={{ fontSize: 11, py: 0, px: 1 }}
                            >
                              Aprobar
                            </Button>
                            <Button
                              variant="text"
                              size="small"
                              color="error"
                              onClick={() => handleCambiarEstado(cot.id, "RECHAZADA")}
                              sx={{ fontSize: 11, py: 0, px: 1 }}
                            >
                              Rechazar
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {data && (
          <TablePagination
            component="div"
            count={data.totalElements}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={size}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="Filas por página:"
          />
        )}
      </Card>

      <Dialog open={reactivarId !== null} onClose={() => setReactivarId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Reactivar Cotización</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-4 mt-2">
            <Typography variant="body2" color="text.secondary">
              Selecciona una nueva fecha de vencimiento para reactivar esta cotización:
            </Typography>
            <TextField
              label="Nueva Fecha"
              type="date"
              fullWidth
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Box className="flex justify-end gap-2">
              <Button onClick={() => setReactivarId(null)} variant="outlined" color="secondary" size="small">
                Cancelar
              </Button>
              <Button onClick={handleReactivarSubmit} variant="contained" size="small" disabled={!nuevaFecha}>
                Reactivar
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
