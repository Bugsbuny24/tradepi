"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasActiveMembership } from "@/lib/membership";

type Props = {
  userId: string | null; // Supabase user uuid (profiles.id)
  children: React.ReactNode;
};

export default function SellerGate({ userId, children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!userId) {
        router.replace("/pi/membership"); // veya login sayfan
        return;
      }

      const r = await fetch("/api/me/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const j = await r.json();
      const p = j?.profile;

      if (!r.ok || !p) {
        router.replace("/pi/membership");
        return;
      }

      // 1) satıcı değil -> satıcı başvuru sayfasına
      if (!p.is_seller) {
        router.replace("/apply-seller");
        return;
      }

      // 2) satıcı ama üyelik yok -> membership sayfasına
      if (!hasActiveMembership(p.membership_expires_at)) {
        router.replace("/pi/membership");
        return;
      }

      // 3) satıcı + üyelik var ama kategori seçilmemiş -> kategori seçime
      if (!p.selected_category_id) {
        router.replace("/categories");
        return;
      }

      setLoading(false);
    };

    run();
  }, [userId, router]);

  if (loading) {
    return <div style={{ padding: 16 }}>Kontrol ediliyor…</div>;
  }

  return <>{children}</>;
}
