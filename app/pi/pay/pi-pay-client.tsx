"use client";

import { useEffect, useMemo, useState } from "react";

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
      onReadyForServerCompletion: (
        paymentId: string,
        txid: string
      ) => void | Promise<void>;
      onCancel: (paymentId: string) => void;
      onError: (error: any, payment?: any) => void;
    }
  ) => void;
};

declare global {
  interface Window {
    Pi?: PiSdk;
  }
}

type Props = {
  code: string;
  rawReturn?: string; // ✅ opsiyonel (TS patlamasın diye)
};

export default function PiPayClient({ code, rawReturn }: Props) {
  const [status, setStatus] = useState<string>("");
  const [packageInfo, setPackageInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
  const safeCode = useMemo(() => (code || "").toUpperCase(), [code]);

  // Paketi serverdan çek
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus("Paket okunuyor...");
        const res = await fetch(
          `/api/pi/package?code=${encodeURIComponent(safeCode)}`
        );
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (!res.ok) throw new Error(json?.error || "Paket okunamadı");
        setPackageInfo(json);
        setStatus("");
      } catch (e: any) {
        if (cancelled) return;
        setStatus(e?.message || "Hata");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [safeCode]);

  const buy = async () => {
    try {
      setLoading(true);
      setStatus("Pi SDK kontrol ediliyor...");

      const Pi = window.Pi;
      if (!Pi) {
        setStatus("Pi SDK bulunamadı. Pi Browser içinde mi açtın?");
        return;
      }

      Pi.init({ version: "2.0", sandbox });

      setStatus("Pi authorize (payments) isteniyor...");

      // payments scope al
      await Pi.authenticate(["payments"], (payment: any) => {
        // incomplete payment varsa burada yakalanır
        console.log("incomplete payment found:", payment);
      });

      const amount = Number(packageInfo?.price_pi);
      if (!Number.isFinite(amount) || amount <= 0) {
        setStatus("Paket fiyatı geçersiz");
        return;
      }

      setStatus("Ödeme başlatılıyor...");

      Pi.createPayment(
        {
          amount,
          memo: `Package ${safeCode}`,
          metadata: { package_code: safeCode },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            setStatus("Sunucu onayı bekleniyor...");
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, packageCode: safeCode }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "approve failed");
            setStatus("Onaylandı, tamamlanıyor...");
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            setStatus("Ödeme tamamlanıyor...");
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid, packageCode: safeCode }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "complete failed");
            setStatus("✅ Ödeme tamamlandı!");
          },

          onCancel: (paymentId: string) => {
            console.log("cancelled:", paymentId);
            setStatus("İptal edildi");
          },

          onError: (error: any, payment?: any) => {
            console.error("pi error:", error, payment);
            setStatus(error?.message || "Ödeme hatası");
          },
        }
      );
    } catch (e: any) {
      console.error(e);
      setStatus(e?.message || "Hata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-md border p-3 text-sm">
        <div className="font-semibold">Paket: {safeCode}</div>
        <div>
          Pi: {packageInfo?.price_pi ? packageInfo.price_pi : "--"}
        </div>
        {rawReturn ? (
          <pre className="mt-2 whitespace-pre-wrap text-xs opacity-70">
            {rawReturn}
          </pre>
        ) : null}
      </div>

      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        onClick={buy}
        disabled={loading || !packageInfo}
      >
        {loading ? "..." : "Pi ile Satın Al"}
      </button>

      {status ? <div className="text-sm text-gray-700">{status}</div> : null}
    </div>
  );
}
