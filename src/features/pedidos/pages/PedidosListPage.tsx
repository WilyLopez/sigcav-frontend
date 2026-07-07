import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Box,
  Card,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  Tooltip,
  IconButton,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { usePedidosList } from "../hooks/usePedidos";
import { useClientesList } from "../../clientes/hooks/useClientes";
import type { EstadoPedido } from "../types/pedidos.types";

export default function PedidosListPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/admin") ? "admin" : "asistente";

  const [clienteFilter, setClienteFilter] = useState<number | "">("");
  const [estadoFilter, setEstadoFilter] = useState<EstadoPedido | "">("");
  const [desdeFilter, setDesdeFilter] = useState("");
  const [hastaFilter, setHastaFilter] = useState("");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data: clientesData } = useClientesList("", 0, 100);
  const { data, isLoading } = usePedidosList(
    clienteFilter || undefined,
    estadoFilter || undefined,
    desdeFilter || undefined,
    hastaFilter || undefined,
    page,
    size
  );

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Pedidos de Producción
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Seguimiento del estado de fabricación, plazos de entrega y costos operativos
        </Typography>
      </Box>

      <Card>
        <Box className="p-4 flex flex-wrap gap-4 items-center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="cliente-filter-label">Cliente</InputLabel>
            <Select
              labelId="cliente-filter-label"
              label="Cliente"
              value={clienteFilter}
              onChange={(e) => {
                setClienteFilter(e.target.value as any);
                setPage(0);
              }}
            >
              <MenuItem value="">Todos los clientes</MenuItem>
              {clientesData?.content.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombreRazonSocial}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="NUEVO">Nuevo</MenuItem>
              <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
              <MenuItem value="COMPLETADO">Completado</MenuItem>
              <MenuItem value="ENTREGADO">Entregado</MenuItem>
              <MenuItem value="CANCELADO">Cancelado</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Desde Ingreso"
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
            label="Hasta Ingreso"
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
                <TableCell>Nro. Pedido</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Cant.</TableCell>
                <TableCell align="right">P. Venta</TableCell>
                <TableCell>Ingreso</TableCell>
                <TableCell>Entrega</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Pago</TableCell>
                <TableCell align="right">Margen (%)</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                    Cargando pedidos...
                  </TableCell>
                </TableRow>
              ) : !data?.content || data.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                    No se encontraron pedidos
                  </TableCell>
                </TableRow>
              ) : (
                data.content.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {p.numeroPedido}
                      </Typography>
                    </TableCell>
                    <TableCell>{p.clienteNombre}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                        {p.descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>{p.cantidad}</TableCell>
                    <TableCell align="right">S/ {p.precioVenta?.toFixed(2)}</TableCell>
                    <TableCell>{new Date(p.fechaIngreso).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={p.alertaEntregaProxima && p.estado !== "ENTREGADO" && p.estado !== "CANCELADO" ? "error.main" : "text.primary"}
                        fontWeight={p.alertaEntregaProxima && p.estado !== "ENTREGADO" && p.estado !== "CANCELADO" ? 600 : 400}
                      >
                        {new Date(p.fechaEntregaComprometida).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.estado}
                        size="small"
                        color={
                          p.estado === "ENTREGADO"
                            ? "success"
                            : p.estado === "COMPLETADO"
                            ? "info"
                            : p.estado === "EN_PROCESO"
                            ? "warning"
                            : p.estado === "CANCELADO"
                            ? "error"
                            : "secondary"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.estadoPago}
                        size="small"
                        variant="outlined"
                        color={
                          p.estadoPago === "PAGADO_TOTAL"
                            ? "success"
                            : p.estadoPago === "ADELANTO_PAGADO"
                            ? "info"
                            : p.estadoPago === "CORREGIDO"
                            ? "warning"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={
                          p.semaforoColor === "VERDE"
                            ? "success.main"
                            : p.semaforoColor === "AMARILLO"
                            ? "warning.main"
                            : p.semaforoColor === "ROJO"
                            ? "error.main"
                            : "text.primary"
                        }
                      >
                        {p.margenGananciaPorcentaje != null
                          ? `${p.margenGananciaPorcentaje.toFixed(1)}%`
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver Ficha">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/${basePath}/pedidos/${p.id}`)}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
    </Box>
  );
}
