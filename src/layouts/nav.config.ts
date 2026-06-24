import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export interface NavItem {
  label: string;
  path: string;
  Icon: SvgIconComponent;
  roles: string[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: "dashboard",
    Icon: DashboardOutlinedIcon,
    roles: ["ADMIN", "ASISTENTE"],
  },
  {
    label: "Clientes",
    path: "clientes",
    Icon: PersonOutlinedIcon,
    roles: ["ADMIN", "ASISTENTE"],
  },
  {
    label: "Usuarios",
    path: "usuarios",
    Icon: PeopleOutlinedIcon,
    roles: ["ADMIN"],
  },
  {
    label: "Roles",
    path: "roles",
    Icon: AdminPanelSettingsOutlinedIcon,
    roles: ["ADMIN"],
  },
];