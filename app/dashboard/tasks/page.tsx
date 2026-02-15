import { createClient } from '@/lib/supabase/server'
import { 
  ClipboardList, CheckCircle2, Clock, Plus, 
  Coins, UserCircle2, ArrowRight, Zap 
} from 'lucide-react'
import Link from 'next/link'

export default async function HumanTasksPage() {
  const supabase = createClient()

  // Aktif görevleri çekiyoruz
  const { data: tasks } = await supabase
    .from('human_tasks')
    .select('*, profiles(full_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Task Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            <Zap size={14} className="fill-emerald-600" /> Earn Credits
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Görev Havuzu</h2>
          <p className="text-slate-500 font-medium text-lg">Diğer kullanıcıların görevlerini tamamla, cüzdanını mühürle.</p>
        </div>
        
        <Link href="/dashboard/tasks/new" className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1">
          <Plus size={20} /> YENİ GÖREV YAYINLA
        </Link>
      </div>

      {/* Görev Kartları Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(!tasks || tasks.length === 0) ? (
          // Örnek Görevler (Mockup)
          [
            { title: 'CSV Veri Temizleme', reward: 500, type: 'Data Entry', difficulty: 'Kolay' },
            { title: 'Pazar Analiz Grafiği Oluşturma', reward: 1200, type: 'Visualization', difficulty: 'Orta' },
            { title: 'Yıllık Satış Raporu Özeti', reward: 2500, type: 'Analysis', difficulty: 'Zor' }
          ].map((task, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-[3rem] p-8 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      {task.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      task.difficulty === 'Zor' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {task.difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 italic group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                </div>
                <div className="bg-amber-50 text-amber-600 p-4 rounded-[2rem] flex flex-col items-center justify-center border border-amber-100 min-w-[100px]">
                  <Coins size={20} className="mb-1" />
                  <span className="font-black text-lg">{task.reward}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest">KREDİ</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    <UserCircle2 className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yayınlayan</p>
                    <p className="text-xs font-bold text-slate-700 italic">TradePi_Kullanici_{i+1}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-slate-900 font-black text-xs group-hover:text-blue-600 transition-all uppercase tracking-widest">
                  Görevi Al <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          tasks.map((task) => (
            // Gerçek görev datası buraya
            null
          ))
        )}
      </div>

      {/* Sistem Bilgi Paneli */}
      <div className="bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h4 className="text-3xl font-black italic">Nasıl Çalışır?</h4>
            <p className="font-medium text-blue-100 leading-relaxed">
              Kanka, sistemi çok basit kurduk. Görev açan kullanıcı kredisini sisteme emanet eder. Sen görevi bitirip onay aldığında, mühürlü krediler otomatik olarak hesabına aktarılır. SnapLogic güvencesiyle!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 text-center">
              <Clock size={24} className="mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase">Ort. Onay Süresi</p>
              <p className="text-xl font-black">2.4 Saat</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 text-center">
              <CheckCircle2 size={24} className="mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase">Başarı Oranı</p>
              <p className="text-xl font-black">%98</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
          <ClipboardList size={400} />
        </div>
      </div>
    </div>
  )
}

