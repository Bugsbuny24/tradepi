"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setMsg("Giriş başarılı ✅");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message || "Giriş hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        className="w-full px-4 py-3 rounded-xl border"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="w-full px-4 py-3 rounded-xl border"
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        className="w-full px-4 py-3 rounded-xl font-black bg-black text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Giriş..." : "Giriş Yap"}
      </button>

      <div className="text-sm text-gray-600">
        Hesabın yok mu?{" "}
        <a className="underline" href="/auth/register">
          Kayıt ol
        </a>
      </div>

      {msg ? <div className="text-sm">{msg}</div> : null}
    </form>
  );
}
