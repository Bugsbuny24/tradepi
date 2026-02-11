import PiLoginButton from "@/components/PiLoginButton";

export default function PiAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-black">Pi Login</h1>
        <p className="text-sm text-gray-500">
          Bu giriş sadece Pi Browser içinde çalışır.
        </p>
        <PiLoginButton />
      </div>
    </div>
  );
}
