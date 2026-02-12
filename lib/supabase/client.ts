// Pi Browser'ın iframe kısıtlamalarını aşan özel client
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce', // Güvenlik ve yönlendirme için en sağlam yöntem
        detectSessionInUrl: true,
        persistSession: true
      }
    }
  )
