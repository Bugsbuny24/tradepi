"use client";

import { useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function TestPiPaymentButton() {
  const [status, setStatus] = useState<string>("Hazır");

  const runTestPayment = async () => {
    try {
      setStatus("Pi SDK kontrol ediliyor...");

      const Pi = window.Pi;
      if (!Pi) {
        setStatus("Pi SDK bulunamadı. Pi Browser içinde mi açtın?");
        return;
      }

      // Sandbox için init
      // Not: Pi dokümanlarında sandbox true ile test yapılır.
      Pi.init({ version: "2.0", sandbox: true });

      setStatus("Ödeme başlatılıyor...");

      // En basit ödeme: 0.01 Pi gibi küçük bir tutar ver (testnet/sandbox)
      const paymentData = {
        amount: 0.01,
        memo: "TradePi Studio - Step10 test payment",
        metadata: { purpose: "step10_test" },
      };

      const callbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          setStatus("Server approval bekleniyor...");
          const res = await fetch("/api/pi/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error || "approve failed");
          setStatus("Approved ✅ (user transfer ekranına geçiyor)");
        },

        // txid Pi tarafında oluşunca complete çağıracağız
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus("Server completion bekleniyor...");
          const res = await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error || "complete failed");
          setStatus("Completed ✅ Step-10 geçildi!");
        },

        onCancel: (paymentId: string) => {
          setStatus(`İptal edildi: ${paymentId}`);
        },

        onError: (err: any, payment?: any) => {
          const pid = payment?.identifier ? ` (paymentId: ${payment.identifier})` : "";
          setStatus(`Hata: ${String(err?.message || err)}${pid}`);
        },
      };

      // createPayment
      await Pi.createPayment(paymentData, callbacks);
    } catch (e: any) {
      setStatus(`Hata: ${String(e?.message || e)}`);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-white font-semibold">Pi Step-10 Test Payment</div>
          <div className="text-white/50 text-sm mt-1">{status}</div>
        </div>
        <button
          onClick={runTestPayment}
          className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-semibold"
        >
          Test Payment
        </button>
      </div>
    </div>
  );
}
