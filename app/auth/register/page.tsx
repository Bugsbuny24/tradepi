export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Kayıt</h1>

      <form className="mt-6 space-y-3" action="/auth/register" method="post">
        <input
          className="w-full rounded-lg border p-2"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded-lg border p-2"
          name="password"
          type="password"
          placeholder="Şifre (min 6)"
          minLength={6}
          required
        />
        <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">
          Kayıt Ol
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Zaten hesabın var mı?{" "}
        <a className="font-semibold underline" href="/auth/login">
          Giriş yap
        </a>
      </p>
    </main>
  );
}
