import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, rol, logout } = useAuth()
  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ gap: 1 }}>
        <SportsSoccerIcon />
        <Typography variant="h6" sx={{ fontWeight: 700, mr: 2 }}>Canchas</Typography>
        <Button color="inherit" component={RouterLink} to="/">Reservar</Button>
        {(rol === 'recepcionista' || rol === 'dueno') && (
          <Button color="inherit" component={RouterLink} to="/recepcion">Recepción</Button>
        )}
        {rol === 'dueno' && (
          <Button color="inherit" component={RouterLink} to="/admin">Administración</Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {rol && <Chip label={rol} size="small" sx={{ bgcolor: 'rgba(255,255,255,.2)', color: '#fff' }} />}
        {user
          ? <Button color="inherit" variant="outlined" onClick={logout}>Salir</Button>
          : <Button color="inherit" variant="outlined" component={RouterLink} to="/login">Ingresar</Button>}
      </Toolbar>
    </AppBar>
  )
}
