"use client";

import { useMemo, useState } from "react";
import SellerGate from "@/components/SellerGate";
import { createClient } from "@supabase/supabase-js";

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
  const [categoryId, setCategoryId] = useState(""); // opsiyonel (gigs.category_id nullable)
  const [status, setStatus] = useState<"draft" | "active">("draft");

  // gigs tablosunda base_price / delivery_days / revisions var; MVP’de bunları Basic’ten türetiyoruz
  const [packages, setPackages] = useState<PackageForm[]>([
    { tier: 1, title: "Basic", description: "", price: "10", delivery_days: "3", revisions: "1" },
    { tier: 2, title: "Standard", description: "", price: "25", delivery_days: "5", revisions: "2" },
    { tier: 3, title: "Premium", description: "", price: "50", delivery_days: "7", revisions: "3" },
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const basic = useMemo(() => packages.find((p) => p.tier === 1)!, [packages]);

  const setPkg = (tier: 1 | 2 | 3, patch: Partial<PackageForm>) => {
    setPackages((prev) => prev.map((p) => (p.tier === tier ? { ...p, ...patch } : p)));
  };

  const validate = () => {
    if (!title.trim()) return "Gig başlığı boş olamaz.";
    // numeric kontroller
    for (const p of packages) {
      if (!p.title.trim()) return `Paket başlığı boş olamaz (tier ${p.tier}).`;

      const price = Number(p.price);
      const dd = Number(p.delivery_days);
      const rev = Number(p.revisions);

      if (!Number.isFinite(price) || price <= 0) return `Fiyat hatalı (tier ${p.tier}).`;
      if (!Number.isInteger(dd) || dd <= 0) return `Teslim günü hatalı (tier ${p.tier}).`;
      if (!Number.isInteger(rev) || rev < 0) return `Revizyon hatalı (tier ${p.tier}).`;
    }

    // fiyat mantığı (Basic <= Standard <= Premium) – istersen kaldırırız
    const p1 = Number(packages[0].price);
    const p2 = Number(packages[1].price);
    const p3 = Number(packages[2].price);
    if (!(p1 <= p2 && p2 <= p3)) return "Fiyat sırası bozuk: Basic <= Standard <= Premium olmalı.";

    return "";
  };

  const onSubmit = async () => {
    setMsg("");
    const err = validate();
    if (err) return setMsg("❌ " + err);

    setLoading(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user?.id) throw new Error("Giriş yok. (Supabase auth session bulunamadı)");
      const uid = userData.user.id;

      // 1) gigs insert
      const base_price = Number(basic.price);
      const delivery_days = Number(basic.delivery_days);
      const revisions = Number(basic.revisions);

      const { data: gig, error: gigErr } = await supabase
        .from("gigs")
        .insert({
          seller_id: uid,
          category_id: categoryId ? categoryId : null,
          title: title.trim(),
          description: description.trim() ? description.trim() : null,
          base_price,
          delivery_days,
          revisions,
          status, // enum: gig_status (draft/active/paused/deleted)
        })
        .select("id")
        .single();

      if (gigErr) throw new Error(gigErr.message);
      if (!gig?.id) throw new Error("Gig oluşturuldu ama id dönmedi.");

      const gigId = gig.id as string;

      // 2) 3 package insert
      const payload = packages.map((p) => ({
        gig_id: gigId,
        tier: p.tier,
        title: p.title.trim(),
        description: p.description.trim() ? p.description.trim() : null,
        price: Number(p.price),
        delivery_days: Number(p.delivery_days),
        revisions: Number(p.revisions),
      }));

      const { error: pkgErr } = await supabase.from("gig_packages").insert(payload);
      if (pkgErr) throw new Error(pkgErr.message);

      setMsg("✅ Gig + 3 paket oluşturuldu! Seller Panel’e dönebilirsin.");
      // istersen otomatik yönlendirme:
      // window.location.href = "/seller/gigs";
    } catch (e: any) {
      setMsg("❌ " + (e?.message ?? "Bir hata oldu."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerGate>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900 }}>Gig Oluştur (3 Paket)</h1>
        <p style={{ opacity: 0.75, marginTop: 6 }}>
          Basic / Standard / Premium paketlerini gir, kaydedelim.
        </p>

        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          <label style={labelStyle}>Gig Başlığı</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Logo tasarımı yaparım" />

          <label style={labelStyle}>Açıklama (opsiyonel)</label>
          <textarea style={{ ...inputStyle, minHeight: 90 }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kısa açıklama..." />

          <label style={labelStyle}>Kategori ID (opsiyonel)</label>
          <input style={inputStyle} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} placeholder="uuid (boş bırakabilirsin)" />

          <label style={labelStyle}>Durum</label>
          <select style={inputStyle as any} value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="draft">draft (taslak)</option>
            <option value="active">active (yayında)</option>
          </select>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 22 }}>Paketler</h2>

        <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
          <PkgCard
            name="Basic"
            p={packages[0]}
            set={(patch) => setPkg(1, patch)}
          />
          <PkgCard
            name="Standard"
            p={packages[1]}
            set={(patch) => setPkg(2, patch)}
          />
          <PkgCard
            name="Premium"
            p={packages[2]}
            set={(patch) => setPkg(3, patch)}
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            marginTop: 18,
            width: "100%",
            padding: 14,
            borderRadius: 16,
            border: "2px solid #111",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {loading ? "Kaydediliyor..." : "Gig + 3 Paket Kaydet"}
        </button>

        {msg ? (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 12, background: "#f7f7f7" }}>
            {msg}
          </div>
        ) : null}

        <div style={{ marginTop: 16 }}>
          <a href="/seller" style={{ fontWeight: 900, textDecoration: "none" }}>
            ← Seller Panel
          </a>
        </div>
      </div>
    </SellerGate>
  );
}

function PkgCard({
  name,
  p,
  set,
}: {
  name: string;
  p: PackageForm;
  set: (patch: Partial<PackageForm>) => void;
}) {
  return (
    <div style={{ border: "2px solid #111", borderRadius: 16, padding: 14 }}>
      <div style={{ fontSize: 18, fontWeight: 900 }}>{name}</div>

      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        <label style={labelStyle}>Paket Başlığı</label>
        <input style={inputStyle} value={p.title} onChange={(e) => set({ title: e.target.value })} />

        <label style={labelStyle}>Paket Açıklama (opsiyonel)</label>
        <textarea style={{ ...inputStyle, minHeight: 70 }} value={p.description} onChange={(e) => set({ description: e.target.value })} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Fiyat</label>
            <input style={inputStyle} value={p.price} onChange={(e) => set({ price: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Teslim (gün)</label>
            <input style={inputStyle} value={p.delivery_days} onChange={(e) => set({ delivery_days: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Revizyon</label>
            <input style={inputStyle} value={p.revisions} onChange={(e) => set({ revisions: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontWeight: 800, fontSize: 13, opacity: 0.8 };
const inputStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  width: "100%",
  fontWeight: 700,
};
