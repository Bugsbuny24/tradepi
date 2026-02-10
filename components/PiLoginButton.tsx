"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function PiAuthButton() {
  const router = useRouter();

  const [sdkReady, setSdkReady] = useState(false);
  const [status, setStatus] = useState<string>("");

  // Sandbox kontrol (istersen env ile yönet)
  const sandbox = useMemo(() => {
    // Prod'da false yaparsın. Şimdilik dev/test için hostname’den anla:
    if (typeof window === "undefined") return true;
    return window.location.hostname.includes("localhost") || window.location.hostname.includes("vercel");
  }, []);

  useEffect(() => {
    let t: any;

    const waitForPi = async () => {
      if (window.Pi) {
        try {
          await window.Pi.init({ version: "2.0", sandbox });
          setSdkReady(true);
          setStatus("Pi SDK hazır ✅");
        } catch (e: any) {
          setStatus("Pi SDK init hata: " + (e?.message || "unknown"));
        }
        return;
      }

      // Pi objesi biraz geç gelirse diye polling
      let tries = 0;
      t = setInterval(async () => {
        tries++;
        if (window.Pi) {
          clearInterval(t);
          try {
            await window.Pi.init({ version: "2.0", sandbox });
            setSdkReady(true);
            setStatus("Pi SDK hazır ✅");
          } catch (e: any) {
            setStatus("Pi SDK init hata: " + (e?.message || "unknown"));
          }
        }
        if (tries > 20) {
          clearInterval(t);
          setStatus("Pi SDK bulunamadı. Pi Browser içinde açmalısın.");
        }
      }, 150);
    };

    waitForPi();

    return () => {
      if (t) clearInterval(t);
    };
  }, [sandbox]);

  const handlePiAuth = async () => {
    setStatus("Tıklandı… auth başlıyor ⏳");

    if (!window.Pi) {
      setStatus("Pi SDK yok. Pi Browser içinde açmalısın.");
      return;
    }

    try {
      // Pi SDK bunu istiyor: incomplete payment handler
      const onIncompletePaymentFound = (payment: any) => {
        console.log("Incomplete payment:", payment);
        // İstersen burada backend’e /api/pi/complete gibi endpoint’lere yollarsın
      };

      // Kullanacağın scope’lar
      const scopes = ["username", "payments"];

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

      console.log("PI AUTH OK:", auth);
      setStatus(`Giriş başarılı ✅ @${auth?.user?.username || "unknown"}`);

      // Şimdilik hızlı kanıt: localStorage'a yaz (istersen sonra Supabase ile bağlarız)
      try {
        localStorage.setItem("pi_username", auth?.user?.username || "");
        localStorage.setItem("pi_auth", JSON.stringify(auth || {}));
      } catch {}

      // İstersen yönlendir:
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      console.error("Pi authenticate error:", e);
      setStatus("Pi auth hata: " + (e?.message || "unknown"));
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handlePiAuth}
        className="px-6 py-3 rounded-xl font-black bg-yellow-500 text-black hover:opacity-90 active:scale-95 transition"
      >
        Pi Network ile Giriş Yap
      </button>

      <div className="text-xs text-gray-400">
        {sdkReady ? "SDK: Ready" : "SDK: Loading…"} {status ? `• ${status}` : ""}
      </div>
    </div>
  );
}
