import { createBrowserRouter, RouterProvider } from "react-router";
import { PrivateRoute, PublicOnlyRoute, RoleRoute } from "./guards";
import LoginPage from "@features/auth/pages/LoginPage";

const router = createBrowserRouter([
    {
        element: <PublicOnlyRoute />,
        children: [
            { path: "/login", element: <LoginPage /> },
        ],
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <RoleRoute rol="ADMINISTRADOR" />,
                children: [
                    {
                        path: "/admin",
                        lazy: () => import("@layouts/AdminLayout").then((m) => ({ Component: m.AdminLayout })),
                        children: [
                            { path: "bienvenida", lazy: () => import("@features/dashboard/pages/AdminWelcomePage").then((m) => ({ Component: m.default })) },
                            { path: "dashboard", lazy: () => import("@features/dashboard/pages/DashboardPage").then((m) => ({ Component: m.default })) },
                            { path: "clientes", lazy: () => import("@features/clientes/pages/ClientesListPage").then((m) => ({ Component: m.default })) },
                            { path: "clientes/:id", lazy: () => import("@features/clientes/pages/ClienteDetailPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones", lazy: () => import("@features/cotizaciones/pages/CotizacionesListPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones/crear", lazy: () => import("@features/cotizaciones/pages/CotizacionFormPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones/:id", lazy: () => import("@features/cotizaciones/pages/CotizacionDetailPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones/:id/editar", lazy: () => import("@features/cotizaciones/pages/CotizacionFormPage").then((m) => ({ Component: m.default })) },
                            { path: "proveedores", lazy: () => import("@features/proveedores/pages/ProveedoresListPage").then((m) => ({ Component: m.default })) },
                            { path: "pedidos", lazy: () => import("@features/pedidos/pages/PedidosListPage").then((m) => ({ Component: m.default })) },
                            { path: "pedidos/:id", lazy: () => import("@features/pedidos/pages/PedidoDetailPage").then((m) => ({ Component: m.default })) },
                            { path: "compras", lazy: () => import("@features/compras/pages/ComprasListPage").then((m) => ({ Component: m.default })) },
                            { path: "pagos", lazy: () => import("@features/pagos/pages/PagosListPage").then((m) => ({ Component: m.default })) },
                            { path: "comprobantes", lazy: () => import("@features/comprobantes/pages/ComprobantesListPage").then((m) => ({ Component: m.default })) },
                            { path: "reportes", lazy: () => import("@features/reportes/pages/ReportesPage").then((m) => ({ Component: m.default })) },
                            { path: "usuarios", lazy: () => import("@features/usuarios/pages/UsuariosListPage").then((m) => ({ Component: m.default })) },
                            { path: "roles", lazy: () => import("@features/roles/pages/RolesPage").then((m) => ({ Component: m.default })) },
                            { path: "configuracion", lazy: () => import("@features/configuracion/pages/ConfiguracionPage").then((m) => ({ Component: m.default })) },
                        ],
                    },
                ],
            },
            {
                element: <RoleRoute rol="ASISTENTE_ADMINISTRATIVO" />,
                children: [
                    {
                        path: "/asistente",
                        lazy: () => import("@layouts/AssistantLayout").then((m) => ({ Component: m.AssistantLayout })),
                        children: [
                            { path: "bienvenida", lazy: () => import("@features/dashboard/pages/AsistenteWelcomePage").then((m) => ({ Component: m.default })) },
                            { path: "dashboard", lazy: () => import("@features/dashboard/pages/DashboardPage").then((m) => ({ Component: m.default })) },
                            { path: "clientes", lazy: () => import("@features/clientes/pages/ClientesListPage").then((m) => ({ Component: m.default })) },
                            { path: "clientes/:id", lazy: () => import("@features/clientes/pages/ClienteDetailPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones", lazy: () => import("@features/cotizaciones/pages/CotizacionesListPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones/crear", lazy: () => import("@features/cotizaciones/pages/CotizacionFormPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones/:id", lazy: () => import("@features/cotizaciones/pages/CotizacionDetailPage").then((m) => ({ Component: m.default })) },
                            { path: "cotizaciones/:id/editar", lazy: () => import("@features/cotizaciones/pages/CotizacionFormPage").then((m) => ({ Component: m.default })) },
                            { path: "proveedores", lazy: () => import("@features/proveedores/pages/ProveedoresListPage").then((m) => ({ Component: m.default })) },
                            { path: "pedidos", lazy: () => import("@features/pedidos/pages/PedidosListPage").then((m) => ({ Component: m.default })) },
                            { path: "pedidos/:id", lazy: () => import("@features/pedidos/pages/PedidoDetailPage").then((m) => ({ Component: m.default })) },
                            { path: "compras", lazy: () => import("@features/compras/pages/ComprasListPage").then((m) => ({ Component: m.default })) },
                            { path: "pagos", lazy: () => import("@features/pagos/pages/PagosListPage").then((m) => ({ Component: m.default })) },
                            { path: "comprobantes", lazy: () => import("@features/comprobantes/pages/ComprobantesListPage").then((m) => ({ Component: m.default })) },
                        ],
                    },
                ],
            },
        ],
    },
    { path: "/", element: <LoginPage /> },
    { path: "/no-autorizado", element: <div>No autorizado</div> },
    { path: "*", element: <div>404 - No encontrado</div> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}