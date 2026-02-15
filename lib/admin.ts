import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log("❌ Kullanıcı yok, Login'e atılıyor.")
    redirect('/auth')
  }

  console.log("🔍 Admin kontrolü yapılıyor. User ID:", user.id)

  const { data: admin, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error("🔥 Supabase Hatası:", error.message)
  }

  if (!admin) {
    console.log("⛔ Admin kaydı bulunamadı! Dashboard'a postalanıyor.")
    redirect('/dashboard') // İşte seni burası atıyor!
  }

  console.log("✅ Admin onayı başarılı. Hoş geldin Patron.")
  return user
}
