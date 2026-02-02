"use client";

import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

function isPiBrowserUA() {
  if (typeof navigator === "undefined") return false;
  return /PiBrowser/i.test(navigator.userAgent);
}

export default function Home() {
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [piReady, setPiReady] = useState(false);

  const isPiBrowser = useMemo(() => isPiBrowserUA(), []);

  const append = (s: string) => setLog((p) => (p ? `${p}\n${s}` : s));

  useEffect(() => {
    // Pi Browser değilse hiç zorlamayalım
    if (!isPiBrowser) {
      append("Bu sayfa Pi Browser içinde açılmalı.");
      append("Chrome’da Pi SDK yüklenebilir ama authenticate/payments düzgün çalışmaz.");
      return;
    }

    // Pi Browser ise SDK'yı bekleyip init edelim
    const t0 = Date.now();
    const timer = setInterval(() => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0" });
          setPiReady(true);
          append("Pi SDK ready ✅");
          clearInterval(timer);
        } catch (e: any) {
          append("Pi.init error: " + (e?.message || String(e)));
          clearInterval(timer);
        }
      } else if (Date.now() - t0 > 8000) {
        append("Pi SDK yüklenmedi (8s timeout). Pi Browser içinden açtığına emin ol.");
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyPayment = async () => {
    setLoading(true);
    try {
      if (!isPiBrowser) {
        append("Pi Browser değil → authenticate başlatmıyorum.");
        return;
      }
      if (!window.Pi) {
        append("Pi SDK yok → script yüklenmemiş.");
        return;
      }

      append("Authenticating (payments scope)...");

      const scopes = ["payments"];

      const onIncompletePaymentFound = (payment: any) => {
        append("Incomplete payment found (ignored): " + JSON.stringify(payment));
      };

      // authenticate takılmasın diye timeout
      const authPromise = window.Pi.authenticate(scopes, onIncompletePaymentFound);
      const authResult = await Promise.race([
        authPromise,
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error("authenticate timeout (20s)")), 20000)
        ),
      ]);

      append(`Auth OK: user=${authResult?.user?.username || "?"}`);

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
          append("Server approve OK ✅");
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
          append(`Error: ${JSON.stringify({ err: err?.message || err, payment })}`),
      };

      append("Creating payment...");
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (e: any) {
      append(`FAIL: ${e?.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 44, marginBottom: 18 }}>
        TradePiGloball • Pi Payment Verification
      </h1>

      <button
        onClick={verifyPayment}
        disabled={loading || !piReady || !isPiBrowser}
        style={{
          padding: "14px 18px",
          borderRadius: 12,
          border: "1px solid #ddd",
          opacity: loading || !piReady || !isPiBrowser ? 0.5 : 1,
        }}
      >
        {loading ? "Processing..." : "Verify Payment (0.01 Pi)"}
      </button>

      <pre
        style={{
          marginTop: 20,
          background: "#f3f3f3",
          padding: 18,
          borderRadius: 14,
          whiteSpace: "pre-wrap",
        }}
      >
        {log || "—"}
      </pre>
    </main>
  );
            }
