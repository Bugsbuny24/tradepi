'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Kullanıcının gelişmiş istatistiklerini getirir.
 */
export async function getDashboardAnalytics() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.rpc('get_advanced_analytics', {
    p_user_id: user.id
  })

  if (error) {
    console.error("Analitik hatası:", error.message)
    return null
  }

  return data
}
