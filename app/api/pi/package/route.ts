import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const code = String(searchParams.get("code") ?? "").trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const { data, error } = await supabase
    .from("packages")
    .select("code,title,price_pi,is_active")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!data.is_active) return NextResponse.json({ error: "Package inactive" }, { status: 400 });

  return NextResponse.json({
    ok: true,
    package: { code: data.code, title: data.title, price_pi: Number(data.price_pi) },
  });
}
