import { httpClient } from "@config/http.client";
import type {
  ApiResponse,
  LoginRequest,
  RefreshTokenRequest,
  TokenResponse,
} from "../types/auth.types";

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await httpClient.post<ApiResponse<TokenResponse>>("/auth/login", data);
    return res.data.data;
  },

  refresh: async (data: RefreshTokenRequest) => {
    const res = await httpClient.post<ApiResponse<TokenResponse>>("/auth/refresh", data);
    return res.data.data;
  },

  logout: async () => {
    await httpClient.post("/auth/logout");
  },
};