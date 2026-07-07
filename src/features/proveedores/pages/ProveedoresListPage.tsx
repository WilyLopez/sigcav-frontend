import { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import {
  useProveedoresList,
  useCreateProveedor,
  useUpdateProveedor,
  useActivarProveedor,
  useDesactivarProveedor,
  useCategoriasTodasList,
  useCreateCategoria,
  useUpdateCategoria,
  useActivarCategoria,
  useDesactivarCategoria,
} from "../hooks/useProveedores";
import ProveedorForm from "../components/ProveedorForm";
import CategoriaProveedorForm from "../components/CategoriaProveedorForm";
import type { ProveedorDetalle, CategoriaProveedor } from "../types/proveedores.types";
import type { ProveedorFormValues, CategoriaProveedorFormValues } from "../schemas/proveedores.schemas";

export default function ProveedoresListPage() {
  const [termino, setTermino] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<ProveedorDetalle | undefined>(undefined);

  const [openCategorias, setOpenCategorias] = useState(false);
  const [openCreateCat, setOpenCreateCat] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoriaProveedor | undefined>(undefined);

  const { data, isLoading } = useProveedoresList(termino, page, size);
  const { data: categorias, isLoading: isLoadingCats } = useCategoriasTodasList();

  const { mutate: crearProveedor, isPending: isCreating } = useCreateProveedor();
  const { mutate: actualizarProveedor, isPending: isUpdating } = useUpdateProveedor();
  const { mutate: activarProveedor } = useActivarProveedor();
  const { mutate: desactivarProveedor } = useDesactivarProveedor();

  const { mutate: crearCat, isPending: isCreatingCat } = useCreateCategoria();
  const { mutate: actualizarCat, isPending: isUpdatingCat } = useUpdateCategoria();
  const { mutate: activarCat } = useActivarCategoria();
  const { mutate: desactivarCat } = useDesactivarCategoria();

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

  const handleCreateOrUpdate = (values: ProveedorFormValues) => {
    if (editingProveedor) {
      actualizarProveedor(
        { id: editingProveedor.id, data: values },
        {
          onSuccess: () => {
            setOpenCreate(false);
            setEditingProveedor(undefined);
          },
        }
      );
    } else {
      crearProveedor(values, {
        onSuccess: () => {
          setOpenCreate(false);
        },
      });
    }
  };

  const toggleProveedorEstado = (id: number, activo: boolean) => {
    if (activo) {
      desactivarProveedor(id);
    } else {
      activarProveedor(id);
    }
  };

  const handleCreateOrUpdateCat = (values: CategoriaProveedorFormValues) => {
    if (editingCat) {
      actualizarCat(
        { id: editingCat.id, data: values },
        {
          onSuccess: () => {
            setOpenCreateCat(false);
            setEditingCat(undefined);
          },
        }
      );
    } else {
      crearCat(values, {
        onSuccess: () => {
          setOpenCreateCat(false);
        },
      });
    }
  };

  const toggleCatEstado = (id: number, activo: boolean) => {
    if (activo) {
      desactivarCat(id);
    } else {
      activarCat(id);
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex justify-between items-center flex-wrap gap-4">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Proveedores
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Gestión de proveedores de insumos, servicios y sus categorías correspondientes
          </Typography>
        </Box>
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CategoryOutlinedIcon />}
            onClick={() => setOpenCategorias(true)}
            size="small"
          >
            Gestionar Categorías
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingProveedor(undefined);
              setOpenCreate(true);
            }}
            size="small"
          >
            Agregar Proveedor
          </Button>
        </Box>
      </Box>

      <Card>
        <Box className="p-4 flex gap-4">
          <TextField
            placeholder="Buscar por nombre, RUC or DNI..."
            value={termino}
            onChange={handleSearchChange}
            size="small"
            fullWidth
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Documento</TableCell>
                <TableCell>Nombre / Razón Social</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Cargando proveedores...
                  </TableCell>
                </TableRow>
              ) : !data?.content || data.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No se encontraron proveedores
                  </TableCell>
                </TableRow>
              ) : (
                data.content.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {p.tipoDocumento}: {p.numeroDocumento}
                      </Typography>
                    </TableCell>
                    <TableCell>{p.nombreRazonSocial}</TableCell>
                    <TableCell>{p.categoriaNombre}</TableCell>
                    <TableCell>{p.telefono}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.activo ? "Activo" : "Inactivo"}
                        size="small"
                        color={p.activo ? "success" : "default"}
                        variant={p.activo ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box className="flex justify-end gap-1">
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingProveedor({
                                id: p.id,
                                tipoDocumento: p.tipoDocumento,
                                numeroDocumento: p.numeroDocumento,
                                nombreRazonSocial: p.nombreRazonSocial,
                                categoriaProveedorId: 0,
                                categoriaNombre: p.categoriaNombre,
                                telefono: p.telefono,
                                activo: p.activo,
                                creadoEn: "",
                                actualizadoEn: "",
                              });
                              setOpenCreate(true);
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={p.activo ? "Desactivar" : "Activar"}>
                          <IconButton
                            size="small"
                            color={p.activo ? "warning" : "success"}
                            onClick={() => toggleProveedorEstado(p.id, p.activo)}
                          >
                            {p.activo ? (
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
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingProveedor ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <ProveedorForm
              onSubmit={handleCreateOrUpdate}
              onCancel={() => setOpenCreate(false)}
              isPending={isCreating || isUpdating}
              initialData={editingProveedor}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openCategorias} onClose={() => setOpenCategorias(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
          <Box className="flex justify-between items-center w-full">
            <Typography variant="h6" fontWeight={700}>
              Categorías de Proveedores
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingCat(undefined);
                setOpenCreateCat(true);
              }}
            >
              Nueva Categoría
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 1, borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingCats ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Cargando categorías...
                    </TableCell>
                  </TableRow>
                ) : !categorias || categorias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No hay categorías registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  categorias.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.nombre}</TableCell>
                      <TableCell>
                        <Chip
                          label={cat.activo ? "Activo" : "Inactivo"}
                          size="small"
                          color={cat.activo ? "success" : "default"}
                          variant={cat.activo ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box className="flex justify-end gap-1">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingCat(cat);
                              setOpenCreateCat(true);
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color={cat.activo ? "warning" : "success"}
                            onClick={() => toggleCatEstado(cat.id, cat.activo)}
                          >
                            {cat.activo ? (
                              <ToggleOnIcon fontSize="small" />
                            ) : (
                              <ToggleOffIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Dialog open={openCreateCat} onClose={() => setOpenCreateCat(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingCat ? "Editar Categoría" : "Nueva Categoría"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <CategoriaProveedorForm
              onSubmit={handleCreateOrUpdateCat}
              onCancel={() => setOpenCreateCat(false)}
              isPending={isCreatingCat || isUpdatingCat}
              initialData={editingCat}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
