export const dynamic = "force-dynamic";
"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(() => {
    const n = searchParams.get("next");
    // Güvenlik: sadece site içi path kabul edelim
    if (!n) return "/dashboard";
    if (n.startsWith("http://") || n.startsWith("https://")) return "/dashboard";
    if (!n.startsWith("/")) return "/dashboard";
    return n;
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("next", nextPath);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      // JSON yerine HTML/redirect gelirse patlamasın diye:
      const text = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Login API JSON dönmedi. (Muhtemelen redirect/HTML geldi) İlk 200 karakter: " +
            text.slice(0, 200)
        );
      }

      if (!res.ok || !data?.success) {
        setErrorMsg(data?.error || "Giriş yapılamadı. Bilgileri kontrol et.");
        return;
      }

      const go = typeof data?.next === "string" ? data.next : nextPath;
      router.push(go);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "Beklenmeyen hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 8 }}>
        GİRİŞ YAP
      </h1>

      <p style={{ marginBottom: 16, opacity: 0.8 }}>
        SnapLogic hesabınla oturum aç.
      </p>

      {errorMsg ? (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #ef4444",
            color: "#991b1b",
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {errorMsg}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 700 }}>Email</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@gmail.com"
            required
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 16,
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 700 }}>Şifre</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              fontSize: 16,
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #0f172a",
            background: loading ? "#94a3b8" : "#0f172a",
            color: "white",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
        </button>

        <div style={{ marginTop: 6, opacity: 0.85 }}>
          Hesabın yok mu?{" "}
          <a href={`/auth/signup?next=${encodeURIComponent(nextPath)}`}>
            Kayıt ol
          </a>
        </div>
      </form>
    </div>
  );
            }
