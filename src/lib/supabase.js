import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sin claves reales el sistema funciona en modo demo (datos locales)
export const DEMO = !url || !key || url.includes('TU-PROYECTO')
export const supabase = DEMO ? null : createClient(url, key)
