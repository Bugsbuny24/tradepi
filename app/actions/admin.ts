'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Tüm kullanıcıları ve kredilerini getir
export async function getUsers() {
  const supabase = createClient()
  
  // Admin kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  const { data: isAdmin } = await supabase.from('admins').select('user_id').eq('user_id', user?.id).single()
  if (!isAdmin) return []

  // Profilleri ve Kotaları birleştirip çekiyoruz
  const { data: users } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      created_at,
      user_quotas (
        credits_remaining,
        tier
      )
    `)
    .order('created_at', { ascending: false })

  return users || []
}

// Kredi Ekleme Fonksiyonu (Patron Kıyağı)
export async function addCredits(userId: string, amount: number) {
  const supabase = createClient()
  
  // Önce mevcut krediyi bul
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

  if (error) return { error: error.message }
  
  revalidatePath('/admin')
  return { success: true }
}
