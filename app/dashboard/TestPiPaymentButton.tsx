"use client";

/**
 * NOTE:
 * You asked to remove Pi SDK/MDK from auth flows.
 * This file is kept as a standalone demo button (optional) for Pi payment testing.
 * If you are not using Pi payments, you can delete this file safely.
 */

import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function TestPiPaymentButton() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<string>("Pi SDK bekleniyor...");

  const isPiBrowser = useMemo(() => {
    if (typeof window === "undefined") return false;
    // basic heuristic
    return !!window.Pi;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If Pi is injected, mark ready.
    if (window.Pi) {
      setReady(true);
      setStatus("Pi SDK hazır.");
    } else {
      setReady(false);
      setStatus("Pi SDK yok. Bu buton sadece Pi Browser’da çalışır.");
    }
  }, []);

  async function onPay() {
    try {
      if (!window.Pi) {
        setStatus("Pi SDK yok.");
        return;
      }

      setStatus("Ödeme başlatılıyor...");

      // Example payment data
      const paymentData = {
        amount: 0.001, // test amount
        memo: "Test payment",
        metadata: { purpose: "test" },
      };

      // Pi SDK payment flow (if enabled in your app)
      const res = await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          // TODO: call your backend to approve payment
          console.log("onReadyForServerApproval", paymentId);
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          // TODO: call your backend to complete payment
          console.log("onReadyForServerCompletion", paymentId, txid);
        },
        onCancel: (paymentId: string) => {
          console.log("onCancel", paymentId);
        },
        onError: (error: any, payment?: any) => {
          console.error("onError", error, payment);
        },
      });

      setStatus("Ödeme akışı tamamlandı.");
      console.log("payment result", res);
    } catch (e: any) {
      setStatus(`Hata: ${e?.message || "bilinmiyor"}`);
    }
  }

  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="text-sm text-gray-600 mb-3">
        {isPiBrowser ? "Pi Browser algılandı." : "Pi Browser değil gibi."}{" "}
        {status}
      </div>

      <button
        onClick={onPay}
        disabled={!ready}
        className="rounded-xl bg-purple-700 text-white px-4 py-2 font-semibold disabled:opacity-60"
      >
        Test Pi Payment
      </button>
    </div>
  );
}
