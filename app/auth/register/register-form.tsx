"use client";

import React, { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    setMsg("Kayıt olunuyor…");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!json.ok) {
        setMsg(json.error || "Register failed");
        return;
      }
      setMsg("Kayıt başarılı ✅ (Email doğrulaması gerekebilir)");
    } catch (e: any) {
      setMsg(e?.message || "unknown");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-3xl font-black">KAYIT OL</h1>

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
        onClick={handleRegister}
        className="w-full px-4 py-2 rounded bg-black text-white font-bold"
      >
        HESAP OLUŞTUR
      </button>

      <div className="text-xs text-gray-500">{msg}</div>

      <div className="text-sm">
        Zaten hesabın var mı?{" "}
        <a className="underline" href="/auth/login">
          Giriş Yap
        </a>
      </div>
    </div>
  );
}
