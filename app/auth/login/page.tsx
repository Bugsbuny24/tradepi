"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const nextUrl = useMemo(() => sp.get("next") || "/dashboard", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setMsg("Giriş yapılıyor…");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!json.ok) {
        setMsg(json.error || "Login failed");
        return;
      }

      setMsg("Başarılı ✅");
      router.push(nextUrl);
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message || "unknown");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-3xl font-black">GİRİŞ YAP</h1>

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 rounded bg-black text-white font-bold"
        >
          GİRİŞ
        </button>

        <div className="text-xs text-gray-500">{msg}</div>

        <div className="text-sm">
          Hesabın yok mu?{" "}
          <a className="underline" href="/auth/register">
            Kayıt Ol
          </a>
        </div>

        <div className="text-sm">
          Pi ile mi?{" "}
          <a className="underline" href="/auth/pi">
            Pi Network ile giriş
          </a>
        </div>
      </div>
    </div>
  );
}
