import { useState } from 'react'
import { Drawer, Box, Typography, IconButton, Stack, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useReservas } from '../context/ReservasContext'
import { clp, fechaLarga } from '../data/mock'

export default function CarritoDrawer({ abierto, cerrar }) {
  const { carrito, canchas, precio, alternarCarrito, confirmar } = useReservas()
  const [dlg, setDlg] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [exito, setExito] = useState(null)

  const items = carrito.map(it => {
    const cancha = canchas.find(c => c.id === it.canchaId)
    return { ...it, cancha, p: precio(cancha, it.hora) }
  })
  const total = items.reduce((s, i) => s + i.p.total, 0)
  const ahorro = items.reduce((s, i) => s + i.p.descuento, 0)
  const telOk = telefono.replace(/\D/g, '').length >= 8
  const valido = nombre.trim().length >= 3 && telOk

  function enviar() {
    const nuevas = confirmar({ nombre: nombre.trim(), telefono: telefono.replace(/\D/g, '') })
    setDlg(false); cerrar(); setExito(nuevas); setNombre(''); setTelefono('')
  }

  return (
    <>
      <Drawer anchor="right" open={abierto} onClose={cerrar}>
        <Box sx={{ width: { xs: 320, sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h5">Tu reserva</Typography>
            <IconButton onClick={cerrar}><CloseIcon /></IconButton>
          </Stack>
          <Divider sx={{ my: 2 }} />

          {items.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              Aún no has elegido horarios. Toca un horario disponible para agregarlo.
            </Typography>
          ) : (
            <Stack spacing={2} sx={{ flexGrow: 1, overflow: 'auto' }}>
              {items.map(i => (
                <Stack key={`${i.canchaId}-${i.fecha}-${i.hora}`} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{i.cancha.nombre} · {i.hora}:00 a {i.hora + 1}:00</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{fechaLarga(i.fecha)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {i.p.descuento > 0 && <Typography variant="caption" sx={{ textDecoration: 'line-through' }} color="text.secondary">{clp(i.p.bruto)}</Typography>}
                    <Typography sx={{ fontWeight: 700 }}>{clp(i.p.total)}</Typography>
                  </Box>
                  <IconButton size="small" onClick={() => alternarCarrito(i.canchaId, i.fecha, i.hora)}><DeleteOutlineIcon /></IconButton>
                </Stack>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />
          {ahorro > 0 && <Alert severity="success" sx={{ mb: 1 }}>Promoción aplicada: ahorras {clp(ahorro)}</Alert>}
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>{clp(total)}</Typography>
          </Stack>
          <Button variant="contained" size="large" disabled={items.length === 0} onClick={() => setDlg(true)}>Continuar</Button>
        </Box>
      </Drawer>

      <Dialog open={dlg} onClose={() => setDlg(false)} fullWidth maxWidth="xs">
        <DialogTitle>Datos para la reserva</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
            <TextField label="Teléfono / WhatsApp" value={telefono} onChange={e => setTelefono(e.target.value)} error={telefono !== '' && !telOk} helperText="Te avisaremos por este número" />
            <Alert severity="info">El pago se realiza en recepción. Total a pagar: {clp(total)}</Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDlg(false)}>Volver</Button>
          <Button variant="contained" disabled={!valido} onClick={enviar}>Confirmar reserva</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!exito} onClose={() => setExito(null)} fullWidth maxWidth="xs">
        <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
          <CheckCircleIcon color="primary" sx={{ fontSize: 64 }} />
          <Typography variant="h5" sx={{ my: 1 }}>¡Reserva confirmada!</Typography>
          <Typography color="text.secondary">Códigos: <b>{exito?.map(r => r.id).join(', ')}</b></Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Presenta el código y paga en recepción.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button fullWidth variant="contained" onClick={() => setExito(null)}>Listo</Button></DialogActions>
      </Dialog>
    </>
  )
}
