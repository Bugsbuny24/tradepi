import { signUp } from '@/app/actions/auth'
import Link from 'next/link'
import { UserPlus, Loader2 } from 'lucide-react'
import { Suspense } from 'react'

export default function RegisterPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <RegisterForm message={searchParams?.message} />
    </Suspense>
  )
}

function RegisterForm({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-black">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-2xl mb-4 text-white shadow-lg shadow-emerald-200">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Ücretsiz Başla</h1>
          <p className="text-slate-500 text-sm">SnapLogic.io dünyasına katıl.</p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium text-center">
            {message}
          </div>
        )}

        <form action={signUp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">E-posta</label>
            <input name="email" type="email" required placeholder="isim@sirket.com" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Şifre</label>
            <input name="password" type="password" required placeholder="••••••••" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black bg-white" />
          </div>
          <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]">
            Hesap Oluştur
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Zaten üye misin? <Link href="/login" className="text-blue-600 font-bold hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  )
}
