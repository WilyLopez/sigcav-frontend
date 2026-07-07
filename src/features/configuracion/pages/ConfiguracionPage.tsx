import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tab,
  Tabs,
  TextField,
  Grid,
  Alert,
  IconButton,
  CircularProgress,
  Pagination,
  Chip,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import {
  useListarParametros,
  useActualizarParametro,
  useListarLogs,
} from "../hooks/useConfiguracion";
import ParametroFormDialog from "../components/ParametroFormDialog";
import type { ParametroSistemaResponse } from "../types/configuracion.types";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState(0);

  const [desdeDate, setDesdeDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().substring(0, 10);
  });
  const [hastaDate, setHastaDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [logsPage, setLogsPage] = useState(0);

  const [selectedParam, setSelectedParam] = useState<ParametroSistemaResponse | null>(null);
  const [openParamDialog, setOpenParamDialog] = useState(false);

  const { data: parametros, isLoading: isLoadingParams } = useListarParametros();
  const { data: logsData, isLoading: isLoadingLogs, refetch: refetchLogs } = useListarLogs(
    desdeDate + "T00:00:00",
    hastaDate + "T23:59:59",
    logsPage,
    15
  );

  const { mutate: actualizarParametro, isPending: isUpdatingParam } = useActualizarParametro();

  const handleParamSubmit = (values: any) => {
    if (selectedParam) {
      actualizarParametro(
        { clave: selectedParam.clave, data: values },
        {
          onSuccess: () => {
            setOpenParamDialog(false);
            setSelectedParam(null);
          },
        }
      );
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Configuración y Auditoría
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Administración de parámetros del sistema y registro detallado de logs de auditoría
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label="Parámetros del Sistema" />
          <Tab label="Registro de Auditoría" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box className="flex flex-col gap-4">
          {isLoadingParams ? (
            <Box className="flex justify-center p-12">
              <CircularProgress />
            </Box>
          ) : !parametros || parametros.length === 0 ? (
            <Alert severity="warning">No se encontraron parámetros de configuración.</Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Clave</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Actualizado Por</TableCell>
                    <TableCell>Última Actualización</TableCell>
                    <TableCell align="center">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parametros.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{p.clave}</TableCell>
                      <TableCell>{p.descripcion}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace" }}>{p.valor}</TableCell>
                      <TableCell>{p.tipoDato}</TableCell>
                      <TableCell>{p.actualizadoPorNombre || "Sistema"}</TableCell>
                      <TableCell>{p.actualizadoEn ? new Date(p.actualizadoEn).toLocaleString() : "N/A"}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedParam(p);
                            setOpenParamDialog(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box className="flex flex-col gap-4">
          <Card className="p-4">
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Desde"
                  type="date"
                  fullWidth
                  size="small"
                  value={desdeDate}
                  onChange={(e) => setDesdeDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Hasta"
                  type="date"
                  fullWidth
                  size="small"
                  value={hastaDate}
                  onChange={(e) => setHastaDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => {
                    setLogsPage(0);
                    refetchLogs();
                  }}
                >
                  Consultar Logs
                </Button>
              </Grid>
            </Grid>
          </Card>

          {isLoadingLogs ? (
            <Box className="flex justify-center p-12">
              <CircularProgress />
            </Box>
          ) : !logsData?.content || logsData.content.length === 0 ? (
            <Alert severity="warning">No se encontraron logs de auditoría en el rango seleccionado.</Alert>
          ) : (
            <Box className="flex flex-col gap-4">
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha / Hora</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Acción</TableCell>
                      <TableCell>Entidad</TableCell>
                      <TableCell>ID Entidad</TableCell>
                      <TableCell>IP Origen</TableCell>
                      <TableCell>Detalle</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logsData.content.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>{new Date(log.creadoEn).toLocaleString()}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{log.nombreUsuario}</TableCell>
                        <TableCell>
                          <Chip label={log.accion} size="small" variant="outlined" color="primary" />
                        </TableCell>
                        <TableCell>{log.entidad}</TableCell>
                        <TableCell>{log.entidadId || "N/A"}</TableCell>
                        <TableCell>{log.ipOrigen}</TableCell>
                        <TableCell>{log.detalle}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {logsData.totalPages > 1 && (
                <Box className="flex justify-center">
                  <Pagination
                    count={logsData.totalPages}
                    page={logsPage + 1}
                    onChange={(_, val) => setLogsPage(val - 1)}
                    size="small"
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {selectedParam && openParamDialog && (
        <ParametroFormDialog
          open={openParamDialog}
          onClose={() => {
            setOpenParamDialog(false);
            setSelectedParam(null);
          }}
          onSubmit={handleParamSubmit}
          isPending={isUpdatingParam}
          parametro={selectedParam}
        />
      )}
    </Box>
  );
}
