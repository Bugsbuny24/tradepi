// app/actions/charts.ts
'use server'
import { createClient } from '@/lib/supabase' // Senin lib yapına göre

export async function createNewChart(formData: { title: string, type: string }) {
  const supabase = createClient()
  
  // 1. Kullanıcıyı al
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Giriş yapmalısın!")

  // 2. Kota kontrolü (user_quotas tablosundan)
  const { data: quota } = await supabase
    .from('user_quotas')
    .select('credits_remaining')
    .eq('user_id', user.id)
    .single()

  if (!quota || quota.credits_remaining <= 0) {
    return { error: "Yetersiz kredi!" }
  }

  // 3. Grafiği ekle
  const { data, error } = await supabase
    .from('charts')
    .insert({
      user_id: user.id,
      title: formData.title,
      chart_type: formData.type,
      is_public: false
    })
    .select()

  return { data, error }
}
