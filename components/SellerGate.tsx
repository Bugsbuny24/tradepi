"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SellerGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();
      const uid = data?.user?.id;

      if (error || !uid) {
        setMsg("Giriş yok. Lütfen giriş yap.");
        setLoading(false);
        setOk(false);
        return;
      }

      // profile kontrol
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("is_seller,is_member,selected_category_id")
        .eq("id", uid)
        .single();

      if (pErr || !profile) {
        setMsg("Profil bulunamadı.");
        setLoading(false);
        setOk(false);
        return;
      }

      // MVP şartları: satıcı + üyelik + kategori
      const pass =
        !!profile.is_seller && !!profile.is_member && !!profile.selected_category_id;

      if (!pass) {
        setMsg("Satıcı paneli için: Satıcı + Üyelik + Kategori seçimi gerekli.");
        setOk(false);
      } else {
        setOk(true);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Kontrol ediliyor...</div>;

  if (!ok) {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>Seller Panel</h1>
        <p style={{ marginTop: 8, opacity: 0.85 }}>{msg}</p>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button onClick={() => router.push("/apply")} style={{ padding: 10, borderRadius: 10 }}>
            Satıcı Ol
          </button>
          <button onClick={() => router.push("/membership")} style={{ padding: 10, borderRadius: 10 }}>
            Üyelik
          </button>
          <button onClick={() => router.push("/categories")} style={{ padding: 10, borderRadius: 10 }}>
            Kategori Seç
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
