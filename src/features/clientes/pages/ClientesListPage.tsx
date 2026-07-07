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
  InputAdornment,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  useClientesList,
  useCreateCliente,
  useActivarCliente,
  useDesactivarCliente,
} from "../hooks/useClientes";
import ClienteForm from "../components/ClienteForm";
import type { ClienteRequest } from "../types/clientes.types";

export default function ClientesListPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/admin") ? "admin" : "asistente";

  const [termino, setTermino] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);

  const { data, isLoading } = useClientesList(termino, page, size);
  const { mutate: crearCliente, isPending: isCreating } = useCreateCliente();
  const { mutate: activar } = useActivarCliente();
  const { mutate: desactivar } = useDesactivarCliente();

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermino(e.target.value);
    setPage(0);
  };

  const handleCreate = (values: ClienteRequest) => {
    crearCliente(values, {
      onSuccess: () => {
        setOpenCreate(false);
      },
    });
  };

  const toggleEstado = (id: number, activo: boolean) => {
    if (activo) {
      desactivar(id);
    } else {
      activar(id);
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex justify-between items-center flex-wrap gap-4">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Gestión de la ficha técnica y contactos de clientes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          size="small"
        >
          Agregar Cliente
        </Button>
      </Box>

      <Card>
        <Box className="p-4 flex gap-4">
          <TextField
            placeholder="Buscar por nombre, RUC or DNI..."
            value={termino}
            onChange={handleSearchChange}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Documento</TableCell>
                <TableCell>Nombre / Razón Social</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Cargando clientes...
                  </TableCell>
                </TableRow>
              ) : !data?.content || data.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              ) : (
                data.content.map((cliente) => (
                  <TableRow key={cliente.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {cliente.tipoDocumento}: {cliente.numeroDocumento}
                      </Typography>
                    </TableCell>
                    <TableCell>{cliente.nombreRazonSocial}</TableCell>
                    <TableCell>{cliente.telefonoPrincipal}</TableCell>
                    <TableCell>{cliente.correo}</TableCell>
                    <TableCell>
                      <Chip
                        label={cliente.activo ? "Activo" : "Inactivo"}
                        size="small"
                        color={cliente.activo ? "success" : "default"}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box className="flex justify-end gap-1">
                        <Tooltip title="Ver Detalle">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/${basePath}/clientes/${cliente.id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={cliente.activo ? "Desactivar" : "Activar"}>
                          <IconButton
                            size="small"
                            color={cliente.activo ? "warning" : "success"}
                            onClick={() => toggleEstado(cliente.id, cliente.activo)}
                          >
                            {cliente.activo ? (
                              <ToggleOnIcon fontSize="small" />
                            ) : (
                              <ToggleOffIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
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

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Registrar Nuevo Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <ClienteForm
              onSubmit={handleCreate}
              onCancel={() => setOpenCreate(false)}
              isPending={isCreating}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
