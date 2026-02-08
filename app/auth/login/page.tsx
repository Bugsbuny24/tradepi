export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#000] p-6 text-white">
      <div className="w-full max-w-md space-y-8 rounded-[40px] border border-white/5 bg-[#050505] p-10 shadow-[0_0_100px_-20px_rgba(251,191,36,0.1)]">
        <div className="text-center">
          <h1 className="text-5xl font-black italic tracking-tighter text-yellow-500 uppercase leading-none">Giriş</h1>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gray-500">SnapLogic Veri Ağına Bağlan</p>
        </div>

        <form className="mt-10 space-y-4" action="/auth/login" method="post">
          <div className="space-y-2">
            <input
              className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-700"
              name="email"
              type="email"
              placeholder="E-POSTA"
              required
            />
            <input
              className="w-full rounded-2xl border border-white/5 bg-black p-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-700"
              name="password"
              type="password"
              placeholder="ŞİFRE"
              required
            />
          </div>
          <button className="w-full rounded-2xl bg-yellow-500 py-4 text-xs font-black uppercase text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)] active:scale-95">
            Sisteme Giriş Yap
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-600">
          Hesabın yok mu? <a className="font-bold text-white underline decoration-yellow-500 decoration-2 underline-offset-4" href="/auth/register">Kayıt Ol</a>
        </div>
      </div>
    </main>
  );
}
