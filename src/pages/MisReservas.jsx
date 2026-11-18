import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Container, Typography, Card, CardContent, Stack, Chip, Button, Alert, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useReservas } from '../context/ReservasContext'
import { clp, fechaLarga, estadoReserva } from '../data/mock'

const colorEstado = { Pagada: 'success', Abonada: 'warning', Pendiente: 'default', Cancelada: 'error' }

export default function MisReservas() {
  const { perfil } = useAuth()
  const { reservas, canchas, cancelar, pasada } = useReservas()
  const [aCancelar, setACancelar] = useState(null)

  // El cliente solo ve las reservas asociadas a su propio teléfono
  const mias = reservas
    .filter(r => r.cliente.telefono === perfil?.telefono)
    .sort((a, b) => (a.fecha + String(a.hora).padStart(2, '0')).localeCompare(b.fecha + String(b.hora).padStart(2, '0')))
  const nombreCancha = id => canchas.find(c => c.id === id)?.nombre
  // Solo se puede cancelar en línea si aún no se ha pagado nada y la hora no ha pasado
  const cancelable = r => !r.cancelada && r.pagado === 0 && !pasada(r.fecha, r.hora)

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Mis reservas</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Hola, {perfil?.nombre}. Aquí ves tus reservas asociadas al teléfono {perfil?.telefono}.
        </Typography>

        {mias.length === 0 ? (
          <Alert severity="info" action={<Button component={RouterLink} to="/" color="inherit">Reservar</Button>}>
            Aún no tienes reservas.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {mias.map(r => {
              const e = estadoReserva(r)
              return (
                <Card key={r.id}>
                  <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
                      <Box sx={{ bgcolor: '#e3f1e9', color: 'primary.main', p: 1.5, borderRadius: 3, display: 'flex', alignSelf: 'flex-start' }}><EventIcon /></Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: 700 }}>{nombreCancha(r.canchaId)} · {r.hora}:00 a {r.hora + 1}:00</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{fechaLarga(r.fecha)}</Typography>
                        <Typography variant="body2" color="text.secondary">Código {r.id} · Total {clp(r.total)} · Pagado {clp(r.pagado)}</Typography>
                      </Box>
                      <Chip label={e} color={colorEstado[e]} size="small" />
                      {cancelable(r) && <Button color="error" variant="outlined" onClick={() => setACancelar(r)}>Cancelar</Button>}
                    </Stack>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        )}
        <Alert severity="info" sx={{ mt: 3 }}>
          Las reservas con pagos o abonos se cancelan o reprograman en recepción.
        </Alert>
      </Container>

      <Dialog open={!!aCancelar} onClose={() => setACancelar(null)} fullWidth maxWidth="xs">
        <DialogTitle>¿Cancelar la reserva {aCancelar?.id}?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            {aCancelar && `${nombreCancha(aCancelar.canchaId)}, ${fechaLarga(aCancelar.fecha)} a las ${aCancelar.hora}:00. El horario quedará disponible para otros clientes.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setACancelar(null)}>Volver</Button>
          <Button color="error" variant="contained" onClick={() => { cancelar(aCancelar.id); setACancelar(null) }}>Cancelar reserva</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
