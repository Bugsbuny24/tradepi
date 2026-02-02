"use client";

import { useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function Home() {
  const [log, setLog] = useState<string>("");

  const append = (s: string) => setLog((p) => `${p}\n${s}`);

  const verifyPayment = async () => {
    try {
      if (!window.Pi) {
        append("Pi SDK yok. Bunu Pi Browser içinde aç.");
        return;
      }

      // Bazı örneklerde init kullanılıyor; projende gerekiyorsa aç:
      // window.Pi.init({ version: "2.0" });

      const paymentData = {
        amount: 0.01,
        memo: "TradePiGloball verification payment",
        metadata: { purpose: "checklist_step_10" },
      };

      const callbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          append(`onReadyForServerApproval: ${paymentId}`);
          const r = await fetch("/api/pi/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
          if (!r.ok) throw new Error(await r.text());
          append("Server approve OK");
        },

        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          append(`onReadyForServerCompletion: ${paymentId} txid=${txid}`);
          const r = await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
          if (!r.ok) throw new Error(await r.text());
          append("Server complete OK ✅");
        },

        onCancel: (paymentId: string) => append(`Cancelled: ${paymentId}`),
        onError: (err: any, payment: any) =>
          append(`Error: ${JSON.stringify({ err, payment })}`),
      };

      append("Creating payment...");
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (e: any) {
      append(`FAIL: ${e?.message || String(e)}`);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>TradePiGloball • Pi Checklist Payment</h1>

      <button
        onClick={verifyPayment}
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Verify Payment (0.01 Pi)
      </button>

      <pre
        style={{
          marginTop: 16,
          padding: 12,
          background: "#f6f6f6",
          borderRadius: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {log || "Log burada..."}
      </pre>
    </main>
  );
}
