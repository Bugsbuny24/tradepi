'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createChartAction(formData: FormData) {
  const supabase = createClient()
  
  const title = formData.get('title') as string
  const chartType = formData.get('chart_type') as string
  const isPublic = formData.get('is_public') === 'true'

  // Artık JavaScript tarafında getQuota() ve updateQuota() yapmıyoruz.
  // Her şeyi tek seferde RPC üzerinden hallediyoruz.
  const { data, error } = await supabase.rpc('create_chart_secure', {
    p_title: title,
    p_chart_type: chartType,
    p_is_public: isPublic
  })

  if (error) {
    // Veritabanından gelen 'Yetersiz kredi' hatası buraya düşer.
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/widgets')
  return { success: true, chartId: data.chart_id }
}
