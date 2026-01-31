import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://YOURPROJECT.supabase.co"
const supabaseKey = "YOUR-ANON-KEY"

export const supabase = createClient(supabaseUrl, supabaseKey)
