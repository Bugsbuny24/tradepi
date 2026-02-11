"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = createBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // If you have email confirmation enabled, Supabase will send mail.
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMsg("Kayıt başarılı ✅ (Email doğrulaması gerekebilir)");
    // You can also redirect directly:
    // router.push("/auth/login");
    router.push("/auth/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 bg-white shadow-sm">
        <h1 className="text-3xl font-bold mb-6">KAYIT OL</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded-xl border p-3 bg-blue-50"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full rounded-xl border p-3 bg-blue-50"
            placeholder="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-black text-white py-3 font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Oluşturuluyor..." : "HESAP OLUŞTUR"}
          </button>

          {msg ? <p className="text-green-600 text-sm">{msg}</p> : null}
          {error ? <p className="text-red-600 text-sm">{error}</p> : null}

          <div className="text-sm text-gray-600">
            Zaten hesabın var mı?{" "}
            <Link className="underline" href="/auth/login">
              Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
