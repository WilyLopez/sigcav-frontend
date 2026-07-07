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
            main: "#4f46e5",
            dark: "#4338ca",
            light: "#f5f3ff",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#64748b",
            dark: "#1e293b",
            light: "#f1f5f9",
            contrastText: "#ffffff",
        },
        success: { main: "#10b981", light: "#ecfdf5" },
        warning: { main: "#f59e0b", light: "#fffbeb" },
        error: { main: "#ef4444", light: "#fff1f2" },
        info: { main: "#06b6d4", light: "#ecfeff" },
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
        button: { textTransform: "none", fontWeight: 600 },
    },

    shape: {
        borderRadius: 10,
    },

    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                    padding: "8px 20px",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px -2px rgba(79, 70, 229, 0.12)",
                    },
                    "&:active": {
                        transform: "translateY(0)",
                    },
                },
            },
        },

        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 4px -1px rgba(15, 23, 42, 0.03)",
                },
            },
        },

        MuiTextField: {
            defaultProps: { variant: "outlined", size: "small" },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 10,
                        backgroundColor: "#ffffff",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                            borderColor: "#e2e8f0",
                        },
                        "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#4f46e5",
                            borderWidth: "1.5px",
                        },
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
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: "#475569",
                        borderBottom: "1px solid #e2e8f0",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                    },
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid #f1f5f9",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                },
            },
        },

        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&.MuiTableRow-hover:hover": {
                        backgroundColor: "#f5f3ff",
                        transition: "background-color 0.15s ease",
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: { 
                    borderRadius: 8, 
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                },
            },
            variants: [
                {
                    props: { variant: "filled", color: "success" },
                    style: {
                        backgroundColor: "#ecfdf5",
                        color: "#10b981",
                    },
                },
                {
                    props: { variant: "filled", color: "warning" },
                    style: {
                        backgroundColor: "#fffbeb",
                        color: "#f59e0b",
                    },
                },
                {
                    props: { variant: "filled", color: "error" },
                    style: {
                        backgroundColor: "#fff1f2",
                        color: "#ef4444",
                    },
                },
                {
                    props: { variant: "filled", color: "info" },
                    style: {
                        backgroundColor: "#ecfeff",
                        color: "#06b6d4",
                    },
                },
                {
                    props: { variant: "filled", color: "default" },
                    style: {
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                    },
                },
            ],
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    width: 260,
                    borderRight: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    boxShadow: "1px 0 10px rgba(15, 23, 42, 0.02)",
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: "#0f172a",
                    borderBottom: "1px solid #e2e8f0",
                    boxShadow: "none",
                    backdropFilter: "blur(8px)",
                },
            },
        },
    },
    shadows
});