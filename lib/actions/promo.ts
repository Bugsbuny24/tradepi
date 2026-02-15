// lib/actions/promo.ts
export async function redeemPromoCode(userId: string, inputCode: string) {
  const supabase = createClient()

  // 1. Kodu kontrol et
  const { data: codeData, error: codeError } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', inputCode.toUpperCase())
    .single()

  if (codeError || !codeData) throw new Error('Geçersiz mühür kanka!')
  if (codeData.current_uses >= codeData.max_uses) throw new Error('Bu kodun kullanım limiti doldu.')

  // 2. Kullanıcı daha önce kullanmış mı bak
  const { data: alreadyUsed } = await supabase
    .from('promo_redemptions')
    .select('*')
    .eq('user_id', userId)
    .eq('code_id', codeData.id)
    .single()

  if (alreadyUsed) throw new Error('Bu ödülü zaten mühürlemişsin kanka.')

  // 3. Krediyi yükle ve kaydı mühürle (RPC kullanmak daha güvenli olur)
  const { error: redeemError } = await supabase.rpc('apply_promo_code', {
    target_user_id: userId,
    target_code_id: codeData.id,
    reward: codeData.reward_credits
  })

  return { success: true, reward: codeData.reward_credits }
}
