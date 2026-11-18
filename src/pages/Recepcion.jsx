import { useState } from 'react'
import { Container, Typography, Tabs, Tab, Paper, Grid, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Chip, IconButton, Tooltip, TextField, MenuItem, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import Navbar from '../components/Navbar'
import { useReservas } from '../context/ReservasContext'
import { clp, hoy, estadoReserva } from '../data/mock'

const colorEstado = { Pagada: 'success', Abonada: 'warning', Pendiente: 'default', Cancelada: 'error' }

function Kpi({ titulo, valor }) {
  return (
    <Card><CardContent>
      <Typography color="text.secondary" variant="body2">{titulo}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{valor}</Typography>
    </CardContent></Card>
  )
}

export default function Recepcion() {
  const { reservas, canchas, registrarPago, cancelar } = useReservas()
  const [tab, setTab] = useState(0)
  const [fecha, setFecha] = useState(hoy())
  const [estado, setEstado] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [pago, setPago] = useState(null)
  const [monto, setMonto] = useState('')

  const delDia = reservas.filter(r => r.fecha === fecha).sort((a, b) => a.hora - b.hora)
  const filas = delDia.filter(r =>
    (estado === 'Todos' || estadoReserva(r) === estado) &&
    (busca === '' || (r.cliente.nombre + r.id).toLowerCase().includes(busca.toLowerCase())))
  const activas = delDia.filter(r => !r.cancelada)
  const cobrado = activas.reduce((s, r) => s + r.pagado, 0)
  const porCobrar = activas.reduce((s, r) => s + (r.total - r.pagado), 0)

  const clientes = Object.values(reservas.filter(r => !r.cancelada).reduce((acc, r) => {
    const k = r.cliente.telefono
    acc[k] ??= { ...r.cliente, reservas: 0, gastado: 0 }
    acc[k].reservas++; acc[k].gastado += r.pagado
    return acc
  }, {}))

  const nombreCancha = id => canchas.find(c => c.id === id)?.nombre

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Panel de recepción</Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Reservas del día" valor={activas.length} /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Cobrado" valor={clp(cobrado)} /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Por cobrar" valor={clp(porCobrar)} /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Canceladas" valor={delDia.length - activas.length} /></Grid>
        </Grid>

        <Paper variant="outlined">
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Reservas" /><Tab label="Clientes" />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField size="small" type="date" label="Fecha" value={fecha} onChange={e => setFecha(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                <TextField size="small" select label="Estado" value={estado} onChange={e => setEstado(e.target.value)} sx={{ minWidth: 150 }}>
                  {['Todos', 'Pendiente', 'Abonada', 'Pagada', 'Cancelada'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                </TextField>
                <TextField size="small" label="Buscar cliente o código" value={busca} onChange={e => setBusca(e.target.value)} sx={{ flexGrow: 1 }} />
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead><TableRow>
                    {['Código', 'Hora', 'Cancha', 'Cliente', 'Teléfono', 'Total', 'Pagado', 'Estado', ''].map(h => <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>)}
                  </TableRow></TableHead>
                  <TableBody>
                    {filas.map(r => {
                      const e = estadoReserva(r)
                      return (
                        <TableRow key={r.id} hover>
                          <TableCell>{r.id}</TableCell><TableCell>{r.hora}:00</TableCell><TableCell>{nombreCancha(r.canchaId)}</TableCell>
                          <TableCell>{r.cliente.nombre}</TableCell><TableCell>{r.cliente.telefono}</TableCell>
                          <TableCell>{clp(r.total)}</TableCell><TableCell>{clp(r.pagado)}</TableCell>
                          <TableCell><Chip size="small" label={e} color={colorEstado[e]} /></TableCell>
                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            {!r.cancelada && r.pagado < r.total && (
                              <Tooltip title="Registrar pago"><IconButton size="small" color="primary" onClick={() => { setPago(r); setMonto(r.total - r.pagado) }}><PaymentsIcon /></IconButton></Tooltip>
                            )}
                            {!r.cancelada && (
                              <Tooltip title="Cancelar"><IconButton size="small" color="error" onClick={() => cancelar(r.id)}><CancelOutlinedIcon /></IconButton></Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filas.length === 0 && <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>Sin reservas para este filtro</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tab === 1 && (
            <TableContainer sx={{ p: 2 }}>
              <Table size="small">
                <TableHead><TableRow>{['Cliente', 'Teléfono', 'Reservas', 'Total pagado'].map(h => <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>)}</TableRow></TableHead>
                <TableBody>
                  {clientes.map(c => (
                    <TableRow key={c.telefono} hover>
                      <TableCell>{c.nombre}</TableCell><TableCell>{c.telefono}</TableCell><TableCell>{c.reservas}</TableCell><TableCell>{clp(c.gastado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      <Dialog open={!!pago} onClose={() => setPago(null)} fullWidth maxWidth="xs">
        <DialogTitle>Registrar pago · {pago?.id}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Saldo pendiente: {pago && clp(pago.total - pago.pagado)}</Typography>
          <TextField fullWidth label="Monto recibido" type="number" value={monto} onChange={e => setMonto(e.target.value)} autoFocus />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPago(null)}>Cancelar</Button>
          <Button variant="contained" disabled={!(Number(monto) > 0)} onClick={() => { registrarPago(pago.id, Number(monto)); setPago(null) }}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
