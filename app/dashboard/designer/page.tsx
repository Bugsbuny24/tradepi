"use client";

import { useState } from "react";
import { Plus, Save, BarChart3, Database, Code2, Play } from "lucide-react";

export default function DesignerPage() {
  const [activeTab, setActiveTab] = useState("data"); // data, script, preview
  const [dataInput, setDataInput] = useState("");

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ÜST PANEL */}
      <div className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-yellow-500 bg-yellow-500/10 p-2 rounded-lg">
              <BarChart3 size={20} />
            </div>
            <h1 className="text-sm font-black uppercase italic tracking-widest">Yeni Proje: <span className="text-gray-500">İsimsiz Analiz</span></h1>
          </div>
          <button className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
            <Save size={14} /> PROJEYİ MÜHÜRLE
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-73px)]">
        
        {/* SOL PANEL: ARAÇLAR */}
        <div className="lg:col-span-1 border-r border-white/5 p-4 flex lg:flex-col gap-4">
          <button onClick={() => setActiveTab("data")} className={`p-4 rounded-2xl transition-all ${activeTab === "data" ? "bg-yellow-500 text-black" : "bg-white/5 text-gray-500 hover:text-white"}`}>
            <Database size={20} />
          </button>
          <button onClick={() => setActiveTab("script")} className={`p-4 rounded-2xl transition-all ${activeTab === "script" ? "bg-yellow-500 text-black" : "bg-white/5 text-gray-500 hover:text-white"}`}>
            <Code2 size={20} />
          </button>
        </div>

        {/* ORTA PANEL: EDİTÖR */}
        <div className="lg:col-span-6 p-8 border-r border-white/5">
          {activeTab === "data" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-yellow-500">Veri Enjeksiyonu</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Verilerini CSV formatında yapıştır veya manuel gir.</p>
              <textarea 
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder="Örn: Tarih, Satış\n2026-01-01, 1500"
                className="w-full h-[400px] bg-[#0A0A0A] border border-white/10 rounded-[32px] p-6 text-sm font-mono focus:border-yellow-500/50 outline-none transition-all"
              />
            </div>
          )}

          {activeTab === "script" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-blue-500">SnapScript v0</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Reaktif bağıntıları kodla.</p>
              <div className="w-full h-[400px] bg-[#0A0A0A] border border-white/10 rounded-[32px] p-6 text-sm font-mono text-green-500">
                {`// SnapScript Logic\nchart.color = data.value > 1000 ? "#EAB308" : "#EF4444";\nchart.render();`}
              </div>
            </div>
          )}
        </div>

        {/* SAĞ PANEL: CANLI ÖNİZLEME */}
        <div className="lg:col-span-5 p-8 bg-black/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600">Canlı Görünüm</h2>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Runtime Active</span>
            </div>
          </div>
          
          <div className="aspect-square w-full rounded-[48px] border-2 border-dashed border-white/5 flex items-center justify-center bg-[#080808] relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-center space-y-4 relative z-10">
              <Play className="mx-auto text-yellow-500/20 group-hover:text-yellow-500 transition-colors" size={48} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 group-hover:text-gray-400">Veri bekleniyor...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
