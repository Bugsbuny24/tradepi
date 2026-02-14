import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Giriş yapmışsa dashboard'a yönlendir
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-slate-900 mb-4">
          SnapLogic
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Veri görselleştirme platformu
        </p>
        <Link 
          href="/auth"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg"
        >
          Başla →
        </Link>
      </div>
    </div>
  )
}
