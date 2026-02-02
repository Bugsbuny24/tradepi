"use client";

import { useEffect, useState } from "react";
import { membershipActive } from "@/lib/membership";
import { ensurePiReady } from "@/lib/pi";
import { useRouter } from "next/navigation";

export default function SellerGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("Kontrol ediliyor…");

  useEffect(() => {
    const run = async () => {
      if (!ensurePiReady()) {
        setMsg("Pi SDK yok.");
        setLoading(false);
        return;
      }

      // Pi authenticate ile uid alın (hafif çözüm)
      let uid: string | null = null;
      try {
        const auth = await window.Pi.authenticate(["username"], () => {});
        uid = auth?.user?.uid || null;
      } catch {
        uid = null;
      }

      if (!uid) {
        router.replace("/");
        return;
      }

      const r = await fetch("/api/me/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pi_uid: uid }),
      });

      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.profile) {
        router.replace("/");
        return;
      }

      const p = j.profile;

      if (!p.is_seller) {
        router.replace("/apply-seller");
        return;
      }

      if (!membershipActive(p.membership_expires_at)) {
        router.replace("/pi/membership");
        return;
      }

      if (!p.selected_category_id) {
        router.replace("/categories");
        return;
      }

      setLoading(false);
    };

    run();
  }, [router]);

  if (loading) return <div style={{ padding: 16 }}>{msg}</div>;
  return <>{children}</>;
}
