import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReservasProvider } from './context/ReservasContext'
import RutaProtegida from './components/RutaProtegida'
import Reservar from './pages/Reservar'
import Login from './pages/Login'
import Recepcion from './pages/Recepcion'
import Admin from './pages/Admin'
import MisReservas from './pages/MisReservas'

export default function App() {
  return (
    <AuthProvider>
      <ReservasProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Reservar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mis-reservas" element={
            <RutaProtegida roles={['cliente']}><MisReservas /></RutaProtegida>
          } />
          <Route path="/recepcion" element={
            <RutaProtegida roles={['recepcionista', 'dueno']}><Recepcion /></RutaProtegida>
          } />
          <Route path="/admin" element={
            <RutaProtegida roles={['dueno']}><Admin /></RutaProtegida>
          } />
        </Routes>
      </BrowserRouter>
      </ReservasProvider>
    </AuthProvider>
  )
}
