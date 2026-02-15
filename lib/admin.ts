import { createClient } from '@/lib/supabase/server'

export async function checkAdmin() {
  const supabase = createClient()
  
  // 1. Kullanıcıyı auth sisteminden al
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("❌ OTURUM HATASI: Giriş yapmamış görünüyorsun. Lütfen önce giriş yap.")
  }

  // 2. Admin tablosunu sorgula
  // .single() kullanmıyoruz çünkü kayıt yoksa direkt uygulama hatası veriyor.
  // .select() ile alıp boş olup olmadığını biz kontrol edeceğiz.
  const { data: adminList, error: dbError } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)

  // 3. Veritabanı bağlantı hatası varsa bas
  if (dbError) {
    throw new Error(`🔥 VERİTABANI HATASI: ${dbError.message} (Kod: ${dbError.code})`)
  }

  // 4. Liste boşsa yani bu ID admin tablosunda yoksa bas
  if (!adminList || adminList.length === 0) {
    throw new Error(`⛔ YETKİ REDDEDİLDİ: Senin ID (${user.id}) admin listesinde kayıtlı değil. Veritabanından 'admins' tablosunu kontrol et patron!`)
  }

  // 5. Her şey tamamsa kullanıcıyı dön
  return user
}
