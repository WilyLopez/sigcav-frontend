import axios from "axios";
import { tokenStorage } from "@features/auth/utils/token.storage";
import { useAuthStore } from "@app/store/auth.store";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
    headers: { "Content-Type": "application/json" },
    timeout: 10_000,
});

httpClient.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refreshToken = tokenStorage.getRefreshToken();
            if (!refreshToken) {
                tokenStorage.clear();
                useAuthStore.getState().clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL ?? "/api"}/auth/refresh`,
                    { refreshToken }
                );
                const newToken = data.datos.accessToken;
                tokenStorage.setAccessToken(newToken);
                original.headers.Authorization = `Bearer ${newToken}`;
                return httpClient(original);
            } catch {
                tokenStorage.clear();
                useAuthStore.getState().clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);