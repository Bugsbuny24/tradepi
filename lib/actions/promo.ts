// lib/actions/promo.ts
import { createClient } from '@/lib/supabase/server' // Eksik olan mühür tam olarak bu!

export async function redeemPromoCode(userId: string, inputCode: string) {
  const supabase = createClient()

  // 1. Kodu kontrol et
  const { data: codeData, error: codeError } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', inputCode.toUpperCase())
    .single()

  if (codeError || !codeData) throw new Error('Geçersiz mühür kanka!')
  
  // ... kodun geri kalanı aynı kalıyor
}
