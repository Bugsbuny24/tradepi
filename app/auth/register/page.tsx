// app/auth/register/page.tsx
import Link from "next/link";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-6">KAYIT OL</h1>
        <RegisterForm />
        <div className="mt-4 text-sm text-center">
          Zaten hesabın var mı?{" "}
          <Link className="underline" href="/auth/login">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
