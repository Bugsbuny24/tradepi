"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterForm({
  nextPath,
  err,
}: {
  nextPath: string;
  err?: string;
}) {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // URL’den gelen hata (redirect ile dönen)
  const errorText = useMemo(() => {
    const e = err || "";
    if (!e) return "";
    if (e === "missing_fields") return "E-posta ve şifre zorunlu.";
    // Supabase rate limit mesajı vb. olduğu gibi göster
    return e;
  }, [err]);

  // Supabase “after 59 seconds” tarzı hata gelirse otomatik sayaç başlat
  useEffect(() => {
    if (!errorText) return;

    const m = errorText.match(/after\s+(\d+)\s+seconds?/i);
    if (m?.[1]) {
      const s = Math.max(1, parseInt(m[1], 10));
      setCooldown(s);
    }
  }, [errorText]);

  // sayaç
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-3xl border border-yellow-500/20 bg-black/50 backdrop-blur p-6 shadow-[0_0_80px_rgba(255,200,0,0.12)]">
        <h1 className="text-4xl font-extrabold tracking-wide text-yellow-400 text-center">
          KAYIT OL
        </h1>
        <p className="text-center text-xs mt-2 text-white/50 tracking-[0.25em]">
          SNAPLOGIC HESABI OLUŞTUR
        </p>

        {errorText ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {cooldown > 0 ? (
              <div>
                <div className="font-medium">
                  Güvenlik için {cooldown} saniye beklemen gerekiyor.
                </div>
                <div className="text-sm opacity-90 mt-1">{errorText}</div>
              </div>
            ) : (
              <div className="text-sm">{errorText}</div>
            )}
          </div>
        ) : null}

        <form
          action="/api/auth/register"
          method="post"
          className="mt-8 space-y-4"
          onSubmit={() => {
            // ⚠️ Burada cooldown set etmiyoruz.
            // cooldown sadece server’dan rate-limit hatası gelirse başlıyor.
            setSubmitting(true);
          }}
        >
          <input type="hidden" name="next" value={nextPath} />

          {/* ÖNEMLİ: inputları submitting ile disabled etmiyoruz */}
          <input
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-4 text-white outline-none focus:border-yellow-500/40"
            placeholder="E-POSTA"
            type="email"
            name="email"
            autoComplete="email"
            required
            disabled={cooldown > 0}
          />

          <input
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-4 text-white outline-none focus:border-yellow-500/40"
            placeholder="ŞİFRE"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            disabled={cooldown > 0}
          />

          <button
            type="submit"
            disabled={cooldown > 0 || submitting}
            className="w-full rounded-2xl py-4 font-bold bg-yellow-500 text-black shadow-[0_0_30px_rgba(255,200,0,0.25)] disabled:opacity-60"
          >
            {cooldown > 0 ? `BEKLE (${cooldown})` : submitting ? "GÖNDERİLİYOR..." : "HESAP OLUŞTUR"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Zaten hesabın var mı?{" "}
          <a className="text-yellow-400 underline underline-offset-4" href="/auth/login">
            GİRİŞ YAP
          </a>
        </div>
      </div>
    </div>
  );
}
