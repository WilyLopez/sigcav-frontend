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
            borderRadius: "8px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>
            SG
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={700} letterSpacing={-0.3}>
          SIGCAV
        </Typography>
      </Box>

      <Divider />

      <Box className="flex flex-col flex-1 overflow-y-auto py-2 px-2">
        <List disablePadding>
          {items.map(({ label, path, Icon }) => {
            const fullPath = `/${basePath}/${path}`;
            const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);

            return (
              <ListItemButton
                key={path}
                onClick={() => navigate(fullPath)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 1.5,
                  py: 1,
                  bgcolor: isActive ? "primary.light" : "transparent",
                  color: isActive ? "primary.main" : "text.secondary",
                  "&:hover": {
                    bgcolor: isActive ? "primary.light" : "neutral.100",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
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