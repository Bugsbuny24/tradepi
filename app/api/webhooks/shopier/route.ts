import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Kanka burada Service Role Key kullandığından emin ol!
);

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const shopier = Object.fromEntries(data);
    const { custom_params, status, total_amount } = shopier;

    // JSON parametreleri çöz
    const { userId, targetId, type } = JSON.parse(custom_params as string);

    if (status !== 'success') return NextResponse.json({ ok: false });

    if (type === 'CREDIT_PACKAGE') {
      // 1. Kredi Paketi Yükleme
      await supabase.rpc('add_credits_to_user', { p_user_id: userId, p_package_code: targetId });
    } 
    
    else if (type === 'MARKET_CHART') {
      // 2. Marketplace Grafik Satın Alma
      const { data: chart, error } = await supabase
        .from('charts')
        .select('user_id')
        .eq('id', targetId)
        .single();

      // HATA ÇÖZÜMÜ: Eğer grafik yoksa veya hata varsa işlemi durdur
      if (error || !chart) {
        console.error("Grafik bulunamadı veya hata oluştu:", error);
        return NextResponse.json({ ok: false, message: 'Chart not found' });
      }

      await supabase.from('chart_purchases').insert({
        chart_id: targetId,
        buyer_id: userId,
        seller_id: chart.user_id, // Artık hata vermez, yukarıda kontrol ettik
        amount_paid: total_amount
      });

      // Alıcının profilinde 'total_spent' güncellemesi (RPC yoksa normal update yapalım)
      await supabase
        .from('user_quotas')
        .update({ total_spent: total_amount }) // Bu mantığı ihtiyaca göre 'increment' yapabilirsin
        .eq('user_id', userId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ ok: false, error: "Internal Server Error" });
  }
}
