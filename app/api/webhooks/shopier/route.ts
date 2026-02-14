import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Kanka burada lib'deki değil, doğrudan supabase-js kullanıyoruz çünkü Webhook server-side çalışır
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin yetkisi şart!
);

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const shopierData = Object.fromEntries(data);
    const { custom_params, status, total_amount } = shopierData;

    const { userId, targetId, type } = JSON.parse(custom_params as string);

    if (status !== 'success') return NextResponse.json({ ok: false });

    if (type === 'CREDIT_PACKAGE') {
      await supabase.rpc('add_credits_to_user', { p_user_id: userId, p_package_code: targetId });
    } 
    else if (type === 'CHART_PURCHASE') {
      const { data: chart } = await supabase.from('charts').select('user_id').eq('id', targetId).single();

      // Hata çözümü: Chart yoksa dur, varsa seller_id olarak kullan
      if (chart) {
        await supabase.from('chart_purchases').insert({
          chart_id: targetId,
          buyer_id: userId,
          seller_id: chart.user_id,
          amount_paid: total_amount
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Sync Error" });
  }
}
