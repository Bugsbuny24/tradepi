import { NextResponse } from 'next/server';
import { iyzico } from '@/lib/iyzico';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    return new Promise((resolve) => {
      iyzico.checkoutForm.retrieve({ token }, async (err, result) => {
        if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
          resolve(NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/market?status=failed`));
        } else {
          const [userId, packageId] = result.conversationId.split('_');

          // Paket bilgilerini ve haklarını çek
          const { data: pkg } = await supabase.from('packages').select('grants').eq('code', packageId).single();
          const { data: q } = await supabase.from('user_quotas').select('*').eq('user_id', userId).single();

          if (pkg) {
            await supabase.from('user_quotas').update({
              credits_remaining: (q.credits_remaining || 0) + pkg.grants.credits,
              embed_view_remaining: (q.embed_view_remaining || 0) + pkg.grants.views,
              updated_at: new Date()
            }).eq('user_id', userId);

            // SnapScript yetkisini profile işle
            await supabase.from('profiles').update({ role: pkg.grants.snapscript }).eq('id', userId);
          }

          resolve(NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/market?status=success`));
        }
      });
    });
  } catch (e) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/market?status=error`);
  }
}
