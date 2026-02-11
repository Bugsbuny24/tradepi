"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnon);

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const errorParam = useMemo(() => {
    const e = searchParams.get("error");
    return e ? decodeURIComponent(e) : "";
  }, [searchParams]);

  useEffect(() => {
    if (errorParam) setMsg(errorParam);
  }, [errorParam]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      setMsg("Giriş başarılı ✅");
      router.replace("/dashboard");
      router.refresh();
    } catch (err: any) {
      setMsg(err?.message || "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border p-6">
      <h1 className="text-2xl font-black">Giriş Yap</h1>
      <p className="text-sm text-gray-500 mt-1">
        SnapLogic hesabınla giriş yap
      </p>

      <form onSubmit={onLogin} className="mt-6 flex flex-col gap-3">
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 rounded-xl font-bold bg-black text-white disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/auth/register")}
          className="text-sm underline text-gray-600"
        >
          Hesabın yok mu? Kayıt ol
        </button>

        {msg ? (
          <div className="text-sm mt-2 text-red-600 break-words">{msg}</div>
        ) : null}
      </form>
    </div>
  );
        }
