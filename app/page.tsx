"use client";

import { useState } from "react";
import { ensurePiReady } from "@/lib/pi";

export default function HomePage() {
  const [piUid, setPiUid] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const login = async () => {
    setMsg("");
    if (!ensurePiReady()) return setMsg("Pi SDK yok. Pi Browser içinde aç.");
    try {
      const auth = await window.Pi.authenticate(["username"], () => {});
      const uid = auth?.user?.uid || null;
      setPiUid(uid);
      setMsg(uid ? `✅ Login OK: ${uid}` : "Login başarısız.");
    } catch {
      setMsg("Login iptal/hata.");
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
      <h1>TradePiGloball V3 MVP</h1>

      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
        <button onClick={login} style={{ padding: 12, borderRadius: 12, fontWeight: 900 }}>
          Pi ile Giriş
        </button>

        <div style={{ marginTop: 10 }}>piUid: <b>{piUid ?? "-"}</b></div>
        {msg && <div style={{ marginTop: 10 }}>{msg}</div>}

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/apply-seller">Satıcı Ol</a>
          <a href="/pi/membership">Üyelik</a>
          <a href="/categories">Kategori Seç</a>
          <a href="/seller">Seller Panel</a>
        </div>
      </div>

      <p style={{ opacity: 0.7, marginTop: 12 }}>
        MVP: Alıcı ücretsiz. Satıcı paneli için yıllık 100 Pi üyelik + kategori seçimi şart.
      </p>
    </div>
  );
}
