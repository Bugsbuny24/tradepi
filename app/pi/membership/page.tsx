"use client";

import { useState } from "react";
import { ensurePiReady } from "@/lib/pi";

export default function MembershipPage() {
  const [msg, setMsg] = useState("");

  const payYearly = async () => {
    setMsg("");
    if (!ensurePiReady()) return setMsg("Pi SDK yok.");

    const auth = await window.Pi.authenticate(["username"], () => {});
    const uid = auth?.user?.uid;
    if (!uid) return setMsg("Login yok.");

    const paymentData = {
      amount: 100,
      memo: "Seller membership yearly",
      metadata: { purpose: "seller_membership_yearly", pi_uid: uid },
    };

    const callbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        await fetch("/api/pi/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        const r = await fetch("/api/pi/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) return setMsg(j?.error || "Complete hata");

        setMsg("✅ Üyelik aktif. Bitiş: " + j.expires_at);
      },
      onCancel: () => setMsg("Ödeme iptal edildi."),
      onError: (e: any) => setMsg("Ödeme hatası: " + (e?.message ?? "")),
    };

    await window.Pi.createPayment(paymentData, callbacks);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h2>Yıllık Satıcı Üyeliği</h2>
      <p style={{ opacity: 0.75 }}>100 Pi / yıl</p>
      <button onClick={payYearly} style={{ padding: 12, borderRadius: 12, fontWeight: 900 }}>
        100 Pi ile Üye Ol
      </button>
      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
    </div>
  );
}
