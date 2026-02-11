"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isPiBrowser, waitForPi } from "@/lib/pi";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function PiAuthButton() {
  const router = useRouter();
  const [pi, setPi] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("SDK: Loading…");
  const sandbox = false; // prod: false | testnet/dev deniyorsan true yap

  useEffect(() => {
    (async () => {
      const Pi = await waitForPi(8000);

      if (!Pi) {
        setMsg(
          `SDK gelmedi • sandbox: ${String(sandbox)} • ` +
            (isPiBrowser()
              ? "Pi Browser ama SDK yüklenmedi."
              : "Pi SDK yok. Bu buton sadece Pi Browser’da çalışır.")
        );
        return;
      }

      setPi(Pi);

      try {
        // init her sayfa açılışında 1 kez
        await Pi.init({ version: "2.0", sandbox });
        setReady(true);
        setMsg(`SDK: Ready • sandbox: ${String(sandbox)}`);
      } catch (e: any) {
        setMsg("Pi init hata: " + (e?.message || "unknown"));
      }
    })();
  }, [sandbox]);

  const handleClick = async () => {
    if (!pi || !ready) {
      setMsg("SDK hazır değil… Pi Browser içinde tekrar dene.");
      return;
    }

    setMsg("Auth başlıyor ⏳");

    try {
      const scopes = ["username"]; // payments lazım değilse çıkar (daha az hata)
      const onIncompletePaymentFound = (payment: any) =>
        console.log("Incomplete payment:", payment);

      const auth = await pi.authenticate(scopes, onIncompletePaymentFound);

      // auth geldi → dashboard’a geç
      localStorage.setItem("pi_auth", JSON.stringify(auth || {}));
      localStorage.setItem("pi_username", auth?.user?.username || "");

      setMsg(`Giriş başarılı ✅ @${auth?.user?.username || "unknown"}`);

      router.replace("/dashboard");
      router.refresh();
    } catch (e: any) {
      console.error(e);
      setMsg("Pi auth hata: " + (e?.message || "unknown"));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={!ready}
        className="px-6 py-3 rounded-xl font-black bg-yellow-500 text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition"
      >
        Pi Network ile Giriş Yap
      </button>

      <div className="text-xs text-gray-400 text-center">{msg}</div>
    </div>
  );
}
