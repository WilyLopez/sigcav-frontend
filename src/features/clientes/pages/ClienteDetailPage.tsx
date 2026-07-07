import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  Chip,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  useClienteFicha,
  useUpdateCliente,
  useCreateContacto,
  useUpdateContacto,
  useDeleteContacto,
} from "../hooks/useClientes";
import ClienteForm from "../components/ClienteForm";
import ContactoForm from "../components/ContactoForm";
import type { ClienteRequest, ContactoClienteRequest } from "../types/clientes.types";

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clienteId = Number(id);

  const [activeTab, setActiveTab] = useState(0);
  const [openEditClient, setOpenEditClient] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const { data: ficha, isLoading, error } = useClienteFicha(clienteId);

  const { mutate: actualizarCliente, isPending: isUpdating } = useUpdateCliente();
  const { mutate: crearContacto, isPending: isCreatingContact } = useCreateContacto(clienteId);
  const { mutate: actualizarContacto, isPending: isUpdatingContact } = useUpdateContacto(clienteId);
  const { mutate: eliminarContacto } = useDeleteContacto(clienteId);

  if (isLoading) {
    return <Typography sx={{ p: 4 }}>Cargando ficha del cliente...</Typography>;
  }

  if (error || !ficha) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          No se pudo cargar la ficha del cliente o el cliente no existe.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

  const handleEditClient = (values: ClienteRequest) => {
    actualizarCliente(
      { id: clienteId, data: values },
      {
        onSuccess: () => {
          setOpenEditClient(false);
        },
      }
    );
  };

  const handleContactSubmit = (values: ContactoClienteRequest) => {
    if (selectedContact) {
      actualizarContacto(
        { contactoId: selectedContact.id, data: values },
        {
          onSuccess: () => {
            setOpenContact(false);
            setSelectedContact(null);
          },
        }
      );
    } else {
      crearContacto(values, {
        onSuccess: () => {
          setOpenContact(false);
        },
      });
    }
  };

  const handleDeleteContact = (contactoId: number) => {
    eliminarContacto(contactoId);
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex items-center gap-3">
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Ficha del Cliente
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent className="flex flex-col gap-6 p-6">
              <Box className="flex justify-between items-start flex-wrap gap-2">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {ficha.nombreRazonSocial}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {ficha.tipoDocumento}: {ficha.numeroDocumento}
                  </Typography>
                </Box>
                <Box className="flex gap-2">
                  <Chip
                    label={ficha.activo ? "Activo" : "Inactivo"}
                    color={ficha.activo ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    onClick={() => setOpenEditClient(true)}
                  >
                    Editar
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                    Teléfono Principal
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ficha.telefonoPrincipal}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                    Teléfono Secundario
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ficha.telefonoSecundario || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ficha.correo}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                    Contacto de Referencia
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ficha.nombreContactoRef || "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                    Dirección de Entrega
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {ficha.direccionEntrega}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                    Observaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ficha.observaciones || "Sin observaciones adicionales."}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent className="flex flex-col gap-4 p-6 flex-1">
              <Typography variant="h6" fontWeight={700}>
                Indicadores Financieros
              </Typography>

              <Box className="flex flex-col gap-1 p-4 rounded-xl" sx={{ bgcolor: "primary.light" }}>
                <Typography variant="caption" color="primary.main" fontWeight={600} textTransform="uppercase">
                  Ventas Acumuladas
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight={800}>
                  S/ {ficha.montoAcumuladoVentas?.toFixed(2) || "0.00"}
                </Typography>
              </Box>

              <Box className="flex justify-between items-center py-2 border-b border-divider">
                <Typography variant="body2" color="text.secondary">
                  Cotizaciones Emitidas
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {ficha.cotizaciones?.length || 0}
                </Typography>
              </Box>

              <Box className="flex justify-between items-center py-2 border-b border-divider">
                <Typography variant="body2" color="text.secondary">
                  Pedidos Registrados
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {ficha.pedidos?.length || 0}
                </Typography>
              </Box>

              <Box className="flex justify-between items-center py-2">
                <Typography variant="body2" color="text.secondary">
                  Comprobantes Emitidos
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {ficha.comprobantes?.length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              <Box className="flex justify-between items-center flex-wrap gap-2">
                <Typography variant="h6" fontWeight={700}>
                  Contactos Adicionales
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedContact(null);
                    setOpenContact(true);
                  }}
                >
                  Agregar Contacto
                </Button>
              </Box>

              {ficha.contactos?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  Este cliente no tiene contactos adicionales registrados.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {ficha.contactos.map((contacto) => (
                    <Grid key={contacto.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent className="flex flex-col gap-2 p-4">
                          <Box className="flex justify-between items-start">
                            <Box className="flex items-center gap-1">
                              {contacto.esPrincipal ? (
                                <StarIcon color="warning" fontSize="small" />
                              ) : (
                                <StarBorderIcon color="action" fontSize="small" />
                              )}
                              <Typography variant="subtitle2" fontWeight={700}>
                                {contacto.nombre}
                              </Typography>
                            </Box>
                            <Box className="flex gap-0.5">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedContact(contacto);
                                  setOpenContact(true);
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteContact(contacto.id)}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Cargo: {contacto.cargo || "—"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Teléfono: {contacto.telefono || "—"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Correo: {contacto.correo || "—"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                <Tab label="Cotizaciones" sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }} />
                <Tab label="Pedidos" sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }} />
                <Tab label="Comprobantes" sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }} />
              </Tabs>
            </Box>

            <Box className="p-4">
              {activeTab === 0 && (
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nro. Cotización</TableCell>
                        <TableCell>Fecha Emisión</TableCell>
                        <TableCell>Vencimiento</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ficha.cotizaciones?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                            No hay cotizaciones para este cliente
                          </TableCell>
                        </TableRow>
                      ) : (
                        ficha.cotizaciones.map((cot: any) => (
                          <TableRow key={cot.id} hover>
                            <TableCell>{cot.numeroCotizacion}</TableCell>
                            <TableCell>{new Date(cot.fechaEmision).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(cot.fechaVencimiento).toLocaleDateString()}</TableCell>
                            <TableCell>{cot.cantidad}</TableCell>
                            <TableCell>S/ {cot.total?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip
                                label={cot.estado}
                                size="small"
                                color={
                                  cot.estado === "APROBADA"
                                    ? "success"
                                    : cot.estado === "BORRADOR"
                                    ? "default"
                                    : "error"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 1 && (
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nro. Pedido</TableCell>
                        <TableCell>Fecha Ingreso</TableCell>
                        <TableCell>Entrega Prometida</TableCell>
                        <TableCell>Total Venta</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Pago</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ficha.pedidos?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                            No hay pedidos para este cliente
                          </TableCell>
                        </TableRow>
                      ) : (
                        ficha.pedidos.map((ped: any) => (
                          <TableRow key={ped.id} hover>
                            <TableCell>{ped.numeroPedido}</TableCell>
                            <TableCell>{new Date(ped.fechaIngreso).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(ped.fechaEntregaComprometida).toLocaleDateString()}</TableCell>
                            <TableCell>S/ {ped.precioVenta?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip label={ped.estado} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={ped.estadoPago}
                                size="small"
                                color={
                                  ped.estadoPago === "PAGADO_COMPLETAMENTE"
                                    ? "success"
                                    : ped.estadoPago === "ADELANTO_REGISTRADO"
                                    ? "info"
                                    : "warning"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 2 && (
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Comprobante</TableCell>
                        <TableCell>Fecha Emisión</TableCell>
                        <TableCell>Método Pago</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ficha.comprobantes?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                            No hay comprobantes para este cliente
                          </TableCell>
                        </TableRow>
                      ) : (
                        ficha.comprobantes.map((comp: any) => (
                          <TableRow key={comp.id} hover>
                            <TableCell>{comp.numeroCompleto}</TableCell>
                            <TableCell>{new Date(comp.fechaEmision).toLocaleDateString()}</TableCell>
                            <TableCell>{comp.formaPago}</TableCell>
                            <TableCell>S/ {comp.total?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip
                                label={comp.anulado ? "Anulado" : "Válido"}
                                color={comp.anulado ? "error" : "success"}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openEditClient} onClose={() => setOpenEditClient(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Editar Cliente</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <ClienteForm
              initialValues={ficha}
              onSubmit={handleEditClient}
              onCancel={() => setOpenEditClient(false)}
              isPending={isUpdating}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openContact} onClose={() => setOpenContact(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedContact ? "Editar Contacto" : "Agregar Nuevo Contacto"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <ContactoForm
              initialValues={selectedContact}
              onSubmit={handleContactSubmit}
              onCancel={() => {
                setOpenContact(false);
                setSelectedContact(null);
              }}
              isPending={selectedContact ? isUpdatingContact : isCreatingContact}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
