import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "@app/store/auth.store";
import { useLogout } from "@features/auth/hooks/useLogout";

export function Topbar() {
  const usuario = useAuthStore((s) => s.usuario);
  const { mutate: logout, isPending } = useLogout();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const initials = usuario
    ? usuario.nombreCompleto
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <AppBar position="fixed" sx={{ left: 260, width: "calc(100% - 260px)" }}>
      <Toolbar sx={{ justifyContent: "flex-end", gap: 1, minHeight: 64 }}>
        <Box className="flex items-center gap-2">
          <Box className="text-right">
            <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
              {usuario?.nombreCompleto}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {usuario?.rol}
            </Typography>
          </Box>

          <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                fontSize: 13,
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(79, 70, 229, 0.2)",
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 180 } } }}
        >
          <Box className="px-4 py-2">
            <Typography variant="body2" fontWeight={600}>
              {usuario?.nombreCompleto}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {usuario?.correo}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchor(null);
              logout();
            }}
            disabled={isPending}
            sx={{ color: "error.main", fontSize: 14 }}
          >
            {isPending ? (
              <CircularProgress size={14} sx={{ mr: 1 }} />
            ) : null}
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}