import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing:', { supabaseUrl, supabaseAnonKey })
}

export const supabase = createClient(
  supabaseUrl || 'https://rsunbimndlyghdslgvnm.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdW5iaW1uZGx5Z2hkc2xndm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODA0MDMsImV4cCI6MjA1NjI1NjQwM30.wzegXf9CfB6x3QACZyZ5JP3Os6Y_Dyp7CClXMJ8M_4s'
)

export default supabase