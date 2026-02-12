"use server";

import { createClient } from "@/lib/supabase/server";

export async function createPaymentIntent(packageCode: string, amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Oturum kapalı kanka.");

  // Şemadaki checkout_intents tablosuna mühürle
  const { data, error } = await supabase
    .from("checkout_intents")
    .insert({
      user_id: user.id,
      package_code: packageCode,
      amount: amount,
      currency: "PI",
      status: "pending", // Beklemede
      provider: "pi_network"
    })
    .select()
    .single();

  if (error) throw error;
  return data.id; // Pi SDK'ya bu ID'yi paslayacağız
}
