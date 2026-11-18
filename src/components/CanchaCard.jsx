import { Card, Box, Chip, Typography, Stack, LinearProgress, ToggleButton, Tooltip } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import GrassIcon from '@mui/icons-material/Grass'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import CanchaImagen from './CanchaImagen'
import { useReservas } from '../context/ReservasContext'
import { HORAS, clp } from '../data/mock'

const Spec = ({ icon, children }) => (
  <Stack direction="row" spacing={0.7} sx={{ alignItems: "center", color: 'text.secondary', fontSize: 14 }}>
    {icon}<span>{children}</span>
  </Stack>
)

export default function CanchaCard({ cancha, fecha }) {
  const { precio, libre, enCarrito, alternarCarrito, ocupacion } = useReservas()
  const ocup = Math.round(ocupacion(cancha.id, fecha) * 100)
  const desde = Math.min(...HORAS.map(h => precio(cancha, h).total))

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', height: 170, bgcolor: '#e8f3ec' }}>
        <CanchaImagen tipo={cancha.tipo} />
        <Chip label={cancha.tipo} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(0,0,0,.75)', color: '#fff', fontWeight: 600 }} />
        {cancha.popular && (
          <Chip icon={<WhatshotIcon />} label="Más reservada" size="small" color="secondary" sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 600 }} />
        )}
      </Box>

      <Box sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{cancha.nombre}</Typography>
          <Typography color="primary" sx={{ fontWeight: 700 }}>desde {clp(desde)}<Typography component="span" variant="caption" color="text.secondary">/hora</Typography></Typography>
        </Stack>

        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap", my: 1.5 }}>
          <Spec icon={<GroupsIcon fontSize="small" />}>{cancha.jugadores} jugadores</Spec>
          <Spec icon={<GrassIcon fontSize="small" />}>{cancha.superficie}</Spec>
          <Spec icon={<HomeOutlinedIcon fontSize="small" />}>{cancha.techada ? 'Techada' : 'Al aire libre'}</Spec>
          {cancha.iluminacion && <Spec icon={<LightbulbOutlinedIcon fontSize="small" />}>Iluminación</Spec>}
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Ocupación del día</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{ocup}%</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={ocup} color={ocup > 70 ? 'secondary' : 'primary'} sx={{ height: 8, borderRadius: 4, mb: 2 }} />

        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Elige tus horarios</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(78px, 1fr))', gap: 1 }}>
          {HORAS.map(h => {
            const p = precio(cancha, h)
            const ok = libre(cancha.id, fecha, h)
            return (
              <Tooltip key={h} title={ok ? `${clp(p.total)}${p.conPromo ? ` (-${p.descuento ? Math.round(p.descuento / p.bruto * 100) : 0}% promo)` : ''}` : 'No disponible'}>
                <span>
                  <ToggleButton
                    value={h} size="small" fullWidth disabled={!ok}
                    selected={enCarrito(cancha.id, fecha, h)}
                    onChange={() => alternarCarrito(cancha.id, fecha, h)}
                    color="primary" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, position: 'relative' }}
                  >
                    {h}:00
                    {ok && p.conPromo && <Box sx={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: '50%', bgcolor: 'secondary.main' }} />}
                  </ToggleButton>
                </span>
              </Tooltip>
            )
          })}
        </Box>
      </Box>
    </Card>
  )
}
