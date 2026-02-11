
"use client";

import { useMemo, useState } from "react";

type Props = {
  initialError?: string | null;
};

export default function LoginForm({ initialError }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>(initialError ?? "");

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6 && !loading;
  }, [email, password, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setMsg(data?.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }

      // Cookie set edildi → dashboard'a git.
      window.location.href = "/dashboard";
    } catch (err: any) {
      setMsg(err?.message || "Bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gray-400"
        placeholder="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gray-400"
        placeholder="Şifre"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        disabled={!canSubmit}
        className="w-full rounded-2xl bg-black px-4 py-3 font-extrabold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
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
