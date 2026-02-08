export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-[40px] border border-white/5 bg-[#050505] p-10">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-yellow-500 uppercase">Kayıt Ol</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-gray-600">Yeni Bir Veri Evreni Başlat</p>
        </div>

        <form className="mt-10 space-y-4" action="/auth/register" method="post">
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
            placeholder="ŞİFRE (MİN 6 KARAKTER)"
            minLength={6}
            required
          />
          <button className="w-full rounded-2xl bg-yellow-500 py-4 text-xs font-black uppercase text-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-500/20">
            Hesabımı Oluştur
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
          Zaten üye misin? <a className="font-bold text-white underline decoration-yellow-500 decoration-2 underline-offset-4" href="/auth/login">Giriş Yap</a>
        </div>
      </div>
    </main>
  );
}
