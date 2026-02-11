"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function RegisterForm() {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // İstersen email doğrulama sonrası buraya döner
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/login`
              : undefined,
        },
      });

      if (error) throw error;

      // Eğer email confirmation açıksa session gelmeyebilir.
      if (!data.session) {
        setMsg("Kayıt başarılı ✅ Email doğrulaması gerekebilir.");
        router.push("/auth/login");
        router.refresh();
        return;
      }

      setMsg("Kayıt + giriş başarılı ✅");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message || "Kayıt hatası");
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
        minLength={6}
      />

      <button
        className="w-full px-4 py-3 rounded-xl font-black bg-black text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Kayıt..." : "Hesap Oluştur"}
      </button>

      <div className="text-sm text-gray-600">
        Zaten hesabın var mı?{" "}
        <a className="underline" href="/auth/login">
          Giriş Yap
        </a>
      </div>

      {msg ? <div className="text-sm">{msg}</div> : null}
    </form>
  );
}
