"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ApplySellerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const becomeSeller = async () => {
    setMsg("");
    setLoading(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user?.id) throw new Error("Giriş yok (Supabase oturumu yok).");

      const uid = userData.user.id;

      const { error } = await supabase
        .from("profiles")
        .update({ is_seller: true })
        .eq("id", uid);

      if (error) throw new Error(error.message);

      setMsg("✅ Satıcı moduna geçtin. Üyelik ekranına yönlendiriyorum…");
      setTimeout(() => router.push("/pi/membership"), 700);
    } catch (e: any) {
      setMsg(e?.message ?? "İşlem başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900 }}>Satıcı Ol</h1>
      <p style={{ opacity: 0.85, marginTop: 8 }}>
        Satıcı paneline erişim için yıllık üyelik gerekir. Alıcı olarak gezmek ücretsizdir.
      </p>

      <button
        onClick={becomeSeller}
        disabled={loading}
        style={{
          marginTop: 14,
          width: "100%",
          padding: 12,
          borderRadius: 12,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        {loading ? "İşleniyor…" : "Satıcı Modunu Aç"}
      </button>

      {msg ? (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: "#f7f7f7" }}>
          {msg}
        </div>
      ) : null}
    </div>
  );
}
