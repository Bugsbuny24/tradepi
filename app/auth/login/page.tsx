export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Giriş</h1>

      <form className="mt-6 space-y-3" action="/auth/login" method="post">
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
          placeholder="Şifre"
          required
        />
        <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">
          Giriş Yap
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Hesabın yok mu?{" "}
        <a className="font-semibold underline" href="/auth/register">
          Kayıt ol
        </a>
      </p>

      <p className="mt-6 text-xs text-gray-500">
        Not: Email doğrulama açıksa, girişten önce mailini onaylaman gerekir.
      </p>
    </main>
  );
}
