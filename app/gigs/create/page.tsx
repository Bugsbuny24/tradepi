"use client";

import SellerGate from "@/components/SellerGate";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GigCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [basePrice, setBasePrice] = useState<number>(50);
  const [deliveryDays, setDeliveryDays] = useState<number>(3);
  const [revisions, setRevisions] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const createGig = async () => {
    setMsg("");
    setSaving(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (userErr || !uid) throw new Error("Giriş yok.");

      // profiles'tan category_id al
      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("selected_category_id")
        .eq("id", uid)
        .single();

      if (pErr) throw new Error(pErr.message);

      const categoryId = p?.selected_category_id ?? null;

      const { data: gig, error } = await supabase
        .from("gigs")
        .insert({
          seller_id: uid,
          category_id: categoryId,
          title,
          base_price: basePrice,
          delivery_days: deliveryDays,
          revisions,
          status: "active",
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);

      setMsg("✅ Gig oluşturuldu!");
      router.push(`/gigs/${gig.id}`);
    } catch (e: any) {
      setMsg(e?.message ?? "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerGate>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>Gig Oluştur</h1>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Başlık</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Logo tasarımı yaparım"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #eee" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Base Price</div>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #eee" }}
          />
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Teslim (gün)</div>
            <input
              type="number"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(Number(e.target.value))}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #eee" }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Revizyon</div>
            <input
              type="number"
              value={revisions}
              onChange={(e) => setRevisions(Number(e.target.value))}
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #eee" }}
            />
          </div>
        </div>

        <button
          disabled={saving || !title.trim()}
          onClick={createGig}
          style={{
            marginTop: 14,
            width: "100%",
            padding: 12,
            borderRadius: 12,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {saving ? "Kaydediliyor..." : "Oluştur"}
        </button>

        {msg ? (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: "#f7f7f7" }}>
            {msg}
          </div>
        ) : null}
      </div>
    </SellerGate>
  );
              }
