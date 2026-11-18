// Datos de demostración. En el paso 2 se reemplazan por tablas de Supabase.
export const HORAS = Array.from({ length: 14 }, (_, i) => 9 + i) // 9:00 a 22:00

export const hoy = () => new Date().toISOString().slice(0, 10)
export const sumaDias = (f, n) => {
  const d = new Date(f + 'T12:00:00'); d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
export const clp = n => '$' + Math.round(n).toLocaleString('es-CL')
export const fechaLarga = f =>
  new Date(f + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })

export const canchasIni = [
  { id: 1, nombre: 'Cancha 1', tipo: 'Fútbol 7', jugadores: 14, techada: true, iluminacion: true, superficie: 'Pasto sintético', base: 20000, popular: true, activa: true },
  { id: 2, nombre: 'Cancha 2', tipo: 'Fútbol 7', jugadores: 14, techada: false, iluminacion: true, superficie: 'Pasto sintético', base: 18000, activa: true },
  { id: 3, nombre: 'Cancha 3', tipo: 'Fútbol 5', jugadores: 10, techada: true, iluminacion: true, superficie: 'Pasto sintético', base: 15000, activa: true },
  { id: 4, nombre: 'Cancha 4', tipo: 'Pádel', jugadores: 4, techada: true, iluminacion: true, superficie: 'Cemento', base: 12000, activa: true },
]

export const promoIni = { nombre: 'Promo mañanas', pct: 20, desde: 9, hasta: 14, activa: true }

export function calcularPrecio(cancha, hora, promo) {
  const bruto = Math.round(cancha.base * (hora >= 18 ? 1.25 : 1)) // tarifa nocturna +25 %
  const conPromo = promo?.activa && hora >= promo.desde && hora < promo.hasta
  const descuento = conPromo ? Math.round(bruto * promo.pct / 100) : 0
  return { bruto, descuento, total: bruto - descuento, conPromo }
}

export function estadoReserva(r) {
  if (r.cancelada) return 'Cancelada'
  if (r.pagado >= r.total) return 'Pagada'
  if (r.pagado > 0) return 'Abonada'
  return 'Pendiente'
}

const h = hoy()
const mk = (n, canchaId, fecha, hora, nombre, telefono, frac = 0) => {
  const c = canchasIni.find(x => x.id === canchaId)
  const total = calcularPrecio(c, hora, promoIni).total
  return { id: `R-${1000 + n}`, canchaId, fecha, hora, cliente: { nombre, telefono }, total, pagado: Math.round(total * frac), cancelada: false }
}
export const seedReservas = [
  mk(1, 1, h, 19, 'Matías Rojas', '912345678', 1),
  mk(2, 1, h, 20, 'Club Los Leones', '987654321', 0.5),
  mk(3, 2, h, 21, 'Camila Soto', '955512345', 0),
  mk(4, 3, h, 18, 'Pedro Núñez', '944433221', 1),
  mk(5, 4, h, 20, 'Fernanda Díaz', '933322110', 0),
  mk(6, 1, sumaDias(h, 1), 19, 'Diego Pérez', '922211009', 0),
  mk(7, 2, sumaDias(h, 1), 22, 'Los Cracks FC', '911100998', 0.5),
  mk(8, 3, sumaDias(h, 2), 20, 'Juan Pérez', '987001122', 0.5),
]

// Cuentas de prueba: una por cada rol del sistema
export const usuariosDemo = [
  { email: 'dueno@demo.cl', clave: 'demo1234', rol: 'dueno', nombre: 'Administrador' },
  { email: 'recepcion@demo.cl', clave: 'demo1234', rol: 'recepcionista', nombre: 'Recepción' },
  { email: 'cliente@demo.cl', clave: 'demo1234', rol: 'cliente', nombre: 'Juan Pérez', telefono: '987001122' },
]

export const nombreRol = { dueno: 'Administrador', recepcionista: 'Recepción', cliente: 'Cliente' }
export const inicioRol = { dueno: '/admin', recepcionista: '/recepcion', cliente: '/mis-reservas' }
