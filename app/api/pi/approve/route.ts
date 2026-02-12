import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { paymentId, intentId } = await req.json();
  const supabase = await createClient();

  // Şemadaki checkout_intents tablosunu güncelle
  const { error } = await supabase
    .from("checkout_intents")
    .update({ 
      provider_ref: paymentId, 
      status: "approved_by_server" 
    })
    .eq("id", intentId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ status: "approved" });
}
