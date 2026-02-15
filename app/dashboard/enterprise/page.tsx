// app/dashboard/enterprise/page.tsx
import { 
  Users, Bot, RefreshCw, Layers, 
  ShieldCheck, ArrowRight, Zap 
} from 'lucide-react'

export default function EnterpriseSuite() {
  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 px-6">
      
      {/* Mega Header */}
      <div className="bg-slate-900 p-16 rounded-[4rem] text-white relative overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">
            Enterprise Suite v2.0
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter leading-none">
            GÜCÜ <br /> <span className="text-blue-500">MÜHÜRLE.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl text-lg italic">
            SnapLogic.io artık sadece grafik değil; AI tahminleme, ekip yönetimi ve tam otomasyonla senin veri fabrikan.
          </p>
        </div>
        <Zap size={400} className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-5 text-white" />
      </div>

      {/* Büyük Modüller Gridi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Snap-AI Forecasting */}
        <div className="bg-white border-2 border-slate-100 p-10 rounded-[3.5rem] hover:border-blue-500 transition-all group">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-blue-50 p-4 rounded-3xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Bot size={32} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full italic">AI Model Active</span>
          </div>
          <h3 className="text-2xl font-black italic mb-4">AI Tahminleme (Forecasting)</h3>
          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 italic">
            Geçmiş verilerini analiz ederek önümüzdeki 6 ayı mühürlü bir doğrulukla tahmin et.
          </p>
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-blue-600 transition-all uppercase tracking-widest">
            Analizi Başlat (250 Kredi)
          </button>
        </div>

        {/* 2. Snap-Teams */}
        <div className="bg-white border-2 border-slate-100 p-10 rounded-[3.5rem] hover:border-emerald-500 transition-all group">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-emerald-50 p-4 rounded-3xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Users size={32} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full italic">Collaboration Mode</span>
          </div>
          <h3 className="text-2xl font-black italic mb-4">Takım Yönetimi (Workspaces)</h3>
          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 italic">
            Ekibini davet et, grafikleri ortak düzenle ve kredi havuzunu beraber yönet.
          </p>
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all uppercase tracking-widest">
            Ekibi Davet Et (1000 Kredi)
          </button>
        </div>

        {/* 3. Auto-Automation */}
        <div className="bg-white border-2 border-slate-100 p-10 rounded-[3.5rem] hover:border-purple-500 transition-all group">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-purple-50 p-4 rounded-3xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <RefreshCw size={32} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full italic">24/7 Automation</span>
          </div>
          <h3 className="text-2xl font-black italic mb-4">Veri Otomasyonu (Webhooks)</h3>
          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 italic">
            Google Sheets veya Shopify mağazanı bağla, grafiklerin her gün otomatik mühürlensin.
          </p>
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-purple-600 transition-all uppercase tracking-widest">
            Akış Kur (500 Kredi)
          </button>
        </div>

        {/* 4. White-Label Mode */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="bg-white/10 p-4 rounded-3xl text-white group-hover:bg-blue-600 transition-all">
              <ShieldCheck size={32} />
            </div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Agency Mode</span>
          </div>
          <h3 className="relative z-10 text-2xl font-black italic mb-4 text-white">White-Label Dağıtım</h3>
          <p className="relative z-10 text-slate-400 font-medium text-sm leading-relaxed mb-8 italic">
            SnapLogic imzasını kaldır, kendi logonu koy. Müşterilerine kendi ürünün gibi sun.
          </p>
          <button className="relative z-10 w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest">
            Logoyu Mühürle (2500 Kredi)
          </button>
        </div>

      </div>

    </div>
  )
}
