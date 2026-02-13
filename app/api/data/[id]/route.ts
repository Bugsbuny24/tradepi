import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: chart } = await supabase.from("charts").select("*").eq("id", params.id).single();

  if (chart?.is_locked) {
    return NextResponse.json({ error: "Analiz kilitli. Pi ödemesi gerekiyor." }, { status: 402 });
  }

  const { data: entries } = await supabase.from("data_entries").select("label, value").eq("chart_id", params.id);

  return NextResponse.json({
    title: chart.title,
    engine: "SnapScript v0",
    data: entries
  });
}
