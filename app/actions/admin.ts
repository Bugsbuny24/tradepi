'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const supabase = createClient()
  
  // 1. Kim olduğumuzu alalım
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // 2. Admin kontrolü (Single kullanmıyoruz ki patlamasın)
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)

  if (!adminCheck || adminCheck.length === 0) {
    console.log("Admin yetkisi yok");
    return []
  }

  // 3. Kullanıcıları çek (RLS kapalı olduğu için artık gelecekler)
  const { data: users, error } = await supabase
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

  if (error) {
    console.error("Kullanıcılar çekilemedi:", error.message)
    return []
  }

  return users || []
}

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
