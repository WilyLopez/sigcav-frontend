import { Box, Card, CardContent, Typography, Alert } from "@mui/material";

export default function RolesPage() {
  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Roles y Permisos
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Visualización y control de niveles de autorización en el sistema
        </Typography>
      </Box>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Módulo de Roles inicializado correctamente en el frontend. Listo para el desarrollo de la Fase 5.
          </Alert>
          <Typography variant="body1">
            Aquí se muestran los privilegios preconfigurados para Administradores y Asistentes Administrativos.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
