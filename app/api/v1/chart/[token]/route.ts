import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin"; // Admin yetkisi şart
import { consumeCredits } from "@/lib/billing/consume";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  // 1) Admin Client'ı Başlat (Hata almamak için server-side)
  const admin = createAdminClient();
  const token = decodeURIComponent(params.token ?? "").trim();

  if (!token) {
    return NextResponse.json({ error: "TOKEN_REQUIRED" }, { status: 400 });
  }

  // 2) Token Çözümleme
  let tokenId: string | null = null;
  let chartId: string | null = null;
  let ownerId: string | null = null;

  if (isUuid(token)) {
    chartId = token; // Public direkt link
  } else {
    const prefix = token.slice(0, 8);
    const hash = sha256Hex(token);

    const { data: tData } = await admin
      .from("chart_tokens")
      .select("id, chart_id, user_id")
      .eq("token_prefix", prefix)
      .eq("token_hash", hash)
      .is("revoked_at", null)
      .maybeSingle();

    if (!tData) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 403 });
    
    tokenId = tData.id;
    chartId = tData.chart_id;
    ownerId = tData.user_id;
  }

  // 3) Grafik Verisini Çek
  const { data: chart } = await admin
    .from("charts")
    .select("*, data_entries(*), embed_settings(*)")
    .eq("id", chartId)
    .single();

  if (!chart) return NextResponse.json({ error: "CHART_NOT_FOUND" }, { status: 404 });

// ... üst kısımlar aynı ...

  // 4) Kredi Tüketimi (Snap-Logic Guard)
  try {
    const wantsNoWatermark = chart.embed_settings?.remove_watermark || false;
    
    // HATA BURADAYDI: Parametreleri obje içinde göndermemiz gerekiyor
    await consumeCredits({
      userId: ownerId || chart.user_id,
      meter: wantsNoWatermark ? "watermark_off_views_remaining" : "embed_view_remaining",
      amount: 1, // Her izlenmede 1 kredi düşer
      refType: "chart_view",
      refId: chartId,
      meta: { token_id: tokenId }
    });
    
  } catch (e: any) {
    return NextResponse.json(
      { 
        error: "TOPUP_REQUIRED", 
        message: "Kredi yetersiz.",
        meter: chart.embed_settings?.remove_watermark ? "watermark_off_views_remaining" : "embed_view_remaining"
      }, 
      { status: 402 }
    );
  }

// ... alt kısımlar aynı ...

