"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Profile = {
  id: string;
  is_seller: boolean;
  is_member: boolean;
  membership_expires_at: string | null;
  selected_category_id: string | null;
};

export default function SellerGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setReason("");

        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userData?.user?.id) {
          setOk(false);
          setReason("Giriş yapmalısın.");
          return;
        }

        const uid = userData.user.id;

        const { data: p, error: pErr } = await supabase
          .from("profiles")
          .select("id,is_seller,is_member,membership_expires_at,selected_category_id")
          .eq("id", uid)
          .single();

        if (pErr || !p) {
          setOk(false);
          setReason("Profil bulunamadı.");
          return;
        }

        const profile = p as Profile;

        // üyelik süresi kontrolü (expires_at varsa ve geçmişse member false say)
        const expired =
          profile.membership_expires_at &&
          new Date(profile.membership_expires_at).getTime() < Date.now();

        const isMemberActive = profile.is_member && !expired;

        if (!profile.is_seller) {
          setOk(false);
          setReason("Satıcı modunu açmalısın.");
          return;
        }

        if (!isMemberActive) {
          setOk(false);
          setReason("Satıcı paneli için üyelik gerekiyor.");
          return;
        }

        if (!profile.selected_category_id) {
          setOk(false);
          setReason("Kategori seçmelisin.");
          return;
        }

        setOk(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Yükleniyor...</div>;

  if (!ok) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>Seller Panel</h1>
        <p style={{ opacity: 0.8, marginTop: 10 }}>{reason}</p>

        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          <a href="/seller/apply" style={btnStyle}>Satıcı Ol</a>
          <a href="/membership" style={btnStyle}>Üyelik</a>
          <a href="/categories" style={btnStyle}>Kategori Seç</a>
          <a href="/" style={btnStyle}>Ana Sayfa</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

const btnStyle: React.CSSProperties = {
  display: "block",
  padding: 14,
  border: "2px solid #111",
  borderRadius: 14,
  fontWeight: 900,
  textDecoration: "none",
  textAlign: "center",
};
