import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://XXXX.supabase.co"
const supabaseKey = "PUBLIC_ANON_KEY"

export const supabase = createClient(supabaseUrl, supabaseKey)
