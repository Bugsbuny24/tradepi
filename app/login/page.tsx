// app/login/page.tsx
import { signIn } from '@/app/actions/auth'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'

export default function LoginPage({ 
  searchParams 
}: { 
  searchParams: { message?: string } 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-black">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl mb-4 text-white">
            <LayoutGrid size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Tekrar Hoş Geldin</h1>
        </div>

        {/* Hata Mesajı Gösterimi */}
        {searchParams?.message && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium text-center">
            {searchParams.message}
          </div>
        )}

        <form action={signIn} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">E-posta</label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Şifre</label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all">
            Giriş Yap
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">Kaydol</Link>
        </p>
      </div>
    </div>
  )
}
