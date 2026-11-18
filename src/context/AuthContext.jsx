import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, DEMO } from '../lib/supabase'
import { usuariosDemo } from '../data/mock'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [rol, setRol] = useState(null)
  const [cargando, setCargando] = useState(true)

  async function cargarRol(u) {
    if (!u) { setRol(null); return }
    const { data } = await supabase.from('perfiles').select('rol').eq('id', u.id).single()
    setRol(data?.rol ?? null)
  }

  useEffect(() => {
    if (DEMO) {
      const guardado = sessionStorage.getItem('demo-user')
      if (guardado) { const u = JSON.parse(guardado); setUser(u); setRol(u.rol) }
      setCargando(false)
      return
    }
    supabase.auth.getSession().then(async ({ data }) => {
      setUser(data.session?.user ?? null)
      await cargarRol(data.session?.user)
      setCargando(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      cargarRol(session?.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    if (DEMO) {
      const u = usuariosDemo.find(x => x.email === email && x.clave === password)
      if (!u) return { error: true }
      sessionStorage.setItem('demo-user', JSON.stringify(u))
      setUser(u); setRol(u.rol)
      return { error: null }
    }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function logout() {
    if (DEMO) { sessionStorage.removeItem('demo-user'); setUser(null); setRol(null); return }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, rol, cargando, login, logout, DEMO }}>
      {children}
    </AuthContext.Provider>
  )
}
