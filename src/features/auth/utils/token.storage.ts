const KEYS = {
  ACCESS: "sigcav_access",
  REFRESH: "sigcav_refresh",
} as const;

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(KEYS.ACCESS),
  getRefreshToken: () => localStorage.getItem(KEYS.REFRESH),

  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(KEYS.ACCESS, access);
    localStorage.setItem(KEYS.REFRESH, refresh);
  },

  setAccessToken: (access: string) => {
    localStorage.setItem(KEYS.ACCESS, access);
  },

  clear: () => {
    localStorage.removeItem(KEYS.ACCESS);
    localStorage.removeItem(KEYS.REFRESH);
  },
};