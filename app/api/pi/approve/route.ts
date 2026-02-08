import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { piApprovePayment } from "@/lib/pi/pi-api";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const paymentId = String(body.paymentId ?? "").trim();

  if (!paymentId) {
    return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
  }

  try {
    const dto = await piApprovePayment(paymentId);
    return NextResponse.json({ ok: true, dto });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Approve failed" },
      { status: 400 }
    );
  }
}
