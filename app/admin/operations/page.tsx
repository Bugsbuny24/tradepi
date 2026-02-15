'use client'
import { useState } from 'react'
import { 
  CheckCircle2, XCircle, AlertCircle, 
  ShoppingBag, ClipboardList, Zap, CreditCard, ArrowRight
} from 'lucide-react'

export default function AdminOperations() {
  const [activeTab, setActiveTab] = useState('marketplace')

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 space-y-10">
      
      {/* Operasyon Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-4 rounded-[1.5rem] text-white shadow-xl shadow-blue-200">
            <Zap size={24} fill="white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Sistem Operasyonları</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Operational Command Center</p>
          </div>
        </div>

        {/* Sekme Seçici */}
        <div className="bg-white p-1.5 rounded-[1.5rem] border border-slate-200 flex gap-2 shadow-sm">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
            { id: 'payments', label: 'Ödemeler', icon: CreditCard },
            { id: 'tasks', label: 'Görevler', icon: ClipboardList },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} /> {tab.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Operasyon Listeleri */}
      <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden min-h-[600px]">
        
        {/* Marketplace İlan Onayları */}
        {activeTab === 'marketplace' && (
          <div className="animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-900 italic">Onay Bekleyen Marketplace İlanları</h3>
              <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black">4 BEKLEYEN</span>
            </div>
            <div className="divide-y divide-slate-50">
              {[1, 2].map((i) => (
                <div key={i} className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black">
                      V{i}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 italic">Global Satış Veri Seti v{i}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase">Yayınlayan: kanka_dev_{i} • Fiyat: {i*500} Kredi</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-emerald-50 text-emerald-600 p-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                      <CheckCircle2 size={20} />
                    </button>
                    <button className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopier Ödeme Takibi */}
        {activeTab === 'payments' && (
          <div className="animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
              <h3 className="font-black text-slate-900 italic">Shopier Kredi Yükleme Talepleri</h3>
              <AlertCircle className="text-blue-600" size={20} />
            </div>
            <div className="p-20 text-center space-y-4">
               <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-300">
                 <CreditCard size={32} />
               </div>
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Tüm ödemeler otomatik mühürlendi kanka.</p>
            </div>
          </div>
        )}

        {/* Human Task Dispute (Uyuşmazlık) Çözümü */}
        {activeTab === 'tasks' && (
          <div className="animate-in fade-in duration-500">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-900 italic">İtiraz Edilen Görevler (Disputes)</h3>
            </div>
            <div className="p-8">
               <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center justify-between">
                 <div className="space-y-1">
                   <h4 className="font-black text-red-900">Görev #4829 - "CSV Temizleme"</h4>
                   <p className="text-xs font-medium text-red-700">İşveren sonucu beğenmedi, çalışan krediyi istiyor.</p>
                 </div>
                 <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-slate-900 transition-all">
                    HAKEM OL
                 </button>
               </div>
            </div>
          </div>
        )}

      </div>

      {/* Admin Quick Action (Kredi Yükleme) */}
      <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-2">
           <h4 className="text-2xl font-black italic tracking-tighter">Manuel Kredi Enjeksiyonu</h4>
           <p className="text-slate-400 text-sm font-medium">Bir kullanıcıya manuel kredi yüklemek için e-postasını mühürle.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input type="text" placeholder="kullanici@mail.com" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:bg-white/20 font-bold w-full md:w-64" />
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-white hover:text-slate-900 transition-all">
            YÜKLE
          </button>
        </div>
      </div>

    </div>
  )
}
