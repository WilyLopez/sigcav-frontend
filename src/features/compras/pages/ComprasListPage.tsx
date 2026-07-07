import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useComprasList, useRegistrarCompra } from "../hooks/useCompras";
import { useProveedoresList } from "../../proveedores/hooks/useProveedores";
import CompraFormDialog from "../components/CompraFormDialog";
import AsignarCompraDialog from "../components/AsignarCompraDialog";
import type { CompraResponse } from "../types/compras.types";
import type { CompraFormValues } from "../schemas/compras.schemas";

export default function ComprasListPage() {
  const [proveedorFilter, setProveedorFilter] = useState<number | "">("");
  const [desdeFilter, setDesdeFilter] = useState("");
  const [hastaFilter, setHastaFilter] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openAsignar, setOpenAsignar] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<CompraResponse | null>(null);

  const { data: proveedoresData } = useProveedoresList("", 0, 100);
  const { data, isLoading } = useComprasList(
    proveedorFilter || undefined,
    desdeFilter || undefined,
    hastaFilter || undefined
  );

  const { mutate: registrarCompra, isPending: isRegistering } = useRegistrarCompra();

  const handleCreateSubmit = (values: CompraFormValues) => {
    registrarCompra(values as any, {
      onSuccess: () => {
        setOpenCreate(false);
      },
    });
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex justify-between items-center flex-wrap gap-4">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Compras de Almacén
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Registro de facturas de proveedores de insumos y asignación de costos a pedidos de producción
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          size="small"
        >
          Registrar Compra
        </Button>
      </Box>

      <Card>
        <Box className="p-4 flex flex-wrap gap-4 items-center">
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="proveedor-filter-label">Proveedor</InputLabel>
            <Select
              labelId="proveedor-filter-label"
              label="Proveedor"
              value={proveedorFilter}
              onChange={(e) => setProveedorFilter(e.target.value as any)}
            >
              <MenuItem value="">Todos los proveedores</MenuItem>
              {proveedoresData?.content.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombreRazonSocial}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Desde"
            type="date"
            size="small"
            value={desdeFilter}
            onChange={(e) => setDesdeFilter(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Hasta"
            type="date"
            size="small"
            value={hastaFilter}
            onChange={(e) => setHastaFilter(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Proveedor</TableCell>
                <TableCell>Fecha Compra</TableCell>
                <TableCell>Comprobante</TableCell>
                <TableCell>Nro. Comprobante</TableCell>
                <TableCell>Insumos Adquiridos</TableCell>
                <TableCell align="right">Monto Total</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    Cargando historial de compras...
                  </TableCell>
                </TableRow>
              ) : !data || data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No se encontraron registros de compras
                  </TableCell>
                </TableRow>
              ) : (
                data.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {c.proveedorNombre}
                      </Typography>
                    </TableCell>
                    <TableCell>{new Date(c.fechaCompra).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={c.tipoComprobanteProveedor} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{c.numeroComprobanteProveedor || "S/N"}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 220 }} noWrap>
                        {c.items?.map((item) => `${item.nombreMaterial} (x${item.cantidad})`).join(", ") || "Ninguno"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">S/ {c.total?.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Asignar Costos a Pedido">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedCompra(c);
                            setOpenAsignar(true);
                          }}
                        >
                          <MonetizationOnOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CompraFormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
        isPending={isRegistering}
      />

      <AsignarCompraDialog
        open={openAsignar}
        onClose={() => {
          setOpenAsignar(false);
          setSelectedCompra(null);
        }}
        compra={selectedCompra}
      />
    </Box>
  );
}
