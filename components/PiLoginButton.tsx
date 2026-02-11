"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Pi?: any;
  }
}

function setCookie(name: string, value: string, days = 30) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

export default function PiLoginButton() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");

  const sandbox = useMemo(() => {
    if (typeof window === "undefined") return true;
    const h = window.location.hostname.toLowerCase();
    const isProd = h === "tradepigloball.co" || h === "www.tradepigloball.co";
    return !isProd;
  }, []);

  useEffect(() => {
    let t: any;
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

  const handleClick = async () => {
    setMsg("Auth başlıyor ⏳");

    if (!window.Pi) {
      setMsg("Pi SDK yok. Bu buton sadece Pi Browser’da çalışır.");
      return;
    }
    if (!ready) {
      setMsg("SDK hazır değil… 1-2 sn bekle.");
      return;
    }

    try {
      await window.Pi.init({ version: "2.0", sandbox });

      const auth = await Promise.race([
        window.Pi.authenticate(["username"], () => {}),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Auth ekranı açılmadı (timeout).")), 10000)
        ),
      ]);

      const username = auth?.user?.username || "";
      if (!username) throw new Error("Pi auth döndü ama username boş geldi.");

      setCookie("pi_username", username);

      try {
        localStorage.setItem("pi_username", username);
        localStorage.setItem("pi_auth", JSON.stringify(auth || {}));
      } catch {}

      setMsg(`Giriş başarılı ✅ @${username}`);

      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      console.error("Pi auth error:", e);
      setMsg("Pi auth hata: " + (e?.message || JSON.stringify(e) || "unknown"));
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
        {ready ? "SDK: Ready" : "SDK: Loading…"} • sandbox: {sandbox ? "true" : "false"}
        {msg ? ` • ${msg}` : ""}
      </div>
    </div>
  );
}
