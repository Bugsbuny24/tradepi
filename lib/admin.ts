import { createClient } from '@/lib/supabase/server'
// DİKKAT: redirect importunu kaldırdım!
// import { redirect } from 'next/navigation' 

export async function checkAdmin() {
  const supabase = createClient()
  
  // 1. Kullanıcıyı kontrol et
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("❌ HATA: Kullanıcı oturumu yok! (Auth User Null)")
  }

  // 2. Admin tablosuna bak (Log ekledim)
  console.log("🔍 Admin sorgulanıyor. User ID:", user.id)

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // 3. HATA VARSA YÖNLENDİRME YAPMA, EKRANA BAS!
  if (error) {
    throw new Error(`🔥 VERİTABANI HATASI: ${error.message} (Kod: ${error.code})`)
  }

  if (!admin) {
    throw new Error(`⛔ YETKİ YOK: Senin ID (${user.id}) 'admins' tablosunda bulunamadı!`)
  }

  return user
}
