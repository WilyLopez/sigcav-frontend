import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  basePath: string;
  rol: string;
}

export function AppShell({ basePath, rol }: AppShellProps) {
  return (
    <Box className="flex min-h-screen" sx={{ bgcolor: "background.default" }}>
      <Sidebar basePath={basePath} rol={rol} />

      <Box className="flex flex-col flex-1">
        <Topbar />
        <Toolbar sx={{ minHeight: 64 }} />

        <Box
          component="main"
          className="flex-1 p-6"
          sx={{ maxWidth: 1280, width: "100%" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}