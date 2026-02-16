'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hatayı Sentry veya Audit loglarına burada gönderebiliriz
    console.error('Sistem Hatası:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Bir şeyler ters gitti</h2>
      <p className="text-slate-500 max-w-sm mb-8 text-sm">
        İşlemi gerçekleştirirken beklenmedik bir sorun oluştu. Lütfen sayfayı yenilemeyi deneyin.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
      >
        <RefreshCcw size={18} /> Tekrar Dene
      </button>
    </div>
  )
}
