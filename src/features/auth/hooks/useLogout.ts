import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "../utils/token.storage";
import { useAuthStore } from "@app/store/auth.store";

export const useLogout = () => {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      tokenStorage.clear();
      clear();
      navigate("/login", { replace: true });
    },
  });
};