import { useRef, useState } from 'react'
import { Container, Typography, Grid, Box, Paper, TextField, MenuItem, Button, Chip, Stack, Fab, Badge, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import Navbar from '../components/Navbar'
import CanchaCard from '../components/CanchaCard'
import CarritoDrawer from '../components/CarritoDrawer'
import { useReservas } from '../context/ReservasContext'
import { HORAS, hoy, sumaDias } from '../data/mock'

const beneficios = [
  { icon: <EventAvailableIcon />, t: 'Sin crear cuenta', d: 'Reserva en menos de un minuto' },
  { icon: <PaymentsOutlinedIcon />, t: 'Paga en recepción', d: 'Efectivo, débito o transferencia' },
  { icon: <NotificationsActiveOutlinedIcon />, t: 'Te avisamos', d: 'Confirmación y recordatorio por WhatsApp' },
]

export default function Reservar() {
  const { canchas, carrito, libre } = useReservas()
  const [fecha, setFecha] = useState(hoy())
  const [tipo, setTipo] = useState('Todas')
  const [hora, setHora] = useState('')
  const [techada, setTechada] = useState(false)
  const [carro, setCarro] = useState(false)
  const resultados = useRef(null)

  const tipos = ['Todas', ...new Set(canchas.map(c => c.tipo))]
  const lista = canchas.filter(c => c.activa
    && (tipo === 'Todas' || c.tipo === tipo)
    && (!techada || c.techada)
    && (hora === '' || libre(c.id, fecha, hora)))

  return (
    <>
      <Navbar />

      <Box sx={{ background: 'linear-gradient(135deg,#0f5132 0%,#1b7f4b 60%,#2fa968 100%)', color: '#fff', py: { xs: 5, md: 8 } }}>
        <Container>
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
                Reserva tu cancha <Box component="span" sx={{ bgcolor: 'secondary.main', color: '#1f2933', px: 1.5, borderRadius: 2 }}>en minutos</Box>
              </Typography>
              <Typography sx={{ opacity: 0.9, mt: 2, fontSize: 18 }}>
                Fútbol 7, fútbol 5 y pádel. Elige fecha y horario, y listo.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>Encuentra tu cancha</Typography>
                <Stack spacing={2}>
                  <TextField label="Fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: hoy(), max: sumaDias(hoy(), 60) } }} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField select fullWidth label="Tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
                      {tipos.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>
                    <TextField select fullWidth label="Hora" value={hora} onChange={e => setHora(e.target.value)}>
                      <MenuItem value="">Cualquiera</MenuItem>
                      {HORAS.map(h => <MenuItem key={h} value={h}>{h}:00</MenuItem>)}
                    </TextField>
                  </Stack>
                  <Button variant="contained" size="large" startIcon={<SearchIcon />}
                    onClick={() => resultados.current?.scrollIntoView({ behavior: 'smooth' })}>Buscar</Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: 5 }} ref={resultados}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap", mb: 3 }}>
          <Typography variant="h5" sx={{ mr: 2 }}>Canchas disponibles</Typography>
          {tipos.map(t => (
            <Chip key={t} label={t} clickable color={tipo === t ? 'primary' : 'default'} variant={tipo === t ? 'filled' : 'outlined'} onClick={() => setTipo(t)} />
          ))}
          <Chip label="Solo techadas" clickable color={techada ? 'primary' : 'default'} variant={techada ? 'filled' : 'outlined'} onClick={() => setTechada(v => !v)} />
        </Stack>

        {lista.length === 0
          ? <Alert severity="info">No hay canchas disponibles con esos filtros. Prueba con otra hora o fecha.</Alert>
          : (
            <Grid container spacing={3}>
              {lista.map(c => (
                <Grid size={{ xs: 12, md: 6 }} key={c.id}><CanchaCard cancha={c} fecha={fecha} /></Grid>
              ))}
            </Grid>
          )}

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {beneficios.map(b => (
            <Grid size={{ xs: 12, md: 4 }} key={b.t}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box sx={{ bgcolor: '#e3f1e9', color: 'primary.main', p: 1.5, borderRadius: 3, display: 'flex' }}>{b.icon}</Box>
                <Box><Typography sx={{ fontWeight: 700 }}>{b.t}</Typography><Typography variant="body2" color="text.secondary">{b.d}</Typography></Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Fab color="primary" onClick={() => setCarro(true)} sx={{ position: 'fixed', left: 24, bottom: 24 }} aria-label="Carrito">
        <Badge badgeContent={carrito.length} color="secondary"><ShoppingCartIcon /></Badge>
      </Fab>
      <CarritoDrawer abierto={carro} cerrar={() => setCarro(false)} />
    </>
  )
}
