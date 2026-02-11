"use client";

import { useMemo, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

function getSandboxFlag() {
  // Default true so you can test in Pi Sandbox; set NEXT_PUBLIC_PI_SANDBOX=false in Vercel to use production.
  return (process.env.NEXT_PUBLIC_PI_SANDBOX ?? "true").toLowerCase() !== "false";
}

async function ensurePiSdkLoaded(): Promise<any> {
  if (typeof window === "undefined") return null;
  if (window.Pi) return window.Pi;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-pi-sdk="1"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Pi SDK failed to load")));
      return;
    }

    const s = document.createElement("script");
    s.src = "https://sdk.minepi.com/pi-sdk.js";
    s.async = true;
    s.setAttribute("data-pi-sdk", "1");
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Pi SDK failed to load"));
    document.head.appendChild(s);
  });

  return window.Pi;
}

export default function TestPiPaymentButton() {
  const sandbox = useMemo(() => getSandboxFlag(), []);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setStatus("");

    try {
      const Pi = await ensurePiSdkLoaded();
      if (!Pi) throw new Error("Pi SDK bulunamadı. Pi Browser'da açmayı dene.");

      Pi.init({ version: "2.0", sandbox });

      const amount = 0.1;
      const memo = "Test payment (Pi checklist)";
      const metadata = { source: "tradepi", env: sandbox ? "sandbox" : "production" };

      setStatus("Pi ödeme ekranı açılıyor...");

      await Pi.createPayment(
        { amount, memo, metadata },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus("Sunucu onayı alınıyor...");
            const r = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            const j = await r.json();
            if (!j.ok) throw new Error(j.error || "Approve failed");
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("Sunucu tamamlama yapıyor...");
            const r = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            const j = await r.json();
            if (!j.ok) throw new Error(j.error || "Complete failed");
            setStatus("✅ Ödeme tamamlandı");
          },
          onCancel: async (paymentId: string) => {
            setStatus("Ödeme iptal edildi");
            await fetch("/api/pi/cancel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            }).catch(() => {});
          },
          onError: (err: any) => {
            setStatus(`❌ Hata: ${err?.message ?? String(err)}`);
          },
        }
      );
    } catch (e: any) {
      setStatus(`❌ ${e?.message ?? "Bir hata oldu"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border bg-white p-4">
      <div className="text-sm font-semibold">Pi Test Ödemesi</div>
      <div className="mt-1 text-xs text-gray-500">
        Bu buton Pi Browser içinde test ödeme ekranını açar (checklist adımı için).
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Çalışıyor..." : "Test Pi Payment"}
      </button>

      {status ? <div className="mt-3 text-xs text-gray-700">{status}</div> : null}

      <div className="mt-3 text-[11px] text-gray-500">
        Sandbox: <span className="font-mono">{String(sandbox)}</span> (NEXT_PUBLIC_PI_SANDBOX ile kontrol edilir)
      </div>
    </div>
  );
}
