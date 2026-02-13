import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { paymentId, intentId } = await req.json();

    if (!paymentId || !intentId) {
      return NextResponse.json(
        { ok: false, error: "Missing paymentId or intentId" },
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

    // 1. Pi Server'dan payment bilgisini çek
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
        { ok: false, error: "Failed to fetch payment from Pi" },
        { status: 500 }
      );
    }

    const payment = await piResponse.json();
    console.log("✅ Payment bilgisi Pi'den alındı:", payment);

    // 2. Purchase intent'i bul ve kontrol et
    const supabase = createClient();
    const { data: intent, error: intentError } = await supabase
      .from("purchase_intents")
      .select("*")
      .eq("id", intentId)
      .single();

    if (intentError || !intent) {
      console.error("❌ Intent bulunamadı:", intentError);
      return NextResponse.json(
        { ok: false, error: "Purchase intent not found" },
        { status: 404 }
      );
    }

    // 3. Payment tutarını kontrol et
    if (parseFloat(payment.amount) !== parseFloat(intent.amount_pi)) {
      console.error("❌ Tutar uyuşmazlığı!");
      return NextResponse.json(
        { ok: false, error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    // 4. Metadata kontrolü (opsiyonel ama önerilen)
    const metadata = payment.metadata;
    if (metadata?.intentId !== intentId) {
      console.warn("⚠️ Metadata uyuşmazlığı");
    }

    // 5. Pi Server'a approval gönder
    const approveResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!approveResponse.ok) {
      console.error("❌ Pi approval hatası:", await approveResponse.text());
      return NextResponse.json(
        { ok: false, error: "Failed to approve payment on Pi" },
        { status: 500 }
      );
    }

    console.log("✅ Payment approved on Pi server");

    // 6. Purchase intent'i güncelle
    await supabase
      .from("purchase_intents")
      .update({
        status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", intentId);

    return NextResponse.json({
      ok: true,
      paymentId,
      status: "approved",
    });
  } catch (error: any) {
    console.error("❌ Approval endpoint error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
