export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-[40px] border border-white/5 bg-[#050505] p-10 shadow-[0_0_100px_-20px_rgba(251,191,36,0.1)]">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-yellow-500 uppercase">Giriş Yap</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-gray-600">SnapLogic Veri Ağına Bağlan</p>
        </div>

        <form className="mt-10 space-y-4" action="/auth/login" method="post">
          <input
            className="w-full rounded-2xl border border-white/10 bg-black p-4 text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-800"
            name="email"
            type="email"
            placeholder="E-posta Adresi"
            required
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-black p-4 text-white outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-800"
            name="password"
            type="password"
            placeholder="Şifre"
            required
          />
          <button className="w-full rounded-2xl bg-yellow-500 py-4 text-sm font-black uppercase text-black transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-500/20">
            Sisteme Gir
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          Hesabın yok mu? <a className="font-bold text-white underline decoration-yellow-500 underline-offset-4" href="/auth/register">Kayıt Ol</a>
        </div>
      </div>
    </main>
  );
}
