import React from 'react'
import Link from 'next/link'
import { ZapOff, ArrowLeft, Home, MessageSquare } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Görsel Alanı */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 blur-[100px] rounded-full opacity-50" />
          <div className="relative bg-white border-2 border-slate-100 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
            <ZapOff size={48} className="text-blue-600 animate-pulse" />
          </div>
        </div>

        {/* Metin Alanı */}
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-slate-900 tracking-tighter italic">404</h1>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">
            Veri Hattı Koptu Kanka!
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Aradığın grafik, sayfa veya veri seti yerinde yok. Ya mühürü sökülmüş ya da hiç var olmamış.
          </p>
        </div>

        {/* Eylem Butonları */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/dashboard" 
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-1"
          >
            <ArrowLeft size={18} /> DASHBOARD'A DÖN
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/" 
              className="bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
            >
              <Home size={16} /> ANA SAYFA
            </Link>
            <Link 
              href="/docs" 
              className="bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
            >
              <MessageSquare size={16} /> DESTEK AL
            </Link>
          </div>
        </div>

        {/* Alt Bilgi */}
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          SnapLogic.io • Error Protocol 404
        </p>
      </div>
    </div>
  )
}
