import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black mb-6">Kayıt Ol</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
