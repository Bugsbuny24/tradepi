import { createClient } from '@/lib/supabase/server'

export async function hasCredits(minAmount: number = 1) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: quota } = await supabase
    .from('user_quotas') // profiles değil, user_quotas!
    .select('credits_remaining')
    .eq('user_id', user.id)
    .single()

  return (quota?.credits_remaining || 0) >= minAmount
}
