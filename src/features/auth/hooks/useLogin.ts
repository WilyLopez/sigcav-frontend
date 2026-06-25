import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "../utils/token.storage";
import { useAuthStore } from "@app/store/auth.store";
import type { LoginRequest } from "../types/auth.types";

export const useLogin = () => {
  const navigate = useNavigate();
  const setUsuario = useAuthStore((s) => s.setUsuario);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      setUsuario(response.usuario);

      const rol = response.usuario.rol;
      if (rol === "ADMINISTRADOR") {
        navigate("/admin/bienvenida", { replace: true });
      } else if (rol === "ASISTENTE_ADMINISTRATIVO") {
        navigate("/asistente/bienvenida", { replace: true });
      }
    },
  });
};