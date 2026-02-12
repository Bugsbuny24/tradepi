"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 bg-white shadow-sm">
        <h1 className="text-3xl font-bold mb-6">Kayıt Ol</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded-xl border p-3 bg-blue-50"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl border p-3 bg-blue-50"
            placeholder="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-black text-white py-3 rounded-xl">
            Kayıt Ol
          </button>

          <Link href="/auth/login" className="text-sm underline block text-center">
            Zaten hesabın var mı?
          </Link>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </main>
  );
}
