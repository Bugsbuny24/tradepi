"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

type SaveChartInput = {
  title: string;
  content: any; // Designer output (JSON) - şimdilik DB'ye yazmıyoruz (schema'da kolon yok)
  script: string; // SnapScript - şimdilik DB'ye yazmıyoruz (schema'da kolon yok)
};

export async function saveChart(formData: SaveChartInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) throw new Error("Oturum açmanız gerekiyor.");

  // 1) charts tablosuna kayıt (schema: chart_type, is_public, title, user_id)
  const { data: chart, error: chartErr } = await supabase
    .from("charts")
    .insert({
      user_id: user.id,
      title: formData.title ?? null,
      chart_type: "custom", // istersen UI'dan gönderip buraya koyarız
      is_public: false,
    })
    .select()
    .single();

  if (chartErr) throw chartErr;

  // 2) embed için token üret + chart_tokens tablosuna yaz
  // token_hash alanına gerçek hash yerine token yazıyoruz (MVP).
  // İleride token'ı hashleyip DB'ye hash koyarız.
  const token = randomBytes(16).toString("hex"); // 32 karakter
  const tokenPrefix = token.slice(0, 10); // DB check: prefix len 10

  const { error: tokenErr } = await supabase.from("chart_tokens").insert({
    chart_id: chart.id,
    user_id: user.id,
    scope: "embed",
    token_hash: token,
    token_prefix: tokenPrefix,
    // expires_at, revoked_at opsiyonel
  });

  if (tokenErr) throw tokenErr;

  revalidatePath("/dashboard");

  return { success: true, chartId: chart.id, token };
}
