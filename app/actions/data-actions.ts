'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function bulkUploadData(chartId: string, entries: { label: string, value: number }[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Yetkisiz erişim kanka!')

  // 1. Önce o grafiğe ait ESKİ verileri temizleyelim (Üzerine yazma mantığı)
  const { error: deleteError } = await supabase
    .from('data_entries')
    .delete()
    .eq('chart_id', chartId)

  if (deleteError) throw new Error('Eski veriler silinemedi.')

  // 2. Yeni verileri sort_order ekleyerek hazırlayalım
  const dataToInsert = entries.map((entry, index) => ({
    chart_id: chartId,
    label: entry.label,
    value: entry.value,
    sort_order: index,
  }))

  // 3. TOPLU INSERT (Bulk Insert - Performans için kritik)
  const { error: insertError } = await supabase
    .from('data_entries')
    .insert(dataToInsert)

  if (insertError) {
    console.error('Bulk upload hatası:', insertError.message)
    return { error: 'Veriler yüklenirken bir hata oluştu!' }
  }

  revalidatePath('/dashboard/data')
  revalidatePath(`/dashboard/charts/${chartId}`)
  return { success: true }
}
