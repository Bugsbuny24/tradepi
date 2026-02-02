"use client";

import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SellerGate from "@/components/SellerGate";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PackageForm = {
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  price: string; // numeric -> string input
  delivery_days: string;
  revisions: string;
};

export default function CreateGigPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");

  const [packages, setPackages] = useState<PackageForm[]>([
    { tier: 1, title: "", description: "", price: "", delivery_days: "3", revisions: "1" },
    { tier: 2, title: "", description: "", price: "", delivery_days: "5", revisions: "2" },
    { tier: 3, title: "", description: "", price: "", delivery_days: "7", revisions: "3" },
  ]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const canSave = useMemo(() => {
    if (!title.trim()) return false;
    if (!basePrice.trim()) return false;
    // paketlerde en az 1 fiyat dolu olsun
    const anyPkg = packages.some((p) => p.price.trim());
    return anyPkg;
  }, [title, basePrice, packages]);

  const setPkg = (tier: 1 | 2 | 3, key: keyof PackageForm, val: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.tier === tier ? { ...p, [key]: val } : p))
    );
  };

  const onSubmit = async () => {
    setMsg("");
    setSaving(true);

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (userErr || !uid) throw new Error("Giriş yok.");

      // seller profile'dan selected_category_id al
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("selected_category_id")
        .eq("id", uid)
        .single<{ selected_category_id: string | null }>();

      if (pErr) throw new Error(pErr.message);
      if (!profile?.selected_category_id) throw new Error("Kategori seçilmemiş.");

      // 1) gigs insert
      const { data: gig, error: gErr } = await supabase
        .from("gigs")
        .insert({
          seller_id: uid,
          category_id: profile.selected_category_id,
          title: title.trim(),
          description: description.trim() || null,
          base_price: Number(basePrice),
          status: "active",
          delivery_days: 3,
          revisions: 1,
        })
        .select("id")
        .single<{ id: string }>();

      if (gErr) throw new Error(gErr.message);
      if (!gig?.id) throw new Error("Gig oluşturulamadı.");

      // 2) gig_packages insert (dolu olanları bas)
      const rows = packages
        .filter((p) => p.price.trim())
        .map((p) => ({
          gig_id: gig.id,
          tier: p.tier,
          title: p.title.trim() || `Paket ${p.tier}`,
          description: p.description.trim() || null,
          price: Number(p.price),
          delivery_days: Number(p.delivery_days || "3"),
          revisions: Number(p.revisions || "1"),
        }));

      if (rows.length) {
        const { error: pkErr } = await supabase.from("gig_packages").insert(rows);
        if (pkErr) throw new Error(pkErr.message);
      }

      setMsg("✅ Gig oluşturuldu!");
      setTitle("");
      setDescription("");
      setBasePrice("");
    } catch (e: any) {
      setMsg(e?.message ?? "Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerGate>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>Gig Oluştur</h1>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Gig başlığı"
            style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Açıklama"
            rows={4}
            style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <input
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Base price (numeric)"
            inputMode="decimal"
            style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          />
        </div>

        <h2 style={{ marginTop: 18, fontSize: 18, fontWeight: 900 }}>Paketler (3 tier)</h2>

        <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
          {packages.map((p) => (
            <div key={p.tier} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Tier {p.tier}</div>

              <input
                value={p.title}
                onChange={(e) => setPkg(p.tier, "title", e.target.value)}
                placeholder={`Tier ${p.tier} başlık`}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
              />

              <textarea
                value={p.description}
                onChange={(e) => setPkg(p.tier, "description", e.target.value)}
                placeholder="Açıklama"
                rows={3}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              />

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={p.price}
                  onChange={(e) => setPkg(p.tier, "price", e.target.value)}
                  placeholder="Price"
                  inputMode="decimal"
                  style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
                <input
                  value={p.delivery_days}
                  onChange={(e) => setPkg(p.tier, "delivery_days", e.target.value)}
                  placeholder="Delivery days"
                  inputMode="numeric"
                  style={{ width: 140, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
                <input
                  value={p.revisions}
                  onChange={(e) => setPkg(p.tier, "revisions", e.target.value)}
                  placeholder="Revisions"
                  inputMode="numeric"
                  style={{ width: 120, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
              </div>

              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
                Not: price boşsa bu tier insert edilmez.
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={saving || !canSave}
          onClick={onSubmit}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            borderRadius: 12,
            fontWeight: 900,
            cursor: saving || !canSave ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
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
