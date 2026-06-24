import { createTheme, type Shadows } from "@mui/material/styles";

const shadows = [
    "none",
    "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    ...Array.from({ length: 20 }, () => "none"),
] as Shadows;

export const theme = createTheme({
    palette: {
        primary: {
            main: "#2563eb",
            dark: "#1d4ed8",
            light: "#eff6ff",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#64748b",
            dark: "#334155",
            light: "#f1f5f9",
            contrastText: "#ffffff",
        },
        success: { main: "#16a34a", light: "#dcfce7" },
        warning: { main: "#d97706", light: "#fef3c7" },
        error: { main: "#dc2626", light: "#fee2e2" },
        info: { main: "#0284c7", light: "#e0f2fe" },
        background: {
            default: "#f8fafc",
            paper: "#ffffff",
        },
        text: {
            primary: "#0f172a",
            secondary: "#64748b",
            disabled: "#94a3b8",
        },
        divider: "#e2e8f0",
    },

    typography: {
        fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif',
        h1: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 },
        h2: { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3 },
        h3: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
        h4: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
        h5: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
        h6: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.5 },
        body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
        body2: { fontSize: "0.875rem", lineHeight: 1.6 },
        caption: { fontSize: "0.75rem", color: "#64748b" },
        button: { textTransform: "none", fontWeight: 500 },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                    padding: "8px 20px",
                },
            },
        },

        MuiCard: {
            defaultProps: { elevation: 1 },
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.07)",
                },
            },
        },

        MuiTextField: {
            defaultProps: { variant: "outlined", size: "small" },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#ffffff",
                    },
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: "none" },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-head": {
                        backgroundColor: "#f1f5f9",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: "#475569",
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 6, fontWeight: 500 },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    width: 260,
                    borderRight: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderBottom: "1px solid #e2e8f0",
                    boxShadow: "none",
                },
            },
        },
    },
    shadows
});