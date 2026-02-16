'use server'

import { createClient } from '@/lib/supabase/server'
import { generateSecureApiKey } from '@/lib/api-keys'
import { revalidatePath } from 'next/cache'

export async function createApiKeyAction(name: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Yetkisiz erişim' }

  const { fullKey, hash, prefix } = generateSecureApiKey()

  const { error } = await supabase
    .from('chart_tokens')
    .insert([{
      user_id: user.id,
      name: name,
      token_hash: hash,
      token_prefix: prefix,
      scope: 'read_write'
    }])

  if (error) return { error: error.message }

  revalidatePath('/dashboard/developer')
  return { success: true, fullKey } // Anahtarı sadece burada döndürüyoruz
}

export async function revokeApiKey(tokenId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('chart_tokens')
    .delete()
    .eq('id', tokenId)

  revalidatePath('/dashboard/developer')
  return { success: !error }
}
