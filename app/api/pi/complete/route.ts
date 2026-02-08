import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { piCompletePayment } from "@/lib/pi/pi-api";

export async function POST(req: Request) {
  // 1) kullanıcı login mi?
  const supabaseUser = await createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2) input
  const body = await req.json().catch(() => ({}));
  const paymentId = String(body.paymentId ?? "").trim();
  const txid = String(body.txid ?? "").trim();
  const package_code = String(body.package_code ?? "").trim();

  if (!paymentId || !txid || !package_code) {
    return NextResponse.json(
      { error: "Missing paymentId/txid/package_code" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // 3) paketi server’dan çek (client fiyatla oynayamasın)
  const { data: pkg, error: pkgErr } = await admin
    .from("packages")
    .select("id,code,title,price_pi,grants,is_active")
    .eq("code", package_code)
    .maybeSingle();

  if (pkgErr || !pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 400 });
  }
  if (!pkg.is_active) {
    return NextResponse.json({ error: "Package not active" }, { status: 400 });
  }

  try {
    // 4) Pi server “complete” → Pi doğrulaması burada oluyor (resmi akış)
    const dto = await piCompletePayment(paymentId, txid);

    // 5) amount check (dto yapısı değişebilir; güvenli okumaya çalış)
    const dtoAmount =
      Number(dto?.amount ?? dto?.payment?.amount ?? dto?.piResData?.amount ?? 0);

    const expectedAmount = Number(pkg.price_pi);

    if (!(dtoAmount > 0) || dtoAmount !== expectedAmount) {
      return NextResponse.json(
        { error: `Amount mismatch. expected=${expectedAmount} got=${dtoAmount}` },
        { status: 400 }
      );
    }

    // 6) DB: intent oluştur (txid unique zaten var → idempotent)
    // create_purchase_intent RPC senin projede zaten kullanılıyor.
    const { data: intent_id, error: intentErr } = await admin.rpc(
      "create_purchase_intent",
      {
        p_package_code: pkg.code,
        p_amount_pi: expectedAmount,
        p_txid: txid,
      }
    );

    if (intentErr) {
      // txid unique nedeniyle “zaten işlendi” olabilir.
      const msg = intentErr.message ?? "";
      if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("unique")) {
        return NextResponse.json({ ok: true, already_processed: true });
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // 7) DB: otomatik approve/grant (approve_purchase_intent RPC)
    const { error: approveErr } = await admin.rpc("approve_purchase_intent", {
      p_intent_id: String(intent_id),
      p_note: "auto-approved after Pi complete()",
    });

    if (approveErr) {
      return NextResponse.json(
        { error: approveErr.message ?? "Approve RPC failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, intent_id, dto });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Complete failed" },
      { status: 400 }
    );
  }
}
