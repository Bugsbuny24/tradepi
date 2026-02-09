"use client";

import { useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

const SCOPES = ["payments"];

export default function TestPiPaymentButton() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Testnet için true, mainnet için false
  const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

  const run = async () => {
    try {
      setLoading(true);
      setStatus("Pi SDK kontrol ediliyor...");

      const Pi = window.Pi;
      if (!Pi) {
        setStatus("Pi SDK bulunamadı. Pi Browser içinde mi açtın?");
        return;
      }

      // init idempotent (defalarca çağrılabilir)
      Pi.init({ version: "2.0", sandbox });

      setStatus('Pi authorize (payments) isteniyor...');

      // payments scope'u ALMADAN createPayment olmaz
      await Pi.authenticate(SCOPES, (payment: any) => {
        // Yarım kalan ödeme yakalanırsa buraya düşer
        console.log("incomplete payment:", payment);
      });

      setStatus("Ödeme başlatılıyor...");

      Pi.createPayment(
        {
          amount: 1, // Step-10 için test miktarı (istersen 0.1 yap)
          memo: "TradePi Studio - Step10 Test Payment",
          metadata: { purpose: "step10_test" },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus("Sunucu onayı bekleniyor...");

            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "approve failed");

            setStatus("Onaylandı. Cüzdanda tamamla...");
            return json;
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("Tamamlama yapılıyor...");

            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "complete failed");

            setStatus("✅ Ödeme tamamlandı");
            return json;
          },

          onCancel: () => setStatus("İptal edildi"),

          onError: (error: any) => {
            console.error(error);
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
    <div style={{ marginTop: 16 }}>
      <button onClick={run} disabled={loading}>
        {loading ? "..." : "Test Payment"}
      </button>

      <div style={{ marginTop: 12 }}>{status}</div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        Sandbox: {String(sandbox)}
      </div>
    </div>
  );
}
