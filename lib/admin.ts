import { createClient } from '@/lib/supabase/server'
// redirect'i kaldırdım, hata fırlatacağız
// import { redirect } from 'next/navigation' 

export async function checkAdmin() {
  const supabase = createClient()
  
  // 1. Kullanıcı var mı?
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("❌ HATA: Kullanıcı girişi yok görünüyorsun! (Auth User Yok)")
  }

  // 2. Admin tablosunu sorgula
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*') // Tüm sütunları çek
    .eq('user_id', user.id)
    .single()

  // 3. HATA VARSA YÖNLENDİRME, EKRANA BAS!
  if (error) {
    throw new Error(`🔥 SUPABASE HATASI: ${error.message} (Senin ID: ${user.id})`)
  }

  if (!admin) {
    throw new Error(`⛔ LİSTEDE YOKSUN: Senin ID (${user.id}) admins tablosunda bulunamadı!`)
  }

  // Her şey yolundaysa kullanıcıyı dön
  return user
}
