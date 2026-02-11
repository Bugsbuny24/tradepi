"use client";

import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

type Props = {
  sandbox?: boolean; // true = testnet/sandbox
};

export default function TestPiPaymentButton({ sandbox = true }: Props) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const isPiBrowser = useMemo(() => typeof window !== "undefined" && !!window.Pi, []);

  useEffect(() => {
    let t: any;
    let tries = 0;

    const init = async () => {
      try {
        await window.Pi.init({ version: "2.0", sandbox });
        setReady(true);
        setMsg(`Pi SDK hazır ✅ (sandbox: ${sandbox ? "true" : "false"})`);
      } catch (e: any) {
        setMsg("Pi init hata: " + (e?.message || "unknown"));
      }
    };

    t = setInterval(async () => {
      tries++;
      if (window.Pi) {
        clearInterval(t);
        await init();
      }
      if (tries > 30) {
        clearInterval(t);
        setMsg("Pi SDK bulunamadı. Pi Browser ile aç.");
      }
    }, 150);

    return () => clearInterval(t);
  }, [sandbox]);

  const pay = async () => {
    setBusy(true);
    setMsg("Ödeme başlıyor ⏳");

    try {
      if (!window.Pi) {
        setMsg("Pi SDK yok. Pi Browser ile aç.");
        return;
      }

      // 1) Pi auth (username + payments)
      const scopes = ["username", "payments"];
      const auth = await window.Pi.authenticate(scopes, () => {});
      const accessToken = auth?.accessToken;

      if (!accessToken) {
        setMsg("Auth token yok. Tekrar dene.");
        return;
      }

      // 2) Backend: payment create
      const createRes = await fetch("/api/pi/create-payment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: 0.01, // checklist için küçük tut
          memo: "Dev checklist test payment",
          metadata: { source: "developer-checklist" },
        }),
      });

      const created = await createRes.json();
      if (!createRes.ok) {
        throw new Error(created?.error || "create-payment failed");
      }

      // created.paymentId ve created.txid gibi alanlar
      const paymentId = created?.paymentId;
      if (!paymentId) throw new Error("paymentId yok");

      // 3) Pi SDK: ödeme akışı
      const payment = await window.Pi.createPayment(
        {
          amount: created.amount,
          memo: created.memo,
          metadata: created.metadata,
        },
        {
          onReadyForServerApproval: async (paymentIdFromPi: string) => {
            // Bazı SDK sürümleri paymentId’yi buradan verir; biz kendi paymentId’yi kullanıyoruz ama ikisini de gönder
            await fetch("/api/pi/complete-payment", {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                paymentId: paymentIdFromPi || paymentId,
                action: "approve",
              }),
            });
          },

          onReadyForServerCompletion: async (paymentIdFromPi: string, txid: string) => {
            const r = await fetch("/api/pi/complete-payment", {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                paymentId: paymentIdFromPi || paymentId,
                action: "complete",
                txid,
              }),
            });

            const data = await r.json();
            if (!r.ok) throw new Error(data?.error || "complete failed");

            setMsg(`✅ Ödeme tamamlandı! txid: ${data?.txid || txid}`);
          },

          onCancel: (paymentIdFromPi: string) => {
            setMsg(`İptal edildi: ${paymentIdFromPi}`);
          },

          onError: (error: any, paymentIdFromPi: string) => {
            setMsg(`Hata: ${paymentIdFromPi} • ${error?.message || "unknown"}`);
          },
        }
      );

      console.log("Pi payment flow result:", payment);
    } catch (e: any) {
      console.error(e);
      setMsg("Ödeme hata: " + (e?.message || "unknown"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        disabled={!ready || busy}
        onClick={pay}
        className={`px-4 py-2 rounded-xl font-bold ${
          !ready || busy ? "opacity-60" : "hover:opacity-90"
        } bg-purple-600 text-white transition`}
      >
        {busy ? "Processing…" : "Test Pi Payment (0.01π)"}
      </button>

      <div className="text-xs text-gray-500">
        {isPiBrowser ? "Pi Browser ✅" : "Pi Browser değil ❌"} •{" "}
        {ready ? "SDK: Ready" : "SDK: Loading…"} • {msg}
      </div>
    </div>
  );
                }
