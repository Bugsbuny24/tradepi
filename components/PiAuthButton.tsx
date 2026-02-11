"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { waitForPi, isPiBrowser } from "@/lib/pi";

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
  const sandbox = false; // test için true, prod için false

  useEffect(() => {
    (async () => {
      const Pi = await waitForPi(10000);

      if (!Pi) {
        setMsg(
          isPiBrowser()
            ? "Pi Browser ama SDK yüklenmedi."
            : "Pi SDK yok. Bu buton sadece Pi Browser’da çalışır."
        );
        return;
      }

      setPi(Pi);

      try {
        await Pi.init({ version: "2.0", sandbox });
        setReady(true);
        setMsg(`SDK: Ready • sandbox: ${String(sandbox)}`);
      } catch (e: any) {
        setMsg("Pi init hata: " + (e?.message || "unknown"));
      }
    })();
  }, [sandbox]);

  const setPiCookies = (username: string) => {
    const maxAge = 60 * 60 * 24 * 30; // 30 gün
    // HTTPS'te çalışsın diye Secure ekliyoruz
    document.cookie = `pi_authed=1; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
    document.cookie = `pi_user=${encodeURIComponent(
      username || ""
    )}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
  };

  const handleClick = async () => {
    if (!pi || !ready) {
      setMsg("SDK hazır değil…");
      return;
    }

    setMsg("Auth başlıyor ⏳");

    try {
      const scopes = ["username"]; // payments gerekmezse alma (daha az sorun)
      const onIncompletePaymentFound = (payment: any) =>
        console.log("Incomplete payment:", payment);

      const auth = await pi.authenticate(scopes, onIncompletePaymentFound);

      const username = auth?.user?.username || "";

      // ✅ Middleware görebilsin diye cookie yaz
      setPiCookies(username);

      // debug istersen kalsın
      localStorage.setItem("pi_auth", JSON.stringify(auth || {}));
      localStorage.setItem("pi_username", username);

      setMsg(`Giriş başarılı ✅ @${username || "unknown"}`);

      // ✅ push yerine replace daha temiz
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
