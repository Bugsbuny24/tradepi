"use client";

import { useEffect, useState } from "react";
import { ensurePiReady } from "@/lib/pi";

type Cat = { id: string; name: string; parent_id: string | null };

export default function CategoriesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/me/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ping: true }) })
      .catch(() => {});
  }, []);

  useEffect(() => {
    (async () => {
      // categories read_all policy var -> anon ile bile çekilebilir ama MVP’de api ile de yapabilirsin.
      const r = await fetch("/api/me/profile?categories=1"); // demo amaçlı yok, istersen direkt supabase clientla çekersin.
      r.ok;
    })();
  }, []);

  const selectCategory = async (categoryId: string) => {
    setMsg("");
    if (!ensurePiReady()) return setMsg("Pi SDK yok.");
    const auth = await window.Pi.authenticate(["username"], () => {});
    const uid = auth?.user?.uid;
    if (!uid) return setMsg("Login yok.");

    const r = await fetch("/api/me/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pi_uid: uid, selected_category_id: categoryId }),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setMsg(j?.error || "Kategori yazılamadı");

    setMsg("✅ Kategori seçildi.");
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h2>Kategori Seç</h2>
      <p style={{ opacity: 0.75 }}>Demo: burada category listesi gösterilecek.</p>

      <button
        onClick={() => selectCategory("00000000-0000-0000-0000-000000000000")}
        style={{ padding: 12, borderRadius: 12, fontWeight: 900 }}
      >
        (Demo) Örnek kategori seç
      </button>

      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
    </div>
  );
}
