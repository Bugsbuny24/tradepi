'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function bulkUploadData(chartId: string, entries: { label: string, value: number }[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Oturum aç kanka!')

  // 1. Önce o grafiğe ait eski verileri temizleyelim (Opsiyonel: Üzerine yazma mantığı)
  await supabase.from('data_entries').delete().eq('chart_id', chartId)

  // 2. Yeni verileri sort_order ekleyerek hazırlayalım
  const dataToInsert = entries.map((entry, index) => ({
    chart_id: chartId,
    label: entry.label,
    value: entry.value,
    sort_order: index,
  }))

  // 3. Toplu Insert (Bulk Insert)
  const { error } = await supabase.from('data_entries').insert(dataToInsert)

  if (error) {
    console.error('Bulk upload hatası:', error.message)
    return { error: 'Veriler yüklenemedi!' }
  }

  revalidatePath(`/dashboard/charts/${chartId}`)
  return { success: true }
}

