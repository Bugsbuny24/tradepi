'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Kullanıcıya yeni bir bildirim gönderir.
 */
export async function sendNotification(userId: string, data: {
  type: string,
  title: string,
  message: string,
  link?: string
}) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, ...data }])

  if (error) throw new Error(error.message)
}

/**
 * Bildirimi okundu olarak işaretler.
 */
export async function markAsRead(notificationId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true }
}
