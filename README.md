# Reservas Canchas (React + Vite + Supabase)

## Ejecutar
1. `npm install`
2. Copia `.env.example` a `.env.local` y pon tus claves de Supabase (Project Settings → API)
3. `npm run dev` → http://localhost:5173

## Roles
- Público: `/` (reservar sin cuenta)
- `recepcionista` y `dueno`: `/recepcion`
- `dueno`: `/admin`

El rol se lee de la tabla `perfiles` (id = auth.users.id, rol). Se crea en el paso 2 (esquema SQL).

## Deploy
Subir a GitHub e importar el repo en Vercel; agregar las dos variables VITE_ en Vercel.
