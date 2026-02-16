'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Kullanıcının tüm faturalarını getirir.
 */
export async function getMyInvoices() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('issued_at', { ascending: false })

  if (error) {
    console.error("Fatura çekme hatası:", error.message)
    return []
  }
  return data
}

/**
 * Ödeme başarılı olduğunda tetiklenecek fatura oluşturma fonksiyonu.
 * (Shopier Webhook içinden çağrılabilir)
 */
export async function createInvoice(userId: string, amount: number, intentId: string) {
  const supabase = createClient()
  
  const taxRate = 0.20; // %20 KDV
  const tax = amount * taxRate;
  const total = amount + tax;

  const { data, error } = await supabase
    .from('invoices')
    .insert([{
      user_id: userId,
      checkout_intent_id: intentId,
      amount: amount,
      tax: tax,
      total: total,
      status: 'paid'
    }])

  return { success: !error, error }
}
