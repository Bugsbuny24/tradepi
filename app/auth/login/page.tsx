export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string; checkEmail?: string; email?: string; info?: string };
}) {
  const nextPath = searchParams?.next || "/dashboard";
  const checkEmail = searchParams?.checkEmail === "1";
  const emailPrefill = searchParams?.email ? decodeURIComponent(searchParams.email) : "";
  const info = searchParams?.info || "";
  const rawErr = searchParams?.error ? decodeURIComponent(searchParams.error) : "";

  const friendlyError =
    rawErr === "missing_fields"
      ? "E-posta ve şifre zorunlu."
      : rawErr === "missing_email"
      ? "E-posta zorunlu."
      : rawErr === "account_exists"
      ? "Bu e-posta zaten kayıtlı. Giriş yap ya da doğrulama mailini tekrar gönder."
      : rawErr === "email_not_confirmed"
      ? "E-posta doğrulanmamış. Mail kutunu kontrol et veya doğrulama mailini tekrar gönder."
      : rawErr || "";

  const friendlyInfo =
    info === "resend_ok" ? "Doğrulama maili tekrar gönderildi. Gelen kutunu kontrol et." : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-[40px] border border-yellow-500/10 bg-black p-10 shadow-[0_0_80px_-20px_rgba(245,158,11,0.35)]">
        <h1 className="text-center text-4xl italic tracking-tighter text-yellow-500 uppercase">
          Giriş Yap
        </h1>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-gray-600">
          SnapLogic Veri Ağına Bağlan
        </p>

        {(checkEmail || friendlyError || friendlyInfo) && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-black p-4 text-xs text-red-200">
            {friendlyInfo ? <div className="text-green-200">{friendlyInfo}</div> : null}
            {checkEmail && !friendlyError && !friendlyInfo ? (
              <div>Mailine doğrulama linki gitti. Onayladıktan sonra giriş yap.</div>
            ) : null}
            {friendlyError ? <div>{friendlyError}</div> : null}
          </div>
        )}

        <form className="mt-10 space-y-4" action="/api/auth/login" method="POST">
          <input type="hidden" name="next" value={nextPath} />

          <input
            className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/40"
            name="email"
            type="email"
            placeholder="E-POSTA"
            defaultValue={emailPrefill}
            required
          />

          <input
            className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/40"
            name="password"
            type="password"
            placeholder="ŞİFRE"
            required
          />

          <button className="w-full rounded-2xl bg-yellow-500 p-4 text-sm font-black uppercase text-black">
            Sisteme Giriş Yap
          </button>
        </form>

        {/* RESEND CONFIRM */}
        <form className="mt-3" action="/api/auth/resend" method="POST">
          <input type="hidden" name="next" value={nextPath} />
          <input type="hidden" name="email" value={emailPrefill} />
          <button
            type="submit"
            className="w-full rounded-2xl border border-yellow-500/30 bg-black p-3 text-[11px] font-semibold uppercase text-yellow-200"
          >
            Doğrulama Mailini Tekrar Gönder
          </button>
          <p className="mt-2 text-center text-[10px] text-gray-600">
            (Aynı maili 1 dakika içinde tekrar istemeye çalışırsan Supabase “59 seconds” diyebilir.)
          </p>
        </form>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
          Hesabın yok mu?{" "}
          <a className="font-bold text-white underline decoration-yellow-500 decoration-2 underline-offset-4" href={`/auth/register?next=${encodeURIComponent(nextPath)}`}>
            Kayıt Ol
          </a>
        </div>
      </div>
    </main>
  );
}
