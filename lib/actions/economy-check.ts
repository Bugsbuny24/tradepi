// lib/actions/economy-check.ts
import { createClient } from '@/lib/supabase/client'

export async function hasCredits(minAmount: number = 1) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  return (profile?.credits || 0) >= minAmount
}
