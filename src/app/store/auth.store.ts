import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioResponse } from "@features/auth/types/auth.types";

interface AuthState {
    usuario: UsuarioResponse | null;
    isAuthenticated: boolean;
    setUsuario: (usuario: UsuarioResponse) => void;
    clear: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            usuario: null,
            isAuthenticated: false,

            setUsuario: (usuario) => set({ usuario, isAuthenticated: true }),

            clear: () => set({ usuario: null, isAuthenticated: false }),
        }),
        { name: "sigcav_auth" }
    )
);