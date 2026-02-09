"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

type PackageRow = {
  code: string;
  title: string;
  price_pi: number;
  sell_currency?: "PI" | "USD" | "BOTH";
};

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label)), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export default function PiPayClient({
  code,
  rawReturn,
}: {
  code: string;
  rawReturn?: string;
}) {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pkg, setPkg] = useState<PackageRow | null>(null);

  const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
  const safeCode = useMemo(() => (code || "").toUpperCase().trim(), [code]);

  const initedRef = useRef(false);
  const authedRef = useRef(false);

  // 1) Paket bilgisini DB'den çek
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus("Paket okunuyor...");
        const res = await fetch(
          `/api/pi/package?code=${encodeURIComponent(safeCode)}`,
          { method: "GET" }
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Paket okunamadı");
        if (cancelled) return;

        setPkg(json as PackageRow);
        setStatus("");
      } catch (e: any) {
        if (cancelled) return;
        setStatus(e?.message || "Hata");
        setPkg(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [safeCode]);

  const ensurePi = () => {
    const Pi = window.Pi;
    if (!Pi) {
      throw new Error("Pi SDK bulunamadı. Pi Browser içinde mi açtın?");
    }
    if (!initedRef.current) {
      Pi.init({ version: "2.0", sandbox });
      initedRef.current = true;
    }
    return Pi;
  };

  const ensureAuth = async (Pi: PiSdk) => {
    if (authedRef.current) return;

    setStatus("Pi authorize (payments) isteniyor...");
    // 15 sn içinde izin ekranı gelmezse net mesaj ver
    await withTimeout(
      Pi.authenticate(["payments"], (payment: any) => {
        // varsa incomplete payment burada yakalanır
        console.log("incomplete payment found:", payment);
      }),
      15000,
      "Authorize ekranı gelmedi. Bu linki Pi Browser’da aç ve tekrar dene."
    );

    authedRef.current = true;
    setStatus("");
  };

  const buy = async () => {
    try {
      setLoading(true);

      if (!pkg) throw new Error("Paket bulunamadı.");
      const amount = Number(pkg.price_pi);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Paket fiyatı geçersiz.");
      }

      const Pi = ensurePi();
      await ensureAuth(Pi);

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

            setStatus("✅ Ödeme tamamlandı");
            if (rawReturn) {
              window.location.href = rawReturn;
            }
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
        <div>Fiyat (Pi): {pkg?.price_pi ?? "..."}</div>
        <div className="opacity-70">
          Ortam: {sandbox ? "SANDBOX" : "PRODUCTION"}
        </div>
      </div>

      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        onClick={buy}
        disabled={loading || !pkg}
      >
        {loading ? "..." : "Pi ile Satın Al"}
      </button>

      {status ? <div className="text-sm text-gray-700">{status}</div> : null}
    </div>
  );
  }
