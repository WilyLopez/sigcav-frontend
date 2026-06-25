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