"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function niceError(raw?: string | null) {
  if (!raw) return null;
  const msg = decodeURIComponent(raw.replace(/\+/g, " "));
  if (msg.toLowerCase().includes("invalid login credentials")) {
    return "Hatalı e-posta ya da şifre.";
  }
  if (msg.toLowerCase().includes("email not confirmed")) {
    return "E-posta henüz doğrulanmamış. Aşağıdan doğrulama mailini yeniden gönderebilirsin.";
  }
  if (msg.toLowerCase().includes("pkce code verifier")) {
    return "Doğrulama linki farklı tarayıcıda açılmış görünüyor. Linki aynı tarayıcıda (Pi Browser) açmayı dene.";
  }
  return msg;
}

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const errorText = useMemo(() => niceError(sp.get("error")), [sp]);
  const isPiBrowser = typeof window !== "undefined" && (window as any).Pi;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setInfo(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.success) {
        const msg = json?.message || "Giriş başarısız.";
        router.replace(`/auth/login?error=${encodeURIComponent(msg)}`);
        return;
      }

      router.push(json?.redirectTo || "/");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    if (!email) {
      setInfo("Önce e-postanı yaz.");
      return;
    }
    setLoading(true);
    setInfo(null);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.success) {
        setInfo(json?.message || "Mail gönderilemedi.");
        return;
      }
      setInfo("Doğrulama maili tekrar gönderildi (1 dakika içinde tekrar istersen Supabase '59 seconds' diyebilir)." );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: 54, marginBottom: 12 }}>Giriş Yap</h1>
      <p style={{ fontSize: 18, marginBottom: 18 }}>SnapLogic Veri Ağına Bağlan</p>

      {errorText ? (
        <div style={{ padding: 12, border: "1px solid #fca5a5", marginBottom: 12 }}>
          {errorText}
        </div>
      ) : null}

      {info ? (
        <div style={{ padding: 12, border: "1px solid #86efac", marginBottom: 12 }}>
          {info}
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-POSTA"
          autoComplete="email"
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ŞİFRE"
          type="password"
          autoComplete="current-password"
          style={{ padding: 10, fontSize: 16 }}
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 14px" }}>
            {loading ? "..." : "Sisteme Giriş Yap"}
          </button>
          <button type="button" onClick={resendVerification} disabled={loading} style={{ padding: "10px 14px" }}>
            Doğrulama Mailini Tekrar Gönder
          </button>
          {isPiBrowser ? (
            <button type="button" onClick={() => router.push("/auth/pi")} style={{ padding: "10px 14px" }}>
              Pi ile Giriş
            </button>
          ) : null}
        </div>
      </form>

      <p style={{ opacity: 0.8, marginBottom: 14 }}>
        (Aynı maili 1 dakika içinde tekrar istemeye çalışırsan Supabase “59 seconds” diyebilir.)
      </p>

      <p>
        Hesabın yok mu? <a href="/auth/register">Kayıt Ol</a>
      </p>

      <p style={{ marginTop: 18, fontSize: 12, opacity: 0.7 }}>
        Pi Browser'da "PKCE code verifier" hatası görürsen: Doğrulama linkini aynı tarayıcıda aç (Gmail linki Chrome'a açılıyorsa kopyalayıp Pi Browser'a yapıştır).
      </p>
    </main>
  );
}
