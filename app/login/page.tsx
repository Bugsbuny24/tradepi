import { signIn } from '@/app/actions/auth'
import Link from 'next/link'
import { LayoutGrid, Loader2 } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl mb-4 text-white shadow-lg shadow-blue-200">
            <LayoutGrid size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Tekrar Hoş Geldin</h1>
          <p className="text-slate-500 text-sm">SnapLogic.io hesabına giriş yap.</p>
        </div>

        <form action={signIn} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">E-posta</label>
            <input
              name="email"
              type="email"
              required
              placeholder="isim@sirket.com"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-slate-700">Şifre</label>
              <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Şifremi Unuttum</Link>
            </div>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-100">
            Giriş Yap
          </button>

          {searchParams?.message && (
            <p className="text-center text-red-500 text-xs font-medium mt-4">{searchParams.message}</p>
          )}
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">Şimdi Kaydol</Link>
        </p>
      </div>
    </div>
  )
}
