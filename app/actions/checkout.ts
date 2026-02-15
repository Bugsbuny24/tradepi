'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function initiateCheckout(packageCode: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Oturum kapalı kanka!')

  // 1. Paket bilgilerini çek
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('code', packageCode)
    .single()

  if (!pkg) throw new Error('Paket bulunamadı!')

  // 2. Checkout Intent oluştur (Şemandaki checkout_intents tablosu)
  const { data: intent, error } = await supabase
    .from('checkout_intents')
    .insert({
      user_id: user.id,
      package_code: packageCode,
      amount: pkg.price_try,
      currency: 'TRY',
      provider: 'shopier', // Şemana göre provider zorunlu
      provider_ref: `ORDER-${Date.now()}`, // Geçici ref
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // 3. Shopier veya ilgili ödeme sayfasına yönlendir
  // Normalde burada ödeme linki generate edilir, şimdilik paketin shopier_url'ine atıyoruz
  return redirect(pkg.shopier_url || '/dashboard/store')
}
