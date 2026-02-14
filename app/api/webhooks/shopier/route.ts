import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase bağlantısı
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // Shopier'den gelen JSON verisini oku
    const body = await req.json();
    const { platform_order_id, status, custom_params } = body;
    
    // Gönderdiğimiz user_id ve package_code'u çöz
    const { userId, packageCode } = JSON.parse(custom_params);

    if (status === 'success') {
      // 1. Ödeme kaydını güncelle
      await supabase
        .from('checkout_intents')
        .update({ status: 'completed', provider_ref: platform_order_id })
        .match({ user_id: userId, package_code: packageCode });

      // 2. Kredileri yükleyen RPC fonksiyonunu tetikle
      const { error: quotaError } = await supabase.rpc('add_credits_to_user', {
        p_user_id: userId,
        p_package_code: packageCode
      });

      if (quotaError) throw quotaError;

      return NextResponse.json({ message: 'Krediler başarıyla yüklendi' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Ödeme başarısız' }, { status: 400 });
  } catch (err) {
    console.error('Webhook Hatası:', err);
    return NextResponse.json({ message: 'Sunucu Hatası' }, { status: 500 });
  }
}
