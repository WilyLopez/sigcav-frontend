import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@app/store/auth.store";
import { tokenStorage } from "@features/auth/utils/token.storage";
import type { Rol } from "@features/auth/types/auth.types";

export function PrivateRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const token = tokenStorage.getAccessToken();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export function RoleRoute({ rol }: { rol: Rol }) {
    const usuario = useAuthStore((s) => s.usuario);

    if (usuario?.rol !== rol) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return <Outlet />;
}

export function PublicOnlyRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const usuario = useAuthStore((s) => s.usuario);

    if (isAuthenticated && usuario) {
        const destino =
            usuario.rol === "ADMINISTRADOR" ? "/admin/bienvenida" : "/asistente/bienvenida";
        return <Navigate to={destino} replace />;
    }

    return <Outlet />;
}