'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function createCheckoutIntent(formData: FormData) {
  const supabase = createClient()
  const package_code = formData.get('package_code') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Paket bilgilerini doğrula
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('code', package_code)
    .single()

  if (!pkg) throw new Error("Geçersiz paket!")

  // 2. Checkout Intent oluştur (Şemandaki tabloya göre)
  const { data: intent, error } = await supabase
    .from('checkout_intents')
    .insert({
      user_id: user.id,
      package_code: pkg.code,
      amount: pkg.price_try,
      currency: 'TRY',
      provider: 'iyzico', // veya mock
      provider_ref: `order_${Math.random().toString(36).substring(7)}`,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error

  // 3. Burada gerçek ödeme sayfasına yönlendirme yapılır
  // Şimdilik başarı sayfasına yönlendirelim (Simülasyon)
  redirect(`/checkout/success?intent=${intent.id}`)
}
