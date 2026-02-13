import { createClient as _createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Eğer env dosyası okunamazsa hata fırlatmayalım, log düşelim (Build patlamasın)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('UYARI: Supabase URL veya Key bulunamadı!');
}

// 1. Hazır Tekil Bağlantı (import { supabase } from ...)
export const supabase = _createClient(supabaseUrl || '', supabaseAnonKey || '');

// 2. Fonksiyon Bağlantısı (import { createClient } from ...)
// Eski kodların argümansız çağırsa bile çalışacak!
export const createClient = () => {
  return _createClient(supabaseUrl || '', supabaseAnonKey || '');
};
