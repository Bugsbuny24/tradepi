import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { paymentId, txid, intentId } = await req.json();

    if (!paymentId || !txid || !intentId) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      console.error("❌ PI_API_KEY not configured!");
      return NextResponse.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 1. Pi Server'dan payment durumunu doğrula
    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
        },
      }
    );

    if (!piResponse.ok) {
      console.error("❌ Pi API error:", await piResponse.text());
      return NextResponse.json(
        { ok: false, error: "Failed to verify payment with Pi" },
        { status: 500 }
      );
    }

    const payment = await piResponse.json();
    console.log("✅ Payment verified from Pi:", payment);

    // 2. Payment durumunu kontrol et
    if (payment.status?.developer_completed) {
      console.log("⚠️ Payment already completed");
    }

    if (payment.transaction?.txid !== txid) {
      console.error("❌ TXID mismatch!");
      return NextResponse.json(
        { ok: false, error: "Transaction ID mismatch" },
        { status: 400 }
      );
    }

    // 3. Purchase intent'i bul
    const supabase = createClient();
    const { data: intent, error: intentError } = await supabase
      .from("purchase_intents")
      .select("*")
      .eq("id", intentId)
      .single();

    if (intentError || !intent) {
      console.error("❌ Intent not found:", intentError);
      return NextResponse.json(
        { ok: false, error: "Purchase intent not found" },
        { status: 404 }
      );
    }

    // 4. Pi Server'a complete gönder
    const completeResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txid: txid,
        }),
      }
    );

    if (!completeResponse.ok) {
      const errorText = await completeResponse.text();
      console.error("❌ Pi complete error:", errorText);
      
      // Eğer zaten complete edilmişse devam et
      if (!errorText.includes("already completed")) {
        return NextResponse.json(
          { ok: false, error: "Failed to complete payment on Pi" },
          { status: 500 }
        );
      }
    }

    console.log("✅ Payment completed on Pi server");

    // 5. Purchase'ı veritabanına kaydet
    const { error: purchaseError } = await supabase
      .from("pi_purchases")
      .insert({
        user_id: intent.user_id,
        package_code: intent.package_code,
        amount_pi: intent.amount_pi,
        quota_granted: 0, // packages tablosundan alınacak
        raw: payment,
      });

    if (purchaseError) {
      console.error("❌ Purchase kayıt hatası:", purchaseError);
    }

    // 6. Purchase intent'i completed yap
    await supabase
      .from("purchase_intents")
      .update({
        status: "completed",
        txid: txid,
        decided_at: new Date().toISOString(),
      })
      .eq("id", intentId);

    // 7. Package grants'i kullanıcıya ver
    const { data: packageData } = await supabase
      .from("packages")
      .select("grants")
      .eq("code", intent.package_code)
      .single();

    if (packageData?.grants) {
      // Kullanıcının quotalarını artır
      const grants = packageData.grants as Record<string, number>;
      
      for (const [key, value] of Object.entries(grants)) {
        // user_quotas tablosunu güncelle
        const { error: quotaError } = await supabase.rpc(
          "increment_user_quota",
          {
            p_user_id: intent.user_id,
            p_quota_key: key,
            p_amount: value,
          }
        );

        if (quotaError) {
          console.error(`❌ Quota güncelleme hatası (${key}):`, quotaError);
        }
      }

      console.log("✅ User quotas updated");
    }

    // 8. Pi wallet güncelle
    await supabase.rpc("update_pi_wallet", {
      p_user_id: intent.user_id,
      p_amount: intent.amount_pi,
      p_type: "spent",
    });

    return NextResponse.json({
      ok: true,
      paymentId,
      txid,
      status: "completed",
    });
  } catch (error: any) {
    console.error("❌ Verification endpoint error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
