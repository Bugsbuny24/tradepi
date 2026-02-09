"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TestPiPaymentButton() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const initedRef = useRef(false);

  useEffect(() => {
    const Pi = window.Pi;
    if (!Pi) {
      setStatus("Pi SDK yok. Bu sayfayı Pi Browser içinde UYGULAMA olarak açmalısın (Develop > App > Open).");
      return;
    }
    try {
      Pi.init({ version: "2.0", sandbox });
      initedRef.current = true;
      setStatus(`Pi SDK hazır. Sandbox: ${sandbox}`);
    } catch (e: any) {
      setStatus(`Pi.init hata: ${e?.message ?? String(e)}`);
    }
  }, []);

  const runTestPayment = async () => {
    try {
      setLoading(true);
      setStatus("Pi authorize (payments) isteniyor...");

      const Pi = window.Pi;
      if (!Pi) {
        setStatus("Pi SDK bulunamadı. Pi Browser içinde mi açtın?");
        return;
      }
      if (!initedRef.current) {
        Pi.init({ version: "2.0", sandbox });
        initedRef.current = true;
      }

      // 👇 Kritik: auth ekranı gelmiyorsa 15sn sonra net hata verelim
      const authPromise = Pi.authenticate(
        ["payments", "username"],
        (payment: any) => {
          console.log("incomplete payment found:", payment);
        }
      );

      const auth = await Promise.race([
        authPromise,
        (async () => {
          await wait(15000);
          throw new Error(
            "Authorize ekranı gelmedi. %99: Uygulamayı Develop>App>Open ile açmıyorsun ya da www/non-www redirect var (origin mismatch)."
          );
        })(),
      ]);

      console.log("auth ok:", auth);

      setStatus("Ödeme oluşturuluyor...");

      Pi.createPayment(
        {
          amount: 0.01,
          memo: "Pi Step-10 Test Payment",
          metadata: { test: true, ts: Date.now() },
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

            setStatus("Onaylandı. Cüzdanı açıp işlemi tamamla...");
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

            setStatus("✅ Ödeme tamamlandı!");
          },

          onCancel: (paymentId: string) => {
            console.log("cancelled:", paymentId);
            setStatus("İptal edildi.");
          },

          onError: (error: any, payment: any) => {
            console.error("Pi error:", error, payment);
            setStatus(error?.message || "Ödeme hatası");
          },
        }
      );
    } catch (e: any) {
      console.error(e);
      setStatus(e?.message ?? "Hata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Pi Step-10 Test Payment</h1>
      <p>{status || "Hazır"}</p>

      <button onClick={runTestPayment} disabled={loading} style={{ padding: 10, border: "1px solid #999" }}>
        {loading ? "..." : "Test Payment"}
      </button>

      <div style={{ marginTop: 10, opacity: 0.7 }}>
        <div>Sandbox: {String(sandbox)}</div>
        <div>Origin: {typeof window !== "undefined" ? window.location.origin : ""}</div>
      </div>
    </div>
  );
}
