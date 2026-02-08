import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeCredits } from "@/lib/billing/consume";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET(req: Request, { params }: { params: { token: string } }) {
  const admin = createAdminClient();
  const token = decodeURIComponent(params.token ?? "").trim();

  if (!token) return NextResponse.json({ error: "TOKEN_REQUIRED" }, { status: 400 });

  let tokenId: string | null = null;
  let chartId: string | null = null;
  let ownerId: string | null = null;

  // 1) Token çözümleme
  if (isUuid(token)) {
    chartId = token;
  } else {
    const prefix = token.slice(0, 8);
    const hash = sha256Hex(token);

    const { data: tData, error: tErr } = await admin
      .from("chart_tokens")
      .select("id, chart_id, user_id, revoked_at, expires_at, scope")
      .eq("token_prefix", prefix)
      .eq("token_hash", hash)
      .is("revoked_at", null)
      .maybeSingle();

    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });
    if (!tData) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 403 });
    if (tData.expires_at && new Date(tData.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 403 });
    }

    // scope kontrol (istersen daha esnek yaparız)
    if (tData.scope && !["api", "all", "read"].includes(String(tData.scope))) {
      return NextResponse.json({ error: "TOKEN_SCOPE_FORBIDDEN" }, { status: 403 });
    }

    tokenId = tData.id;
    chartId = tData.chart_id;
    ownerId = tData.user_id;
  }

  // 2) Chart + data + settings çek
  const { data: chart, error: chartErr } = await admin
    .from("charts")
    .select("*, data_entries(*), embed_settings(*)")
    .eq("id", chartId)
    .single();

  if (chartErr || !chart) return NextResponse.json({ error: "CHART_NOT_FOUND" }, { status: 404 });

  ownerId = ownerId ?? chart.user_id;

  // UUID direct kullanıyorsan public şart (sıkı güvenlik)
  if (isUuid(token)) {
    const isPublic = Boolean(chart.is_public) || Boolean(chart.embed_settings?.is_public);
    if (!isPublic) return NextResponse.json({ error: "NOT_PUBLIC" }, { status: 403 });
  }

  // 3) ✅ API kredisi düş
  try {
    await consumeCredits(admin, {
      userId: ownerId,
      meter: "api_call_remaining",
      amount: 1,
      refType: "api_call",
      refId: chartId!,
      meta: { token_id: tokenId },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "TOPUP_REQUIRED", message: e?.message || "Kredi yetersiz.", meter: "api_call_remaining" },
      { status: 402 }
    );
  }

  // 4) ✅ API analytics
  if (tokenId) {
    const { data: existing } = await admin
      .from("api_counters")
      .select("call_count")
      .eq("token_id", tokenId)
      .maybeSingle();

    if (existing) {
      await admin
        .from("api_counters")
        .update({
          call_count: (existing.call_count ?? 0) + 1,
          last_call_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("token_id", tokenId);
    } else {
      await admin.from("api_counters").insert({
        token_id: tokenId,
        chart_id: chartId,
        owner_id: ownerId,
        call_count: 1,
        last_call_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  // 5) SAF JSON
  return NextResponse.json({
    ok: true,
    chart,
  });
}
