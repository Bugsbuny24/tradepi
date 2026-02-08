// app/pi/pay/pi-pay-client.tsx
"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function PiPayClient({
  code,
  rawReturn,
}: {
  code: string;
  rawReturn: string;
}) {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("Pi SDK yükleniyor…");
  const [pkg, setPkg] = useState<{ code: string; title: string; price_pi: number } | null>(null);

  // güvenli return (open-redirect kapalı)
  const returnTo = useMemo(() => {
    if (!rawReturn) return "/dashboard";
    if (rawReturn.startsWith("/")) return rawReturn;

    // full URL geldiyse sadece aynı origin'e izin ver
    if (typeof window === "undefined") return "/dashboard";
    try {
      const u = new URL(rawReturn);
      if (u.origin === window.location.origin) return u.pathname + u.search;
    } catch {}
    return "/dashboard";
  }, [rawReturn]);

  useEffect(() => {
    let mounted = true;

    async function loadPkg() {
      if (!code) {
        setMsg("Eksik parametre: ?code=PACKAGE_CODE");
        return;
      }
      try {
        const res = await fetch(`/api/pi/package?code=${encodeURIComponent(code)}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (!mounted) return;
        setPkg(json.package);
        setMsg("Hazır ✅ Pi Browser içinden ödemeyi başlatabilirsin.");
      } catch (e: any) {
        if (!mounted) return;
        setMsg(`Hata: ${e?.message ?? "Package load failed"}`);
      }
    }

    loadPkg();
    return () => {
      mounted = false;
    };
  }, [code]);

  function initPi() {
    try {
      const Pi = window.Pi;
      if (!Pi) return;
      Pi.init({ version: "2.0" });
      setSdkReady(true);
    } catch {
      setMsg("Pi SDK init başarısız.");
    }
  }

  const canPay = useMemo(() => !!pkg && sdkReady && !loading, [pkg, sdkReady, loading]);

  async function start() {
    if (!pkg) return;

    const Pi = window.Pi;
    if (!Pi) {
      setMsg("Pi SDK bulunamadı. Bu sayfayı Pi Browser’da aç.");
      return;
    }

    setLoading(true);
    setMsg("Pi authenticate…");

    try {
      await Pi.authenticate(["payments"], function onIncompletePaymentFound(payment: any) {
        console.log("Incomplete payment found", payment);
      });

      setMsg("Payment oluşturuluyor…");

      Pi.createPayment(
        {
          amount: Number(pkg.price_pi),
          memo: `Topup package: ${pkg.code}`,
          metadata: { package_code: pkg.code },
        },
        {
          onReadyForServerApproval: async function (paymentId: string) {
            setMsg("Server approval…");
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error ?? "Approve failed");
            setMsg("Onaylandı. Kullanıcı işlemi tamamlıyor…");
          },

          onReadyForServerCompletion: async function (paymentId: string, txid: string) {
            setMsg("Doğrulama + quota yükleniyor…");
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                paymentId,
                txid,
                package_code: pkg.code,
              }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error ?? "Complete failed");
            setMsg(json?.already_processed ? "Zaten işlenmiş ✅" : "Başarılı ✅");
            window.location.href = returnTo;
          },

          onCancel: function () {
            setMsg("İptal edildi.");
            setLoading(false);
          },

          onError: function (error: any) {
            console.error(error);
            setMsg(`Hata: ${error?.message ?? "Payment error"}`);
            setLoading(false);
          },
        }
      );
    } catch (e: any) {
      setMsg(`Auth/Payment hata: ${e?.message ?? "Unknown"}`);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-xl font-bold">Pay with Pi</h1>
      <p className="mt-2 text-sm text-gray-600">
        Bu sayfa Pi Browser içinde çalışır. Paket kodu: <b>{code || "-"}</b>
      </p>

      <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-sm">{msg}</div>

        {pkg && (
          <div className="mt-3 text-sm text-gray-700">
            <div>
              <b>{pkg.title}</b>
            </div>
            <div>{pkg.price_pi} PI</div>
          </div>
        )}

        <button
          className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          onClick={start}
          disabled={!canPay}
        >
          {loading ? "İşleniyor…" : "Pay with Pi"}
        </button>

        <div className="mt-3 text-xs text-gray-500">
          Not: Doğrulama server-side <code>/complete</code> ile yapılır.
        </div>
      </div>

      <Script
        src="https://sdk.minepi.com/pi-sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          initPi();
          setMsg("Pi SDK yüklendi ✅");
        }}
      />
    </div>
  );
            }
