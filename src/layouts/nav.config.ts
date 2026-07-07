import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
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
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Clientes",
    path: "clientes",
    Icon: PersonOutlinedIcon,
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Cotizaciones",
    path: "cotizaciones",
    Icon: RequestQuoteOutlinedIcon,
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Proveedores",
    path: "proveedores",
    Icon: StorefrontOutlinedIcon,
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Pedidos",
    path: "pedidos",
    Icon: AssignmentOutlinedIcon,
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Compras",
    path: "compras",
    Icon: ShoppingCartOutlinedIcon,
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Pagos",
    path: "pagos",
    Icon: PaymentsOutlinedIcon,
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Comprobantes",
    path: "comprobantes",
    Icon: ReceiptOutlinedIcon,
    roles: ["ADMINISTRADOR", "ASISTENTE_ADMINISTRATIVO"],
  },
  {
    label: "Reportes",
    path: "reportes",
    Icon: BarChartOutlinedIcon,
    roles: ["ADMINISTRADOR"],
  },
  {
    label: "Usuarios",
    path: "usuarios",
    Icon: PeopleOutlinedIcon,
    roles: ["ADMINISTRADOR"],
  },
  {
    label: "Roles",
    path: "roles",
    Icon: AdminPanelSettingsOutlinedIcon,
    roles: ["ADMINISTRADOR"],
  },
  {
    label: "Configuración",
    path: "configuracion",
    Icon: SettingsOutlinedIcon,
    roles: ["ADMINISTRADOR"],
  },
];