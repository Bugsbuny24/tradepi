"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { crypto } from "crypto";

export async function saveChart(formData: { title: string, content: any, script: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  // 1. Grafiği Kaydet
  const { data: chart, error: chartErr } = await supabase
    .from("charts")
    .insert({
      owner_id: user.id,
      title: formData.title,
      design: formData.content, // JSON verisi
      source_code: formData.script, // SnapScript kodu
    })
    .select()
    .single();

  if (chartErr) throw chartErr;

  // 2. Grafiğe Özel Gizli Token Üret (Embed için)
  const token = Math.random().toString(36).substring(2, 15);
  
  await supabase.from("chart_tokens").insert({
    chart_id: chart.id,
    token_hash: token,
  });

  revalidatePath("/dashboard");
  return { success: true, token };
}
