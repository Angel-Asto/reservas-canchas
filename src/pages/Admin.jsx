import { useState } from 'react'
import { Container, Typography, Tabs, Tab, Paper, Grid, Card, CardContent, Box, Stack, LinearProgress, Table, TableHead, TableRow, TableCell, TableBody, Switch, Chip, TextField, Alert } from '@mui/material'
import Navbar from '../components/Navbar'
import { useReservas } from '../context/ReservasContext'
import { clp, hoy, usuariosDemo, HORAS } from '../data/mock'

const Kpi = ({ titulo, valor, color }) => (
  <Card><CardContent>
    <Typography color="text.secondary" variant="body2">{titulo}</Typography>
    <Typography variant="h4" color={color} sx={{ fontWeight: 700 }}>{valor}</Typography>
  </CardContent></Card>
)

export default function Admin() {
  const { reservas, canchas, promo, setPromo, alternarCancha, ocupacion } = useReservas()
  const [tab, setTab] = useState(0)

  const activas = reservas.filter(r => !r.cancelada)
  const ingresos = activas.reduce((s, r) => s + r.pagado, 0)
  const pendiente = activas.reduce((s, r) => s + r.total - r.pagado, 0)
  const ocupProm = Math.round(canchas.reduce((s, c) => s + ocupacion(c.id, hoy()), 0) / canchas.length * 100)

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Administración</Typography>
        <Paper variant="outlined">
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
            <Tab label="Resumen" /><Tab label="Canchas y tarifas" /><Tab label="Usuarios" />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Ingresos cobrados" valor={clp(ingresos)} color="primary" /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Por cobrar" valor={clp(pendiente)} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Reservas activas" valor={activas.length} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Kpi titulo="Ocupación hoy" valor={`${ocupProm}%`} /></Grid>
              </Grid>
              <Typography variant="h6" gutterBottom>Ocupación de hoy por cancha</Typography>
              <Stack spacing={2}>
                {canchas.map(c => {
                  const v = Math.round(ocupacion(c.id, hoy()) * 100)
                  return (
                    <Box key={c.id}>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}><Typography>{c.nombre} · {c.tipo}</Typography><Typography sx={{ fontWeight: 700 }}>{v}% ({Math.round(v * HORAS.length / 100)}/{HORAS.length} h)</Typography></Stack>
                      <LinearProgress variant="determinate" value={v} sx={{ height: 10, borderRadius: 5 }} />
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ p: 3 }}>
              <Table size="small" sx={{ mb: 4 }}>
                <TableHead><TableRow>{['Cancha', 'Tipo', 'Superficie', 'Tarifa base/hora', 'Activa'].map(h => <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>)}</TableRow></TableHead>
                <TableBody>
                  {canchas.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>{c.nombre}</TableCell><TableCell>{c.tipo}</TableCell><TableCell>{c.superficie}</TableCell><TableCell>{clp(c.base)}</TableCell>
                      <TableCell><Switch checked={c.activa} onChange={() => alternarCancha(c.id)} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom>Promoción</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: "center" }}>
                <TextField size="small" label="Descuento %" type="number" value={promo.pct} onChange={e => setPromo({ ...promo, pct: Number(e.target.value) })} />
                <TextField size="small" label="Desde (hora)" type="number" value={promo.desde} onChange={e => setPromo({ ...promo, desde: Number(e.target.value) })} />
                <TextField size="small" label="Hasta (hora)" type="number" value={promo.hasta} onChange={e => setPromo({ ...promo, hasta: Number(e.target.value) })} />
                <Stack direction="row" sx={{ alignItems: "center" }}><Switch checked={promo.activa} onChange={e => setPromo({ ...promo, activa: e.target.checked })} /><span>Activa</span></Stack>
              </Stack>
              <Alert severity="info" sx={{ mt: 2 }}>Tarifa nocturna: +25 % desde las 18:00. Los cambios se reflejan al instante en la pantalla de reservas.</Alert>
            </Box>
          )}

          {tab === 2 && (
            <Box sx={{ p: 3 }}>
              <Table size="small">
                <TableHead><TableRow>{['Nombre', 'Correo', 'Rol'].map(h => <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>)}</TableRow></TableHead>
                <TableBody>
                  {usuariosDemo.map(u => (
                    <TableRow key={u.email}>
                      <TableCell>{u.nombre}</TableCell><TableCell>{u.email}</TableCell>
                      <TableCell><Chip size="small" label={u.rol === 'dueno' ? 'Dueño' : 'Recepcionista'} color={u.rol === 'dueno' ? 'primary' : 'default'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  )
}
