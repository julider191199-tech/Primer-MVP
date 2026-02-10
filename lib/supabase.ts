import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ozlddofurkuojjxfqus.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bGRkb2Z1cmx4b3VqanhxZnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMjQxNzcsImV4cCI6MjA1MzYwMDE3N30.7FaS5HhDQX0cGYZJJzGJBhTdOBmX2JG5ROaYcMGJ1t0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
