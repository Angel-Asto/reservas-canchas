import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function RutaProtegida({ roles, children }) {
  const { user, rol, cargando } = useAuth()
  if (cargando) return <Box sx={{ display: 'grid', placeItems: 'center', height: '60vh' }}><CircularProgress /></Box>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(rol)) return <Navigate to="/" replace />
  return children
}
