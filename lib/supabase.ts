import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Key bulunamadı! .env dosyanı kontrol et.');
}

// 1. Tekil Bağlantı (Client Component'ler için hızlı erişim)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Fonksiyon Bağlantısı (Server Component'ler ve eski sayfaların için)
// Bu fonksiyonu çağırdığında yeni bir bağlantı üretir.
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Eski kodların 'createClient' ismini aradığı için, onu da dışarı açıyoruz:
export { createClient }; 
