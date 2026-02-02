"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function Home() {
  const [log, setLog] = useState("");
  const [busy, setBusy] = useState(false);
  const [auth, setAuth] = useState<any>(null);

  const append = (s: string) => setLog((p) => (p ? `${p}\n${s}` : s));

  // Pi SDK hazır mı? (Pi Browser bazen geç inject ediyor)
  const waitForPi = async (ms = 5000) => {
    const start = Date.now();
    while (!window.Pi) {
      if (Date.now() - start > ms) return false;
      await new Promise((r) => setTimeout(r, 100));
    }
    return true;
  };

  useEffect(() => {
    // İstersen ilk açılışta init deneyelim (Pi hazırsa)
    (async () => {
      const ok = await waitForPi(1500);
      if (ok) {
        try {
          window.Pi.init({ version: "2.0" });
          append("Pi SDK ready ✅");
        } catch (e: any) {
          append(`Pi init error: ${e?.message || String(e)}`);
        }
      } else {
        append("Pi SDK bekleniyor… (Pi Browser’da aç)");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuth = async () => {
    if (auth) return auth;

    const ok = await waitForPi(5000);
    if (!ok) throw new Error("Pi SDK yok (Pi Browser içinde aç).");

    // init güvenli: birden fazla kez çağrılsa da genelde sorun çıkarmaz
    window.Pi.init({ version: "2.0" });

    append("Authenticating (payments scope)...");
    const scopes = ["payments", "username"];

    const onIncompletePaymentFound = (payment: any) => {
      append("Incomplete payment found (ignored for MVP).");
      // İstersen burada server tarafında kontrol/temizleme yapılır.
    };

    const a = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    setAuth(a);
    append(`Auth OK: user=${a?.user?.username || "??"}`);
    return a;
  };

  const verifyPayment = async () => {
    if (busy) return; // çift tıklama kilidi
    setBusy(true);

    try {
      await getAuth();

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
          const txt = await r.text();
          if (!r.ok) throw new Error(txt);
          append("Server approve OK ✅");
        },

        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          append(`onReadyForServerCompletion: ${paymentId} txid=${txid}`);
          const r = await fetch("/api/pi/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
          const txt = await r.text();
          if (!r.ok) throw new Error(txt);
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
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 40, marginBottom: 16 }}>
        TradePiGloball • Pi Payment Verification
      </h1>

      <button
        onClick={verifyPayment}
        disabled={busy}
        style={{
          padding: "14px 18px",
          borderRadius: 10,
          border: "1px solid #ddd",
          fontSize: 16,
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? "Processing..." : "Verify Payment (0.01 Pi)"}
      </button>

      <pre
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          background: "#f5f5f5",
          whiteSpace: "pre-wrap",
          minHeight: 120,
        }}
      >
        {log || "Log burada..."}
      </pre>
    </main>
  );
}
