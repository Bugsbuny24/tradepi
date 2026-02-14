import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  // 1. Shopier'den gelen verileri yakala
  const { platform_order_id, status, installation_id, custom_params } = req.body;
  
  // custom_params içinde gönderdiğimiz user_id ve package_code'u alıyoruz
  const { userId, packageCode } = JSON.parse(custom_params);

  if (status === 'success') {
    try {
      // 2. Veritabanında checkout_intent kaydını güncelle
      const { data: intent, error: intentError } = await supabase
        .from('checkout_intents')
        .update({ status: 'completed', provider_ref: platform_order_id })
        .eq('user_id', userId)
        .eq('package_code', packageCode)
        .select()
        .single();

      // 3. Kullanıcı kotalarını artır (Az önce yazdığımız SQL fonksiyonunu tetikler)
      // Veya doğrudan RPC çağrısı yap:
      const { error: quotaError } = await supabase.rpc('add_credits_to_user', {
        p_user_id: userId,
        p_package_code: packageCode
      });

      if (quotaError) throw quotaError;

      return res.status(200).send('OK');
    } catch (err) {
      console.error('Kredi yükleme hatası:', err);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.status(400).send('Payment Failed');
}
