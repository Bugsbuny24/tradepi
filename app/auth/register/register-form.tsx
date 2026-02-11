"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.error || "Kayıt başarısız.");
        setLoading(false);
        return;
      }

      setMsg("Kayıt başarılı ✅ (Email doğrulaması gerekebilir)");
      setLoading(false);

      // kayıt sonrası login'e gönder
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 800);
    } catch (e: any) {
      setMsg("Hata: " + (e?.message || "unknown"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gray-400"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gray-400"
        placeholder="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-black px-4 py-3 font-extrabold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Oluşturuluyor..." : "HESAP OLUŞTUR"}
      </button>

      {msg ? (
        <div
          className={
            "text-sm " +
            (msg.toLowerCase().includes("başarılı")
              ? "text-green-600"
              : "text-red-600")
          }
        >
          {msg}
        </div>
      ) : null}
    </form>
  );
}
