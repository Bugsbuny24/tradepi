"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function TestPiPaymentButton() {
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let t: any;
    let tries = 0;

    t = setInterval(async () => {
      tries++;
      if (window.Pi) {
        clearInterval(t);
        try {
          await window.Pi.init({ version: "2.0", sandbox: true });
          setReady(true);
          setMsg("SDK Ready ✅");
        } catch (e: any) {
          setMsg("init hata: " + (e?.message || "unknown"));
        }
      }
      if (tries > 20) {
        clearInterval(t);
        setMsg("Pi SDK bulunamadı");
      }
    }, 150);

    return () => clearInterval(t);
  }, []);

  const pay = async () => {
    setMsg("Payment başlıyor ⏳");
    try {
      if (!window.Pi) throw new Error("Pi SDK yok");

      const payment = await window.Pi.createPayment(
        {
          amount: 1,
          memo: "Test payment",
          metadata: { productId: "spark-01" },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId: string) => {
            await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onCancel: async (paymentId: string) => {
            await fetch("/api/pi/cancel", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onError: (error: any) => {
            console.error(error);
            setMsg("Payment error: " + (error?.message || "unknown"));
          },
        }
      );

      setMsg("Payment created: " + JSON.stringify(payment));
    } catch (e: any) {
      setMsg("pay hata: " + (e?.message || "unknown"));
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={pay}
        disabled={!ready}
        className="px-4 py-2 rounded bg-yellow-500 text-black font-black disabled:opacity-50"
      >
        Test Pi Payment
      </button>
      <div className="text-xs text-gray-500">{msg}</div>
    </div>
  );
}
