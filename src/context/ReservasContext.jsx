import { createContext, useContext, useState } from 'react'
import { canchasIni, promoIni, seedReservas, calcularPrecio, hoy, HORAS } from '../data/mock'

const Ctx = createContext(null)
export const useReservas = () => useContext(Ctx)

export function ReservasProvider({ children }) {
  const [canchas, setCanchas] = useState(canchasIni)
  const [promo, setPromo] = useState(promoIni)
  const [reservas, setReservas] = useState(seedReservas)
  const [carrito, setCarrito] = useState([])

  const precio = (cancha, hora) => calcularPrecio(cancha, hora, promo)
  const mismo = (a, canchaId, fecha, hora) => a.canchaId === canchaId && a.fecha === fecha && a.hora === hora

  const ocupada = (canchaId, fecha, hora) => reservas.some(r => !r.cancelada && mismo(r, canchaId, fecha, hora))
  const pasada = (fecha, hora) => fecha < hoy() || (fecha === hoy() && hora <= new Date().getHours())
  const enCarrito = (canchaId, fecha, hora) => carrito.some(i => mismo(i, canchaId, fecha, hora))
  const libre = (canchaId, fecha, hora) => !ocupada(canchaId, fecha, hora) && !pasada(fecha, hora)

  const alternarCarrito = (canchaId, fecha, hora) =>
    setCarrito(c => c.some(i => mismo(i, canchaId, fecha, hora))
      ? c.filter(i => !mismo(i, canchaId, fecha, hora))
      : [...c, { canchaId, fecha, hora }])

  const ocupacion = (canchaId, fecha) =>
    reservas.filter(r => !r.cancelada && r.canchaId === canchaId && r.fecha === fecha).length / HORAS.length

  function confirmar(cliente) {
    const base = 1000 + reservas.length
    const nuevas = carrito.map((it, i) => {
      const c = canchas.find(x => x.id === it.canchaId)
      return { id: `R-${base + i + 1}`, ...it, cliente, total: precio(c, it.hora).total, pagado: 0, cancelada: false }
    })
    setReservas(r => [...r, ...nuevas])
    setCarrito([])
    return nuevas
  }

  const registrarPago = (id, monto) =>
    setReservas(r => r.map(x => x.id === id ? { ...x, pagado: Math.min(x.total, x.pagado + monto) } : x))
  const cancelar = id => setReservas(r => r.map(x => x.id === id ? { ...x, cancelada: true } : x))
  const alternarCancha = id => setCanchas(c => c.map(x => x.id === id ? { ...x, activa: !x.activa } : x))

  return (
    <Ctx.Provider value={{
      canchas, promo, setPromo, reservas, carrito, precio, ocupada, pasada, libre, enCarrito,
      alternarCarrito, ocupacion, confirmar, registrarPago, cancelar, alternarCancha,
    }}>
      {children}
    </Ctx.Provider>
  )
}
