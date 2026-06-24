import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useAuthStore } from "@app/store/auth.store";

export default function DashboardPage() {
  const usuario = useAuthStore((s) => s.usuario);

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Bienvenido, {usuario?.nombre}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {STATS.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent className="flex flex-col gap-1">
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                  {stat.label}
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const STATS = [
  { label: "Clientes", value: "—" },
  { label: "Usuarios", value: "—" },
  { label: "Sesiones hoy", value: "—" },
  { label: "Actividad", value: "—" },
];