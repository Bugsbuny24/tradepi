import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers' // Mühür: Cookie çağırmak sayfayı dinamik yapar

export async function checkAdmin() {
  const cookieStore = cookies() // Bunu buraya koymak Next.js'i uyandırır
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Admin tablosuna soruyoruz
  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!admin) {
    // Kanka loglara bakmak için buraya console.log ekle
    console.log("⛔ Admin değil veya Cache sorunu var. User ID:", user.id)
    redirect('/dashboard')
  }

  return user
}
