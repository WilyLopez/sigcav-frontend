import { Box, Card, CardActionArea, CardContent, Chip, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuthStore } from "@app/store/auth.store";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

interface AccesoCard {
  label: string;
  descripcion: string;
  path: string;
  Icon: SvgIconComponent;
  color: string;
  bg: string;
}

const ACCESOS: AccesoCard[] = [
  {
    label: "Clientes",
    descripcion: "Gestiona la ficha y el historial de clientes",
    path: "/admin/clientes",
    Icon: PersonOutlinedIcon,
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    label: "Usuarios",
    descripcion: "Administra las cuentas de acceso al sistema",
    path: "/admin/usuarios",
    Icon: PeopleOutlinedIcon,
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    label: "Roles y permisos",
    descripcion: "Configura los roles y niveles de acceso",
    path: "/admin/roles",
    Icon: AdminPanelSettingsOutlinedIcon,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    label: "Dashboard",
    descripcion: "Vista general de indicadores del negocio",
    path: "/admin/dashboard",
    Icon: DashboardOutlinedIcon,
    color: "#d97706",
    bg: "#fffbeb",
  },
];

export default function AdminWelcomePage() {
  const usuario = useAuthStore((s) => s.usuario);
  const navigate = useNavigate();

  const fecha = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box className="flex flex-col gap-8">
      <Box className="flex flex-col gap-2">
        <Box className="flex items-center gap-3 flex-wrap">
          <Typography variant="h4" fontWeight={700}>
            ¡Bienvenido, {usuario?.nombreCompleto}!
          </Typography>
          <Chip
            label="Administrador"
            size="small"
            sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 600, fontSize: 12 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
          {fecha}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Acceso rápido
        </Typography>
        <Grid container spacing={3}>
          {ACCESOS.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea sx={{ height: "100%" }} onClick={() => navigate(item.path)}>
                  <CardContent className="flex flex-col gap-3">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: item.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <item.Icon sx={{ color: item.color, fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.descripcion}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
