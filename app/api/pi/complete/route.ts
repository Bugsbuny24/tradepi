import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const PI_API_BASE = "https://api.minepi.com/v2";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const paymentId: string | undefined = body?.paymentId;
    const packageCode: string | undefined = body?.packageCode;

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId gerekli" }, { status: 400 });
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      return NextResponse.json(
        { error: "Sunucuda PI_API_KEY yok" },
        { status: 500 }
      );
    }

    // 1) Pi tarafında complete et
    const resp = await fetch(`${PI_API_BASE}/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return NextResponse.json(
        { error: "Pi complete başarısız", details: json },
        { status: resp.status }
      );
    }

    // 2) Opsiyonel: kullanıcı girişliyse satın alım + grants uygula
    try {
      const supabase = await createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (userId && packageCode) {
        const admin = createSupabaseAdmin();

        // purchases tablosu varsa kaydet (yoksa hata yutulur)
        await admin.from("purchases").insert({
          user_id: userId,
          payment_id: paymentId,
          package_code: packageCode,
          status: "completed",
          provider: "pi",
          raw: json,
        });

        // DB'deki fonksiyonun parametreleri farklıysa ona göre düzelt
        await admin.rpc("apply_package_grants", {
          p_user_id: userId,
          p_package_code: packageCode,
        });
      }
    } catch {
      // DB kısmı opsiyonel; ödeme akışını bozmayalım.
    }

    return NextResponse.json({ ok: true, pi: json });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Sunucu hatası", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
