'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTableData(tableName: string) {
  const supabase = createClient()
  
  // Güvenlik: Önce admin miyiz?
  const { data: { user } } = await supabase.auth.getUser()
  const { data: isAdmin } = await supabase.from('admins').select('user_id').eq('user_id', user?.id).single()
  if (!isAdmin) throw new Error("Yetkisiz Erişim!")

  // Veriyi çek
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(100) // Sayfa kasmaması için şimdilik son 100 kayıt
    .order('created_at' in (data?.[0] || {}) ? 'created_at' : 'id', { ascending: false })

  if (error) {
    console.error(`${tableName} çekilirken hata:`, error.message)
    return []
  }

  return data || []
}
