import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!admin) {
    // Admin değilse dashboard'a geri postala
    redirect('/dashboard')
  }

  return user
}
