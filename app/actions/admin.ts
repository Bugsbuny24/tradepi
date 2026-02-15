'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTableData(tableName: string) {
  const supabase = createClient()
  
  // 1. Admin kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Oturum bulunamadı")

  const { data: isAdmin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!isAdmin) throw new Error("Yetkisiz Erişim!")

  // 2. Veriyi çek (Hata veren karmaşık 'order' kısmını sildik)
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(100)

  if (error) {
    console.error(`❌ ${tableName} çekilirken hata:`, error.message)
    return []
  }

  return data || []
}

// Kredi ekleme butonun için lazım olacak fonksiyonu da buraya sağlama alalım
export async function addCredits(userId: string, amount: number) {
  const supabase = createClient()
  
  // Mevcut krediyi bul
  const { data: quota } = await supabase
    .from('user_quotas')
    .select('credits_remaining')
    .eq('user_id', userId)
    .single()
    
  const newAmount = (quota?.credits_remaining || 0) + amount

  const { error } = await supabase
    .from('user_quotas')
    .update({ credits_remaining: newAmount })
    .eq('user_id', userId)

  if (!error) {
    revalidatePath('/admin')
  }
}
