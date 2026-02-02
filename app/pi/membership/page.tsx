"use client";

import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

type PlanKey = "monthly" | "yearly";

const PLANS: Record<PlanKey, { title: string; pricePi: number; desc: string }> = {
  monthly: { title: "Aylık Üyelik", pricePi: 10, desc: "1 ay erişim + temel özellikler" },
  yearly: { title: "Yıllık Üyelik", pricePi: 100, desc: "12 ay erişim + en avantajlı fiyat" },
};

export default function MembershipPage() {
  const [piReady, setPiReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanKey>("yearly");
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  // Pi SDK hazır mı?
  useEffect(() => {
    const t = setInterval(() => {
      if (typeof window !== "undefined" && window.Pi) {
        setPiReady(true);
        clearInterval(t);
      }
    }, 300);
    return () => clearInterval(t);
  }, []);

  const selected = useMemo(() => PLANS[plan], [plan]);

  const loginWithPi = async () => {
    setMessage("");
    if (!window.Pi) return setMessage("Pi SDK bulunamadı. Pi Browser içinden açtığına emin ol.");

    try {
      // Pi SDK auth (scopes ihtiyacına göre değişir)
      const authResult = await window.Pi.authenticate(["username"], (payment: any) => {
        // onIncompletePaymentFound (eski yarım ödeme varsa burada gelir)
        console.log("incomplete payment found:", payment);
      });

      // authResult.user.uid genelde Pi user id/uid gibi gelir
      const uid = authResult?.user?.uid;
      if (!uid) return setMessage("Pi login başarısız: uid yok.");

      setUserId(uid);
      setMessage("Giriş başarılı. Üyelik planını seçip ödemeyi başlatabilirsin.");
    } catch (e: any) {
      setMessage(e?.message ?? "Pi login iptal edildi.");
    }
  };

  const startPayment = async () => {
    setMessage("");
    if (!userId) return setMessage("Önce Pi ile giriş yap.");

    if (!piReady || !window.Pi) return setMessage("Pi SDK hazır değil.");

    setLoading(true);
    try {
      // 1) backend’den paymentId al
      const r = await fetch("/api/pi/membership/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? "create failed");

      const paymentId = data.paymentId;
      if (!paymentId) throw new Error("paymentId gelmedi");

      // 2) Pi SDK ödeme akışı
      await window.Pi.createPayment(
        { identifier: paymentId },
        {
          onReadyForServerApproval: async (paymentIdFromPi: string) => {
            await fetch("/api/pi/membership/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: paymentIdFromPi }),
            });
          },

          onReadyForServerCompletion: async (paymentIdFromPi: string, txid: string) => {
            const rr = await fetch("/api/pi/membership/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: paymentIdFromPi, txid }),
            });

            const done = await rr.json();
            if (!rr.ok) throw new Error(done?.error ?? "complete failed");

            setMessage(
              `✅ Üyelik aktif! Bitiş: ${new Date(done.membership.expires_at).toLocaleString()}`
            );
          },

          onCancel: () => {
            setMessage("Ödeme iptal edildi.");
          },

          onError: (error: any) => {
            console.error(error);
            setMessage("Ödeme hatası: " + (error?.message ?? "bilinmeyen"));
          },
        }
      );
    } catch (e: any) {
      setMessage(e?.message ?? "Ödeme başlatılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Üyelik</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Giriş (membership) ile kategorilere erişim açılır. Komisyon yok — gelir modeli üyelik + ek
        özellikler.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <button
          onClick={loginWithPi}
          disabled={!piReady || loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {userId ? "Pi Girişi ✅" : "Pi ile Giriş Yap"}
        </button>

        <div style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #eee" }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Login UID</div>
          <div style={{ fontFamily: "monospace" }}>{userId ?? "-"}</div>
        </div>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Plan seç</h2>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {(["monthly", "yearly"] as PlanKey[]).map((k) => {
          const p = PLANS[k];
          const active = k === plan;
          return (
            <button
              key={k}
              onClick={() => setPlan(k)}
              disabled={loading}
              style={{
                textAlign: "left",
                padding: 14,
                borderRadius: 14,
                border: active ? "2px solid #6d28d9" : "1px solid #ddd",
                background: active ? "rgba(109,40,217,0.06)" : "white",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16 }}>{p.title}</div>
              <div style={{ marginTop: 6, fontSize: 14, opacity: 0.85 }}>{p.desc}</div>
              <div style={{ marginTop: 10, fontWeight: 900 }}>{p.pricePi} Pi</div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 18, padding: 14, borderRadius: 12, border: "1px solid #eee" }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Seçili: {selected.title}</div>
        <div style={{ opacity: 0.85, marginBottom: 12 }}>
          Ödeme: <b>{selected.pricePi} Pi</b>
        </div>

        <button
          onClick={startPayment}
          disabled={!userId || loading}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "none",
            fontWeight: 900,
            cursor: userId && !loading ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "İşleniyor..." : "Ödemeyi Başlat"}
        </button>

        {message ? (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: "#f7f7f7" }}>
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
        }
