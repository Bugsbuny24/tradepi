"use client";

import { useMemo, useState } from "react";

type PiSdk = {
  init: (opts: { version: string; sandbox?: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound?: (payment: any) => void | Promise<void>
  ) => Promise<any>;
  createPayment: (
    paymentData: { amount: number; memo: string; metadata?: any },
    callbacks: {
      onReadyForServerApproval: (paymentId: string) => void | Promise<void>;
      onReadyForServerCompletion: (
        paymentId: string,
        txid: string
      ) => void | Promise<void>;
      onCancel: (paymentId: string) => void;
      onError: (error: any, payment?: any) => void;
    }
  ) => void;
};

declare global {
  interface Window {
    Pi?: PiSdk;
  }
}

export default function TestPiPaymentButton() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Vercel env: NEXT_PUBLIC_PI_SANDBOX = "true" ise sandbox açılır
  const sandbox = useMemo(
    () => process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
    []
  );

  const onIncompletePaymentFound = async (payment: any) => {
    // Pi SDK farklı alan isimleri döndürebiliyor
    const paymentId =
      payment?.identifier || payment?.paymentId || payment?.id || "";

    if (!paymentId) {
      console.log("incomplete payment found (no id):", payment);
      return;
    }

    setStatus(`Yarım kalan ödeme bulundu (${paymentId}). İptal ediyorum...`);

    try {
      const res = await fetch("/api/pi/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "cancel failed");

      setStatus("Yarım kalan ödeme temizlendi. Şimdi tekrar dene ✅");
    } catch (e: any) {
      console.error("cancel incomplete failed:", e);
      setStatus(`Yarım kalan ödeme iptal edilemedi: ${e?.message || "Hata"}`);
    }
  };

  const runTestPayment = async () => {
    try {
      setLoading(true);
      setStatus("Pi SDK kontrol ediliyor...");

      const Pi = window.Pi;
      if (!Pi) {
        setStatus("Pi SDK yok. Uygulamayı Pi Browser içinden mi açtın?");
        return;
      }

      Pi.init({ version: "2.0", sandbox });

      setStatus("Pi authorize (payments) isteniyor...");
      await Pi.authenticate(["payments"], onIncompletePaymentFound);

      // Buraya geldiyse authorize OK
      setStatus("Authorize tamam. Ödeme oluşturuluyor...");

      // Test için küçük bir rakam bas
      const amount = 0.01;

      Pi.createPayment(
        {
          amount,
          memo: "Step-10 Test Payment",
          metadata: { internalId: `step10_${Date.now()}` },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus("Sunucu onayı bekleniyor (approve)...");
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "approve failed");
            setStatus("Approve OK. Cüzdanda 'Cüzdanı Aç' aktif olmalı ✅");
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("Tamamlama (complete) gönderiliyor...");
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "complete failed");
            setStatus("✅ Ödeme tamamlandı! Step-10 geçer.");
          },

          onCancel: (paymentId: string) => {
            console.log("cancelled:", paymentId);
            setStatus("Kullanıcı iptal etti.");
          },

          onError: (error: any, payment?: any) => {
            console.error("Pi error:", error, payment);
            setStatus(error?.message || "Ödeme hatası");
          },
        }
      );
    } catch (e: any) {
      console.error(e);
      setStatus(e?.message || "Hata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Pi Step-10 Test Payment</h2>

      <div style={{ margin: "8px 0", opacity: 0.8 }}>
        Sandbox: <b>{String(sandbox)}</b>
        <br />
        Origin: <b>{typeof window !== "undefined" ? window.location.origin : ""}</b>
      </div>

      <button onClick={runTestPayment} disabled={loading}>
        {loading ? "..." : "Test Payment"}
      </button>

      {status ? (
        <div style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{status}</div>
      ) : null}
    </div>
  );
                                    }
