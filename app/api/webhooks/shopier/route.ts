import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyShopierSignature } from '@/lib/webhooks/shopier';
import { sendNotification } from '@/app/actions/notifications';

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  // 1. Güvenlik Kontrolü: İmza doğrulama
  const isValid = verifyShopierSignature(data, data.signature as string);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized signature' }, { status: 401 });
  }

  const orderId = data.platform_order_id as string;
  const userId = data.custom_params as string; // Checkout sırasında userId'yi buraya gömmüştük
  const status = data.status as string;

  if (status === 'success') {
    // 2. Krediyi tanımla (user_quotas tablosuna)
    // Örnek: Her başarılı ödemede +1000 kredi
    const { error } = await supabase.rpc('add_user_credits_secure', {
      p_user_id: userId,
      p_amount: 1000
    });

    if (!error) {
      // 3. Bildirim gönder
      await sendNotification(userId, {
        type: 'payment_success',
        title: 'Ödeme Onaylandı',
        message: 'Kredi paketiniz hesabınıza başarıyla tanımlandı.'
      });
    }
  }

  return NextResponse.json({ status: 'ok' });
}
