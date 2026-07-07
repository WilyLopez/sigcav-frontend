import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { NAV_ITEMS } from "../nav.config";

const SIDEBAR_WIDTH = 260;

interface SidebarProps {
  basePath: string;
  rol: string;
}

export function Sidebar({ basePath, rol }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = NAV_ITEMS.filter((item) => item.roles.includes(rol));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <Box className="flex items-center gap-2 px-5 py-4" sx={{ height: 64 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>
            SG
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={800} letterSpacing={-0.5} sx={{ color: "text.primary" }}>
          SIGCAV
        </Typography>
      </Box>

      <Divider sx={{ opacity: 0.6 }} />

      <Box className="flex flex-col flex-1 overflow-y-auto py-3 px-3">
        <List disablePadding>
          {items.map(({ label, path, Icon }) => {
            const fullPath = `/${basePath}/${path}`;
            const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);

            return (
              <ListItemButton
                key={path}
                onClick={() => navigate(fullPath)}
                sx={{
                  borderRadius: "10px",
                  mb: 0.5,
                  px: 2,
                  py: 1.2,
                  bgcolor: isActive ? "primary.light" : "transparent",
                  color: isActive ? "primary.main" : "text.secondary",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: isActive ? "primary.light" : "rgba(79, 70, 229, 0.04)",
                    color: isActive ? "primary.main" : "text.primary",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}