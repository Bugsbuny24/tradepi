"use server";

import { createClient } from "@/lib/supabase/server";

export async function createFullChart(title: string, script: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Oturum kapalı kanka.");

  // 1. Şemadaki 'charts' tablosuna ana veriyi gir
  const { data: chart, error: chartError } = await supabase
    .from("charts")
    .insert({ user_id: user.id, title, chart_type: "snap_v0", is_public: true })
    .select().single();

  if (chartError) throw chartError;

  // 2. 'chart_scripts' tablosuna SnapScript kodunu mühürle
  await supabase.from("chart_scripts").insert({
    chart_id: chart.id,
    script: script
  });

  // 3. 'embed_settings' için varsayılan karanlık mod ayarını yap (Şemandaki kolonlara uygun)
  await supabase.from("embed_settings").insert({
    chart_id: chart.id,
    dark_mode: true,
    is_public: true,
    analytics_enabled: true
  });

  return chart.id;
}
