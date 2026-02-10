"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    let t: any;
    let tries = 0;

    const init = async () => {
      try {
        if (!window.Pi) return;

        // Testnet/sandbox: true (prod’da false yaparsın)
        await window.Pi.init({ version: "2.0", sandbox: true });

        setReady(true);
        setMsg("Pi SDK hazır ✅");
      } catch (e: any) {
        setMsg("Pi init hata: " + (e?.message || "unknown"));
      }
    };

    // Pi SDK bazen geç yükleniyor → bekle
    t = setInterval(async () => {
      tries++;
      if (window.Pi) {
        clearInterval(t);
        await init();
      }
      if (tries > 20) {
        clearInterval(t);
        setMsg("Pi SDK bulunamadı. Pi Browser ile aç.");
      }
    }, 150);

    return () => clearInterval(t);
  }, []);

  const handleClick = async () => {
    setMsg("Auth başlıyor ⏳");

    if (!window.Pi) {
      setMsg("Pi SDK yok. Pi Browser ile aç.");
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
      <div className="text-xs text-gray-400">
        {ready ? "SDK: Ready" : "SDK: Loading…"} {msg ? `• ${msg}` : ""}
      </div>
    </div>
  );
}
