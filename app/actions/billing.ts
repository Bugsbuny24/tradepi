'use server'

import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function createCheckoutIntent(formData: FormData) {
  const supabase = createClient()
  const package_code = formData.get('package_code') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Veritabanından Shopier URL'ini çek
  const { data: pkg, error } = await supabase
    .from('packages')
    .select('shopier_url, price_try, code')
    .eq('code', package_code)
    .single()

  if (error || !pkg?.shopier_url) {
    return { error: "Paket bulunamadı!" }
  }

  // 2. Takip kaydı oluştur
  await supabase.from('checkout_intents').insert({
    user_id: user.id,
    package_code: pkg.code,
    amount: pkg.price_try,
    status: 'pending',
    provider: 'shopier'
  })

  // 3. DOĞRUDAN SHOPIER'E UÇUR
  redirect(pkg.shopier_url)
}
