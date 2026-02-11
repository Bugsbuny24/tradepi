import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const errorRaw = searchParams?.error;
  const error = Array.isArray(errorRaw) ? errorRaw[0] : errorRaw;

  return (
    <main className="min-h-screen grid place-items-center bg-white px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black">Giriş Yap</h1>
        <p className="mt-1 text-gray-500">SnapLogic hesabınla giriş yap</p>

        <div className="mt-6">
          <LoginForm initialError={error ?? ""} />
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Hesabın yok mu?{" "}
          <Link href="/auth/register" className="font-semibold underline">
            Kayıt ol
          </Link>
        </div>
      </div>
    </main>
  );
}
