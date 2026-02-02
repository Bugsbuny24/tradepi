"use client";

import { useState } from "react";
import { ensurePiReady } from "@/lib/pi";

export default function ApplySellerPage() {
  const [msg, setMsg] = useState("");

  const becomeSeller = async () => {
    setMsg("");
    if (!ensurePiReady()) return setMsg("Pi SDK yok.");

    const auth = await window.Pi.authenticate(["username"], () => {});
    const uid = auth?.user?.uid;
    if (!uid) return setMsg("Login yok.");

    const r = await fetch("/api/seller/become", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pi_uid: uid }),
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setMsg(j?.error || "Hata");
    setMsg("✅ Satıcı moduna geçtin. Şimdi üyelik al.");
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h2>Satıcı Ol</h2>
      <p style={{ opacity: 0.75 }}>Satıcı paneli için üyelik gereklidir (100 Pi / yıl).</p>
      <button onClick={becomeSeller} style={{ padding: 12, borderRadius: 12, fontWeight: 900 }}>
        Satıcı Modunu Aç
      </button>
      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
    </div>
  );
}
