import { createClient } from '@/lib/supabase/server';

/**
 * Kullanıcının yeterli kredisi olup olmadığını kontrol eder.
 */
export async function hasEnoughCredits(userId: string, requiredAmount: number = 1) {
  const supabase = createClient();

  // ❌ HATALI: .from('profiles').select('credits')
  // ✅ DOĞRU: user_quotas tablosu kullanımı
  const { data, error } = await supabase
    .from('user_quotas')
    .select('credits_remaining')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;

  return data.credits_remaining >= requiredAmount;
}
