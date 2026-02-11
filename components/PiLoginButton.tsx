"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function PiLoginButton() {
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");
  const initOnce = useRef(false);

  // prod’da false, testte true
  const sandbox =
    (process.env.NEXT_PUBLIC_PI_SANDBOX || "false").toLowerCase() === "true";

  useEffect(() => {
    let t: any;
    let tries = 0;

    const init = async () => {
      if (initOnce.current) return;
      initOnce.current = true;

      try {
        if (!window.Pi) return;

        await window.Pi.init({ version: "2.0", sandbox });
        setReady(true);
        setMsg(`Pi SDK hazır ✅ (sandbox: ${sandbox})`);
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
      if (tries > 40) {
        clearInterval(t);
        setMsg("Pi SDK bulunamadı. Pi Browser ile aç.");
      }
    }, 150);

    return () => clearInterval(t);
  }, [sandbox]);

  const handleClick = async () => {
    setMsg("Auth başlıyor ⏳");

    try {
      if (!window.Pi) {
        setMsg("Pi SDK yok. Pi Browser ile aç.");
        return;
      }

      const scopes = ["username"]; // şimdilik yeterli (payments gerekirse ekleriz)

      const onIncompletePaymentFound = (payment: any) => {
        console.log("Incomplete payment:", payment);
      };

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

      const username = auth?.user?.username;
      if (!username) {
        setMsg("Pi auth OK ama username gelmedi ❌");
        return;
      }

      setMsg(`Pi giriş başarılı ✅ @${username}`);

      // ✅ server cookie set (middleware bunu görecek)
      const r = await fetch("/api/pi/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ username }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setMsg("Session set hata: " + (j?.error || "unknown"));
        return;
      }

      // ✅ Hard redirect: cookie kesin görünür
      window.location.href = "/dashboard";
    } catch (e: any) {
      console.error(e);
      setMsg("Pi auth hata: " + (e?.message || "unknown"));
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

      <div className="text-xs text-gray-400 text-center">
        {ready ? "SDK: Ready" : "SDK: Loading…"} • sandbox: {String(sandbox)}{" "}
        {msg ? `• ${msg}` : ""}
      </div>
    </div>
  );
}
