"use client";

import { useCallback, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

async function postJSON<T = any>(url: string, body: any): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await r.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // ignore
  }

  if (!r.ok) {
    throw new Error(json?.error || text || `HTTP ${r.status}`);
  }
  return json as T;
}

export default function TestPiPaymentButton() {
  const [status, setStatus] = useState("");

  const runTestPayment = useCallback(async () => {
    try {
      setStatus("Pi SDK kontrol ediliyor...");

      const Pi = window.Pi;
      if (!Pi) {
        setStatus("Pi SDK yok. Pi Browser içinde mi açtın?");
        return;
      }

      // init (idempotent)
      Pi.init({ version: "2.0", sandbox: true });

      setStatus("Pi authorize (payments) isteniyor...");

      // ✅ BUNU YAPMADAN createPayment ÇAĞIRMA!
      await Pi.authenticate(
        ["payments"],
        (incompletePayment: any) => {
          console.log("Incomplete payment found:", incompletePayment);
        }
      );

      setStatus("Payment oluşturuluyor...");

      Pi.createPayment(
        {
          amount: 1,
          memo: "Step-10 Test Payment",
          metadata: { purpose: "step10_test" },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus("Server approval...");
            await postJSON("/api/pi/approve", { paymentId });
            setStatus("Approved ✅ (Pi ekranı devam edecek)");
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("Server completion...");
            await postJSON("/api/pi/complete", { paymentId, txid });
            setStatus("Completed ✅ Step-10 OK");
          },

          onCancel: (paymentId?: string) => {
            setStatus(`İptal edildi${paymentId ? ` (${paymentId})` : ""}`);
          },

          onError: (error: any, paymentId?: string) => {
            setStatus(
              `Hata: ${error?.message || String(error)}${
                paymentId ? ` (${paymentId})` : ""
              }`
            );
          },
        }
      );
    } catch (e: any) {
      setStatus(`Hata: ${e?.message || String(e)}`);
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h3>Pi Step-10 Test Payment</h3>
      {status && <p>{status}</p>}
      <button onClick={runTestPayment}>Test Payment</button>
    </div>
  );
}
