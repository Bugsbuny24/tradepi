import { createClient as _createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 1. Singleton instance (Senin yeni sayfalarının kullandığı hazır bağlantı)
export const supabase = _createClient(supabaseUrl, supabaseAnonKey)

// 2. createClient fonksiyonu (Eski dashboard ve API dosyalarının ihtiyaç duyduğu fonksiyon)
// Eğer parametre verilmezse varsayılan değerleri kullanır, verilirse onları.
export const createClient = (url?: string, key?: string) => {
  return _createClient(url || supabaseUrl, key || supabaseAnonKey)
}
