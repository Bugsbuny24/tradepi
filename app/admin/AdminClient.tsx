"use client";
import { Users, BarChart, Settings, ShieldAlert, Zap, TrendingUp } from 'lucide-react';

export default function AdminClient({ stats, users }: any) {
  return (
    <div className="bg-[#050505] min-h-screen text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={36} /> Admin Center
            </h1>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">Sistem Kontrol Paneli V3.0</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#111] border border-white/5 px-6 py-3 rounded-2xl">
              <p className="text-[10px] text-gray-500 font-bold">TOPLAM KULLANICI</p>
              <p className="text-2xl font-black text-purple-500">{stats.userCount}</p>
            </div>
            <div className="bg-[#111] border border-white/5 px-6 py-3 rounded-2xl">
              <p className="text-[10px] text-gray-500 font-bold">AKTİF ANALİZLER</p>
              <p className="text-2xl font-black text-blue-500">{stats.chartCount}</p>
            </div>
          </div>
        </div>

        {/* KULLANICI YÖNETİM TABLOSU */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-black italic flex items-center gap-2 underline decoration-purple-500 underline-offset-8">KULLANICI VERİTABANI</h3>
            <button className="text-xs bg-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-white hover:text-black transition-all">SİSTEMİ GÜNCELLE</button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-black/50">
                <th className="p-6">Kullanıcı / Email</th>
                <th className="p-6">Kalan Kredi</th>
                <th className="p-6">İzlenme Kotası</th>
                <th className="p-6">Üyelik</th>
                <th className="p-6 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u: any) => (
                <tr key={u.user_id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-sm">@{u.profiles?.username || 'anonim'}</p>
                    <p className="text-[10px] text-gray-600 italic">{u.profiles?.email}</p>
                  </td>
                  <td className="p-6 font-black text-purple-400">{u.credits_remaining}</td>
                  <td className="p-6 text-gray-400 text-sm font-medium">{u.embed_view_remaining.toLocaleString()}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.tier === 'Enterprise' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-gray-500/10 text-gray-500'}`}>
                      {u.tier}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[10px] font-black bg-white/5 border border-white/10 px-4 py-2 rounded-lg group-hover:bg-purple-600 transition-all uppercase">Düzenle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ALT HIZLI AKSİYONLAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <ActionCard icon={<Zap size={20}/>} title="Global Duyuru" desc="Tüm kullanıcılara sistem mesajı gönder." />
            <ActionCard icon={<TrendingUp size={20}/>} title="Satış Raporları" desc="Shopier üzerinden gelen tüm kazançlar." />
            <ActionCard icon={<Settings size={20}/>} title="Sistem Bakımı" desc="API ve Database servislerini yönet." />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc }: any) {
    return (
        <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group">
            <div className="bg-black p-3 w-fit rounded-xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
            <h4 className="font-black italic text-sm mb-1 uppercase tracking-tighter">{title}</h4>
            <p className="text-gray-600 text-[10px] font-bold">{desc}</p>
        </div>
    );
}

