'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function saveSnapScript(chartId: string, scriptContent: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Yetkisiz erişim kanka!')

  // Script'i kaydet veya güncelle (Upsert mantığı)
  const { error } = await supabase
    .from('chart_scripts')
    .upsert({
      chart_id: chartId,
      script: scriptContent,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Script hatası:', error.message)
    return { error: 'Script kaydedilemedi!' }
  }

  revalidatePath(`/dashboard/scripts`)
  return { success: true }
}
