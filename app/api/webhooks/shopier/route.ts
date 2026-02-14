import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  const data = await req.formData();
  const shopier = Object.fromEntries(data);
  const { custom_params, status, total_amount } = shopier;

  // JSON parametreleri (userId, targetId, type)
  const { userId, targetId, type } = JSON.parse(custom_params as string);

  if (status !== 'success') return NextResponse.json({ ok: false });

  if (type === 'CREDIT_PACKAGE') {
    // 1. Kredi Paketi Yükleme (Örn: Mini Başlangıç)
    await supabase.rpc('add_credits_to_user', { p_user_id: userId, p_package_code: targetId });
  } 
  
  else if (type === 'MARKET_CHART') {
    // 2. Başkasının grafiğini satın alma
    const { data: chart } = await supabase.from('charts').select('user_id').eq('id', targetId).single();
    await supabase.from('chart_purchases').insert({
      chart_id: targetId,
      buyer_id: userId,
      seller_id: chart.user_id,
      amount_paid: total_amount
    });
    // Alıcının profilinde 'total_spent' güncelle
    await supabase.rpc('increment_total_spent', { uid: userId, amount: total_amount });
  }

  return NextResponse.json({ ok: true });
}
