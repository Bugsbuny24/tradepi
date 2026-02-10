"use client";

import { useEffect, useState } from "react";

type PiSdk = {
  init: (opts: { version: string; sandbox?: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound: (payment: any) => void
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

// ÖNEMLİ: PiLoginButton.tsx zaten Window.Pi'yi any diye declare ediyor.
// Aynı kalsın ki TS merge hatası olmasın.
declare global {
  interface Window {
    Pi?: any;
  }
}

export default function TestPiPaymentButton() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
  const origin =
    typeof window !== "undefined" ? window.location.origin : "(server)";

  useEffect(() => {
    const Pi = window.Pi as PiSdk | undefined;

    if (!Pi) {
      setStatus("Pi SDK yükleniyor... (Pi Browser içinde misin?)");
      return;
    }

    try {
      Pi.init({ version: "2.0", sandbox });
      setStatus(`Pi SDK hazır. Sandbox: ${sandbox}`);
    } catch (e: any) {
      setStatus(`Pi.init hata: ${e?.message || String(e)}`);
    }
  }, [sandbox]);

  const postJson = async (url: string, body: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((json as any)?.error || `HTTP ${res.status}`);
    return json;
  };

  const runTestPayment = async () => {
    setLoading(true);

    try {
      const Pi = window.Pi as PiSdk | undefined;

      if (!Pi) {
        setStatus("Pi SDK bulunamadı. Pi Browser içinde açmalısın.");
        return;
      }

      setStatus("Pi authorize (payments) isteniyor...");
      await Pi.authenticate(["payments"], (payment: any) => {
        console.log("incomplete payment found:", payment);
      });

      setStatus("Ödeme başlatılıyor...");
      Pi.createPayment(
        {
          amount: 0.1,
          memo: "Pi Step-10 Test Payment",
          metadata: { purpose: "step10" },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus("Sunucu onayı bekleniyor...");
            await postJson("/api/pi/approve", { paymentId });
            setStatus("Onaylandı, cüzdan ekranı açılmalı...");
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("Ödeme tamamlanıyor...");
            await postJson("/api/pi/complete", { paymentId, txid });
            setStatus("✅ Ödeme tamamlandı");
          },

          onCancel: (paymentId: string) => {
            console.log("cancelled:", paymentId);
            setStatus("İptal edildi");
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
    <div className="rounded-md border p-4 text-sm">
      <div className="mb-2 font-semibold">Pi Step-10 Test Payment</div>

      <div className="mb-3 text-xs opacity-70">
        Sandbox: <b>{String(sandbox)}</b>
        <br />
        Origin: <b>{origin}</b>
      </div>

      <button
        className="rounded border px-4 py-2 disabled:opacity-60"
        onClick={runTestPayment}
        disabled={loading}
      >
        {loading ? "..." : "Test Payment"}
      </button>

      {status ? <div className="mt-3 text-xs">{status}</div> : null}
    </div>
  );
}
