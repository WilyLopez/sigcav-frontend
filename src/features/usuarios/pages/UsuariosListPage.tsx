import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  LockOpen as LockIcon,
  Shield as ShieldIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from "@mui/icons-material";
import {
  useListarUsuarios,
  useRegistrarUsuario,
  useActualizarUsuario,
  useCambiarContrasenaUsuario,
  useDesactivarUsuario,
  useActivarUsuario,
  useCambiarRolUsuario,
} from "../hooks/useUsuarios";
import UsuarioRegisterDialog from "../components/UsuarioRegisterDialog";
import UsuarioEditDialog from "../components/UsuarioEditDialog";
import UsuarioPasswordDialog from "../components/UsuarioPasswordDialog";
import UsuarioRolDialog from "../components/UsuarioRolDialog";
import type { UsuarioResponse } from "../types/usuarios.types";

export default function UsuariosListPage() {
  const [openRegister, setOpenRegister] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openRol, setOpenRol] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UsuarioResponse | null>(null);

  const { data: usuarios, isLoading } = useListarUsuarios();

  const { mutate: registrar, isPending: isRegistering } = useRegistrarUsuario();
  const { mutate: actualizar, isPending: isUpdating } = useActualizarUsuario();
  const { mutate: cambiarContrasena, isPending: isChangingPassword } = useCambiarContrasenaUsuario();
  const { mutate: desactivar } = useDesactivarUsuario();
  const { mutate: activar } = useActivarUsuario();
  const { mutate: cambiarRol, isPending: isChangingRol } = useCambiarRolUsuario();

  const handleRegisterSubmit = (values: any) => {
    registrar(values, {
      onSuccess: () => setOpenRegister(false),
    });
  };

  const handleEditSubmit = (values: any) => {
    if (selectedUser) {
      actualizar(
        { id: selectedUser.id, data: values },
        {
          onSuccess: () => {
            setOpenEdit(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handlePasswordSubmit = (values: any) => {
    if (selectedUser) {
      cambiarContrasena(
        { id: selectedUser.id, data: values },
        {
          onSuccess: () => {
            setOpenPassword(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleRolSubmit = (values: any) => {
    if (selectedUser) {
      cambiarRol(
        { id: selectedUser.id, data: values },
        {
          onSuccess: () => {
            setOpenRol(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleToggleActivo = (user: UsuarioResponse) => {
    if (user.activo) {
      desactivar(user.id);
    } else {
      activar(user.id);
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex justify-between items-center flex-wrap gap-4">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Administración de cuentas, control de accesos, roles y restablecimiento de credenciales
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setOpenRegister(true)}
        >
          Registrar Usuario
        </Button>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center p-12">
          <CircularProgress />
        </Box>
      ) : !usuarios || usuarios.length === 0 ? (
        <Alert severity="warning">No se encontraron usuarios registrados en el sistema.</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Rol de Acceso</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{u.nombreCompleto}</TableCell>
                  <TableCell>{u.nombreUsuario}</TableCell>
                  <TableCell>{u.correo}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.rol === "ADMINISTRADOR" ? "Administrador" : "Asistente"}
                      color={u.rol === "ADMINISTRADOR" ? "primary" : "secondary"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.activo ? "Activo" : "Inactivo"}
                      color={u.activo ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex justify-center gap-1">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedUser(u);
                          setOpenEdit(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => {
                          setSelectedUser(u);
                          setOpenRol(true);
                        }}
                      >
                        <ShieldIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => {
                          setSelectedUser(u);
                          setOpenPassword(true);
                        }}
                      >
                        <LockIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={u.activo ? "error" : "success"}
                        onClick={() => handleToggleActivo(u)}
                      >
                        {u.activo ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {openRegister && (
        <UsuarioRegisterDialog
          open={openRegister}
          onClose={() => setOpenRegister(false)}
          onSubmit={handleRegisterSubmit}
          isPending={isRegistering}
        />
      )}

      {selectedUser && openEdit && (
        <UsuarioEditDialog
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditSubmit}
          isPending={isUpdating}
          initialData={selectedUser}
        />
      )}

      {selectedUser && openPassword && (
        <UsuarioPasswordDialog
          open={openPassword}
          onClose={() => {
            setOpenPassword(false);
            setSelectedUser(null);
          }}
          onSubmit={handlePasswordSubmit}
          isPending={isChangingPassword}
        />
      )}

      {selectedUser && openRol && (
        <UsuarioRolDialog
          open={openRol}
          onClose={() => {
            setOpenRol(false);
            setSelectedUser(null);
          }}
          onSubmit={handleRolSubmit}
          isPending={isChangingRol}
          initialRol={selectedUser.rol}
        />
      )}
    </Box>
  );
}
