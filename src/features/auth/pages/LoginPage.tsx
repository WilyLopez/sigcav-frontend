import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schemas";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

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
              type="password"
              fullWidth
              autoComplete="current-password"
              error={!!errors.contrasena}
              helperText={errors.contrasena?.message}
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
        </CardContent>
      </Card>
    </Box>
  );
}