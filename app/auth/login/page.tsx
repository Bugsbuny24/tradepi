import LoginForm from "./login-form";

type Props = {
  searchParams?: { error?: string };
};

export default function LoginPage({ searchParams }: Props) {
  const error = searchParams?.error ? decodeURIComponent(searchParams.error) : "";

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black mb-6">Giriş Yap</h1>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <LoginForm />

        <div className="mt-6 text-center text-sm text-gray-600">
          Hesabın yok mu?{" "}
          <a className="underline" href="/auth/register">
            Kayıt ol
          </a>
        </div>
      </div>
    </main>
  );
}
