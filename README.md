# Reservas Canchas (React + Vite + Supabase)

**Demo publicada:** https://reservas-canchas-delta.vercel.app

## Ejecutar
1. `npm install`
2. Copia `.env.example` a `.env.local` y pon tus claves de Supabase (Project Settings → API)
3. `npm run dev` → http://localhost:5173

## Roles y cuentas de prueba (modo demo)

| Rol | Usuario | Contraseña | Acceso |
|-----|---------|------------|--------|
| Administrador (`dueno`) | dueno@demo.cl | demo1234 | `/admin`, `/recepcion`, `/` |
| Recepción (`recepcionista`) | recepcion@demo.cl | demo1234 | `/recepcion`, `/` |
| Cliente (`cliente`) | cliente@demo.cl | demo1234 | `/mis-reservas`, `/` |

También se puede reservar en `/` sin iniciar sesión (solo nombre y teléfono).

El rol se lee de la tabla `perfiles` (id = auth.users.id, rol). Se crea en el paso 2 (esquema SQL).

## Deploy
Subir a GitHub e importar el repo en Vercel; agregar las dos variables VITE_ en Vercel.
