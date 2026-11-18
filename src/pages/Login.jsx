import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, Typography, TextField, Button, Alert, Stack, Divider } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { inicioRol } from '../data/mock'

export default function Login() {
  const { login, DEMO } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    const { error, rol } = await login(email, password)
    setEnviando(false)
    if (error) setError('Correo o contraseña incorrectos')
    else nav(inicioRol[rol] ?? '/')
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack component="form" onSubmit={enviar} spacing={2} sx={{ alignItems: "stretch" }}>
              <LockOutlinedIcon color="primary" sx={{ alignSelf: 'center', fontSize: 40 }} />
              <Typography variant="h5" align="center">Ingreso al sistema</Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField label="Correo" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <TextField label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              <Button type="submit" variant="contained" size="large" disabled={enviando}>Entrar</Button>
              {DEMO && (
                <>
                  <Divider>Modo demo</Divider>
                  <Button variant="outlined" onClick={() => { setEmail('dueno@demo.cl'); setPassword('demo1234') }}>Usar cuenta Administrador</Button>
                  <Button variant="outlined" onClick={() => { setEmail('recepcion@demo.cl'); setPassword('demo1234') }}>Usar cuenta Recepción</Button>
                  <Button variant="outlined" onClick={() => { setEmail('cliente@demo.cl'); setPassword('demo1234') }}>Usar cuenta Cliente</Button>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
