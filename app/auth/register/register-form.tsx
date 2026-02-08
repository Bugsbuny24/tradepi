"use client";

import { useEffect, useMemo, useState } from "react";

function parseWaitSeconds(msg: string) {
  // Supabase mesajı genelde: "request this after 59 seconds"
  const m = msg.match(/after\s+(\d+)\s+seconds/i);
  return m ? Number(m[1]) : null;
}

export default function RegisterForm({
  nextPath,
  err,
}: {
  nextPath: string;
  err: string;
}) {
  const initialWait = useMemo(() => parseWaitSeconds(err), [err]);
  const [cooldown, setCooldown] = useState<number>(initialWait ?? 0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-[40px] border border-yellow-500/10 bg-[#050505] p-10 shadow-[0_0_80px_-20px_rgba(251,191,36,0.15)]">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-yellow-500 uppercase">
            Kayıt Ol
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-gray-600">
            SnapLogic Hesabı Oluştur
          </p>
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-black p-4 text-xs text-red-300">
            {err}
          </div>
        ) : null}

        {cooldown > 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black p-4 text-xs text-gray-300">
            Güvenlik için bekleme var: <b>{cooldown}</b> sn
          </div>
        ) : null}

        <form
          className="mt-10 space-y-4"
          action="/api/auth/register"
          method="POST"
          onSubmit={() => {
            setSubmitting(true);
            // Kullanıcı iki kere basamasın
            setCooldown((c) => (c > 0 ? c : 60));
          }}
        >
          <input type="hidden" name="next" value={nextPath} />

          <input
            className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-800"
            name="email"
            type="email"
            placeholder="E-POSTA"
            required
            disabled={cooldown > 0 || submitting}
          />
          <input
            className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-800"
            name="password"
            type="password"
            placeholder="ŞİFRE"
            required
            disabled={cooldown > 0 || submitting}
          />

          <button
            className="w-full rounded-2xl bg-yellow-500 py-4 text-xs font-black uppercase text-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
            disabled={cooldown > 0 || submitting}
          >
            {cooldown > 0 ? `BEKLE (${cooldown}s)` : submitting ? "GÖNDERİLİYOR..." : "HESAP OLUŞTUR"}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
          Zaten hesabın var mı?{" "}
          <a
            className="font-bold text-white underline decoration-yellow-500 decoration-2 underline-offset-4"
            href={`/auth/login?next=${encodeURIComponent(nextPath)}`}
          >
            Giriş Yap
          </a>
        </div>
      </div>
    </main>
  );
}
