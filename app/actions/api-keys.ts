'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function createApiKey(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Oturum açman lazım kanka!')

  const scope = formData.get('scope') as string || 'General Key'
  
  // 1. Ham Token üret (Kullanıcıya sadece bir kez gösterilecek)
  const rawToken = `sl_${crypto.randomBytes(24).toString('hex')}`
  const tokenPrefix = rawToken.slice(0, 10)
  
  // 2. Token'ı hash'le (Veritabanında güvenli saklama)
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

  // 3. Veritabanına (chart_tokens tablosuna) yaz
  const { error } = await supabase
    .from('chart_tokens')
    .insert({
      user_id: user.id,
      token_hash: tokenHash,
      token_prefix: tokenPrefix,
      scope: scope,
      chart_id: null // Genel key olduğu için
    })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/api')
  // DİKKAT: Kullanıcıya rawToken'ı sadece şimdi gösterebiliriz!
  return { success: true, key: rawToken }
}
