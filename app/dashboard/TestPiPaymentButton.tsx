'use client';

import { useEffect, useRef, useState } from "react";

type Props = {
  /** If true, Pi SDK runs in sandbox (Testnet) mode. */
  sandbox?: boolean;
};

declare global {
  interface Window {
    Pi?: any;
  }
}

function loadPiSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Pi) return Promise.resolve();

  // Avoid injecting multiple times
  const existing = document.querySelector('script[data-pi-sdk="true"]') as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Pi SDK failed to load")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://sdk.minepi.com/pi-sdk.js";
    s.async = true;
    s.defer = true;
    s.dataset.piSdk = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Pi SDK failed to load"));
    document.head.appendChild(s);
  });
}

export default function TestPiPaymentButton({ sandbox = true }: Props) {
  const [sdkState, setSdkState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [status, setStatus] = useState<string>("");
  const initedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadPiSdk();

        if (cancelled) return;
        if (!window.Pi) {
          setSdkState("missing");
          return;
        }

        // Pi SDK init only once
        if (!initedRef.current) {
          initedRef.current = true;
          try {
            window.Pi.init({ version: "2.0", sandbox });
          } catch {
            // ignore if already initialized
          }
        }

        setSdkState("ready");
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setSdkState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sandbox]);

  const disabled = sdkState !== "ready";

  async function postJSON(path: string, body: any) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Request failed: ${res.status} ${txt}`);
    }
    return res.json().catch(() => ({}));
  }

  async function handlePay() {
    try {
      setStatus("Starting payment…");

      if (!window.Pi) {
        setStatus("Pi SDK not available. Open inside Pi Browser.");
        return;
      }

      // NOTE: Use a small amount for testing; Pi sandbox ignores real funds.
      const paymentData = {
        amount: 0.01,
        memo: "SnapLogic test payment",
        metadata: {
          purpose: "pi-developer-checklist",
        },
      };

      await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          setStatus(`Server approval… (${paymentId})`);
          await postJSON("/api/pi/create-payment", { paymentId });
          setStatus("Approved. Waiting for completion…");
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus(`Completing… (${paymentId})`);
          await postJSON("/api/pi/complete-payment", { paymentId, txid });
          setStatus("✅ Payment completed");
        },
        onCancel: (paymentId: string) => {
          setStatus(`Cancelled (${paymentId})`);
        },
        onError: (error: any) => {
          console.error(error);
          setStatus(`❌ Error: ${error?.message ?? String(error)}`);
        },
      });
    } catch (e: any) {
      console.error(e);
      setStatus(`❌ Error: ${e?.message ?? String(e)}`);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handlePay}
        disabled={disabled}
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white ${
          disabled ? "bg-black/40" : "bg-black hover:bg-black/90"
        }`}
      >
        {disabled ? "Pi SDK Hazırlanıyor…" : "Pi Test Ödeme (Sandbox)"}
      </button>

      <div className="text-xs text-gray-500">
        {sdkState === "missing" && "Pi SDK yok. Bu buton sadece Pi Browser içinde çalışır."}
        {sdkState === "error" && "Pi SDK yüklenemedi. İnternet/CSP kontrol et."}
        {sdkState === "ready" && (status ? status : "Hazır")}
        {sdkState === "loading" && "Yükleniyor…"}
      </div>
    </div>
  );
}
