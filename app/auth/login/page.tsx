export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string; checkEmail?: string };
}) {
  const nextPath = searchParams?.next || "/dashboard";
  const err = searchParams?.error;
  const checkEmail = searchParams?.checkEmail;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-[40px] border border-yellow-500/10 bg-[#050505] p-10 shadow-[0_0_80px_-20px_rgba(251,191,36,0.15)]">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-yellow-500 uppercase">
            Giriş Yap
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-gray-600">
            SnapLogic Veri Ağına Bağlan
          </p>
        </div>

        {checkEmail ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black p-4 text-xs text-gray-300">
            Mailine doğrulama linki gitti. Onayladıktan sonra giriş yap.
          </div>
        ) : null}

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-black p-4 text-xs text-red-300">
            {decodeURIComponent(err)}
          </div>
        ) : null}

        <form className="mt-10 space-y-4" action="/api/auth/login" method="POST">
          <input type="hidden" name="next" value={nextPath} />

          <input
            className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-800"
            name="email"
            type="email"
            placeholder="E-POSTA"
            required
          />
          <input
            className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-800"
            name="password"
            type="password"
            placeholder="ŞİFRE"
            required
          />
          <button className="w-full rounded-2xl bg-yellow-500 py-4 text-xs font-black uppercase text-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-500/20">
            Sisteme Giriş Yap
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
          Hesabın yok mu?{" "}
          <a
            className="font-bold text-white underline decoration-yellow-500 decoration-2 underline-offset-4"
            href={`/auth/register?next=${encodeURIComponent(nextPath)}`}
          >
            Kayıt Ol
          </a>
        </div>
      </div>
    </main>
  );
}
