"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function PiPayPage() {
  const sp = useSearchParams();
  const package_code = (sp.get("code") ?? "").trim();
  const return_to = (sp.get("return") ?? "/dashboard").trim();

  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string>("Pi SDK yükleniyor…");
  const [loading, setLoading] = useState(false);
  const [pkg, setPkg] = useState<{ code: string; title: string; price_pi: number } | null>(null);

  const canStart = useMemo(() => !!package_code && !!pkg && ready && !loading, [
    package_code,
    pkg,
    ready,
    loading,
  ]);

  // Paketi server’dan çek (anon route yok; senin app’te login varsayıyoruz)
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!package_code) {
        setMsg("Eksik: ?code=PACKAGE_CODE");
        return;
      }
      try {
        const res = await fetch(`/api/pi/package?code=${encodeURIComponent(package_code)}`, {
          method: "GET",
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error ?? "Package fetch failed");
        if (!mounted) return;
        setPkg(json.package);
        setMsg("Hazır. Ödemeyi başlatabilirsin ✅");
      } catch (e: any) {
        if (!mounted) return;
        setMsg(`Hata: ${e?.message ?? "Unknown"}`);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [package_code]);

  function initPi() {
    try {
      const Pi = window.Pi;
      if (!Pi) return;

      Pi.init({ version: "2.0" });
      setReady(true);
    } catch {
      setMsg("Pi init başarısız.");
    }
  }

  async function startPayment() {
    if (!pkg) return;
    const Pi = window.Pi;
    if (!Pi) {
      setMsg("Pi SDK yok. Bu sayfayı Pi Browser’da aç.");
      return;
    }

    setLoading(true);
    setMsg("Pi authenticate…");

    try {
      await Pi.authenticate(["payments"], function onIncompletePaymentFound(payment: any) {
        // İstersen burada incomplete payment’ları handle edebilirsin.
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
            setMsg("Server completion + quota…");
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
            window.location.href = return_to;
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
      <h1 className="text-xl font-bold">Pi Ödeme</h1>
      <p className="mt-2 text-sm text-gray-600">
        Bu sayfa Pi Browser içinde çalışır. Paket: <b>{package_code || "-"}</b>
      </p>

      <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-sm">{msg}</div>

        {pkg && (
          <div className="mt-3 text-sm text-gray-700">
            <div><b>{pkg.title}</b></div>
            <div>{pkg.price_pi} PI</div>
          </div>
        )}

        <button
          className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          onClick={startPayment}
          disabled={!canStart}
        >
          {loading ? "İşleniyor…" : "Pay with Pi"}
        </button>

        <div className="mt-3 text-xs text-gray-500">
          Not: Otomatik onay, Pi Server /complete yanıtına göre verilir.
        </div>
      </div>

      {/* Pi SDK */}
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
