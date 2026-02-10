"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function PiLoginButton() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string>("");

  // ✅ Prod domain’de sandbox kapalı; vercel/localhost’ta açık
  const sandbox = useMemo(() => {
    if (typeof window === "undefined") return true;
    const host = window.location.hostname.toLowerCase();
    const isProd = host === "tradepigloball.co" || host === "www.tradepigloball.co";
    return !isProd;
  }, []);

  // (Opsiyonel) Pi Browser içinde misin? (Chrome’da genelde false)
  const isPiBrowser = useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    // Pi Browser user-agent çoğu zaman "PiBrowser" içeriyor
    return /pibrowser/i.test(ua);
  }, []);

  useEffect(() => {
    let interval: any;
    let tries = 0;

    const init = async () => {
      try {
        if (!window.Pi) return;

        await window.Pi.init({ version: "2.0", sandbox });
        setReady(true);
        setMsg(`Pi SDK hazır ✅ (sandbox: ${sandbox})`);
      } catch (e: any) {
        console.error("Pi init error:", e);
        setMsg("Pi init hata: " + (e?.message || JSON.stringify(e) || "unknown"));
      }
    };

    // Pi SDK bazen geç geliyor → bekle
    interval = setInterval(async () => {
      tries++;

      if (window.Pi) {
        clearInterval(interval);
        await init();
        return;
      }

      if (tries > 30) {
        clearInterval(interval);
        setMsg("Pi SDK bulunamadı. Pi Browser ile açmayı dene.");
      }
    }, 150);

    return () => clearInterval(interval);
  }, [sandbox]);

  const handleClick = async () => {
    // Pi Browser değilse en azından bilgi ver
    if (!isPiBrowser) {
      setMsg("Pi Browser’da değilsin gibi. Pi Browser içinde açmayı dene.");
      // Yine de denemeye devam edelim (bazı webview’larda çalışabiliyor)
    } else {
      setMsg("Auth başlıyor ⏳");
    }

    if (!window.Pi) {
      setMsg("Pi SDK yok. Pi Browser ile aç.");
      return;
    }

    // SDK init olmadan auth denemeyelim
    if (!ready) {
      setMsg("SDK henüz hazır değil… 1-2 saniye bekle ve tekrar dene.");
      return;
    }

    try {
      const scopes = ["username", "payments"];

      const onIncompletePaymentFound = (payment: any) => {
        console.log("Incomplete payment:", payment);
      };

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

      console.log("PI AUTH OK:", auth);
      setMsg(`Giriş başarılı ✅ @${auth?.user?.username || "unknown"}`);

      // Şimdilik kanıt: localStorage
      try {
        localStorage.setItem("pi_username", auth?.user?.username || "");
        localStorage.setItem("pi_auth", JSON.stringify(auth || {}));
      } catch {}

      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      console.error("Pi auth error full:", e);

      // Bazı hatalarda message boş olur → full dump bas
      const detail =
        e?.message ||
        e?.error ||
        (typeof e === "string" ? e : "") ||
        JSON.stringify(e);

      setMsg("Pi auth hata: " + (detail || "unknown"));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className="px-6 py-3 rounded-xl font-black bg-yellow-500 text-black hover:opacity-90 active:scale-95 transition"
      >
        Pi Network ile Giriş Yap
      </button>

      <div className="text-xs text-gray-400">
        {ready ? "SDK: Ready" : "SDK: Loading…"} • sandbox:{" "}
        {sandbox ? "true" : "false"} {msg ? `• ${msg}` : ""}
      </div>
    </div>
  );
}
