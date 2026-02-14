'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createChartAction(formData: FormData) {
  const supabase = createClient()
  const title = formData.get('title') as string
  const chart_type = formData.get('chart_type') as string

  // 1. Kullanıcı Kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açmanız gerekiyor.' }

  // 2. Kota (Kredi) Kontrolü
  const { data: quota, error: quotaError } = await supabase
    .from('user_quotas')
    .select('credits_remaining')
    .eq('user_id', user.id)
    .single()

  if (quotaError || !quota || quota.credits_remaining <= 0) {
    return { error: 'Yetersiz krediniz var. Lütfen paket yükseltin.' }
  }

  // 3. Grafik Oluşturma
  const { data: chart, error: chartError } = await supabase
    .from('charts')
    .insert({
      user_id: user.id,
      title,
      chart_type,
      is_public: false,
      is_locked: false
    })
    .select()
    .single()

  if (chartError) return { error: 'Grafik oluşturulurken bir hata oluştu.' }

  // 4. Krediyi 1 Azalt
  await supabase
    .from('user_quotas')
    .update({ credits_remaining: quota.credits_remaining - 1 })
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
  
  return { chartId: chart.id }
}
