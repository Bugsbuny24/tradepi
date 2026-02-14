// lib/admin.ts
import { createClient } from '@/lib/supabase'

export async function isUserAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  return !!admin
}
