"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

function isMembershipActive(p: Profile | null) {
  if (!p) return false;
  if (!p.is_member) return false;
  if (!p.membership_expires_at) return false;
  return new Date(p.membership_expires_at).getTime() > Date.now();
}

export default function SellerGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("Kontrol ediliyor...");

  useEffect(() => {
    (async () => {
      setLoading(true);

      // 1) login var mı?
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;

      if (!uid) {
        setMsg("Giriş yapmalısın. Pi Login ile giriş yap.");
        setLoading(false);
        // istersen /login route'una at
        // router.push("/login");
        return;
      }

      // 2) profil çek
      const { data: p, error } = await supabase
        .from("profiles")
        .select("id,is_seller,is_member,membership_expires_at,selected_category_id")
        .eq("id", uid)
        .single();

      if (error || !p) {
        setMsg("Profil bulunamadı. (profiles kaydı yok)");
        setLoading(false);
        return;
      }

      // 3) satıcı mı?
      if (!p.is_seller) {
        setMsg("Bu sayfa sadece satıcılar için. Önce satıcı ol.");
        setLoading(false);
        router.push("/seller/apply");
        return;
      }

      // 4) kategori seçilmiş mi?
      if (!p.selected_category_id) {
        setMsg("Önce kategori seçmelisin.");
        setLoading(false);
        router.push("/categories");
        return;
      }

      // 5) üyelik aktif mi?
      if (!isMembershipActive(p)) {
        setMsg("Satıcı paneli için üyelik aktif olmalı.");
        setLoading(false);
        router.push("/membership");
        return;
      }

      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h2>Seller Gate</h2>
        <div style={{ opacity: 0.8, marginTop: 8 }}>{msg}</div>
      </div>
    );
  }

  return <>{children}</>;
                     }
