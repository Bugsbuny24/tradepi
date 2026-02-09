"use client";

import { useState } from "react";

type PiSdk = {
  init: (opts: { version: string; sandbox?: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound?: (payment: any) => void
  ) => Promise<any>;
  createPayment: (
    paymentData: { amount: number; memo: string; metadata?: any },
    callbacks: {
      onReadyForServerApproval: (paymentId: string) => void | Promise<void>;
      onReadyForServerCompletion: (paymentId: string, txid: string) => void | Promise<void>;
      onCancel: (paymentId: string) => void;
      onError: (error: any, payment?: any) => void;
    }
  ) => void;
};

export default function TestPiPaymentButton() {
  const [status, setStatus] = useState<string>("");

  const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

  const runTestPayment = async () => {
    try {
      setStatus("Pi SDK kontrol ediliyor...");

      const Pi = (window as any).Pi as PiSdk | undefined;
      if (!Pi) {
        setStatus("Pi SDK bulunamadı. Pi Browser içinde mi açtın?");
        return;
      }

      // 1) Init
      Pi.init({ version: "2.0", sandbox });

      // 2) payments scope al (bunu almadan ödeme başlatamazsın)
      setStatus("Pi authorize (payments) isteniyor...");
      await Pi.authenticate(["payments"], (payment: any) => {
        console.log("incomplete payment found:", payment);
      });

      // 3) Ödeme başlat
      setStatus("Ödeme başlatılıyor...");
      Pi.createPayment(
        {
          amount: 0.01,
          memo: "TradePi Studio - Step10 Test Payment",
          metadata: { type: "STEP10_TEST" },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus(`Server approval... (${paymentId})`);
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            if (!res.ok) throw new Error(await res.text());
            setStatus("Approved. Completion bekleniyor...");
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus(`Server completion... (${paymentId})`);
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            if (!res.ok) throw new Error(await res.text());
            setStatus(`Tamam! txid=${txid}`);
          },
          onCancel: (paymentId: string) => {
            setStatus(`İptal edildi (${paymentId})`);
          },
          onError: (error: any, payment?: any) => {
            console.error("Pi payment error:", error, payment);
            setStatus(`Hata: ${error?.message ?? String(error)}`);
          },
        }
      );
    } catch (e: any) {
      console.error(e);
      setStatus(`Hata: ${e?.message ?? String(e)}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Pi Step-10 Test Payment</h2>
      <p>{status}</p>
      <button onClick={runTestPayment}>Test Payment</button>
    </div>
  );
}
