import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pltfakpwuottsnicqbbf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdGZha3B3dW90dHNuaWNxYmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MzIwNjEsImV4cCI6MjA5MTUwODA2MX0.M7XKsEcQzfSkWuvJergh1soSsqm7QOSC8fAsahcGF0E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
