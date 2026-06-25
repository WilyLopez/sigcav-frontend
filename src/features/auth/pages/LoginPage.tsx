import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import LockResetOutlined from "@mui/icons-material/LockResetOutlined";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schemas";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => login(data);

  const errorMessage = error
    ? (error as any)?.response?.data?.mensaje ?? "Error al iniciar sesión"
    : null;

  return (
    <Box className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent className="flex flex-col gap-6 p-8">
          <Box className="flex flex-col gap-1">
            <Typography variant="h4" fontWeight={700}>
              SIGCAV
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tus credenciales para continuar
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TextField
              label="Usuario"
              fullWidth
              autoComplete="username"
              autoFocus
              error={!!errors.nombreUsuario}
              helperText={errors.nombreUsuario?.message}
              {...register("nombreUsuario")}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="current-password"
              error={!!errors.contrasena}
              helperText={errors.contrasena?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                      >
                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("contrasena")}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isPending}
              sx={{ mt: 1 }}
            >
              {isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </Box>

          <Divider />

          <Box className="text-center">
            <Button
              variant="text"
              size="small"
              startIcon={<LockResetOutlined />}
              onClick={() => setOpenForgot(true)}
              sx={{ textTransform: "none", color: "text.secondary" }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openForgot} onClose={() => setOpenForgot(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <LockResetOutlined color="primary" />
          Recuperar contraseña
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <Typography variant="body2" color="text.secondary">
            Para restablecer tu contraseña, comunícate con el administrador del sistema:
          </Typography>
          <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2 }} className="flex flex-col gap-1">
            <Typography variant="body2" fontWeight={600}>
              Administrador del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              admin@sigcav.com
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpenForgot(false)}
            sx={{ mt: 1 }}
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}