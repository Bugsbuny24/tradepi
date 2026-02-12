"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase"; // Dün kurduğumuz client
import { Terminal, Save, Database, Sparkles } from "lucide-react";

export default function DesignerPage() {
  const [title, setTitle] = useState("Yeni Analiz");
  const [script, setScript] = useState("// SnapScript v0\ndata.onUpdate(() => {\n  chart.ignite(); \n});");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    // 1. Önce grafiği oluştur
    const { data: chart, error: chartError } = await supabase
      .from("charts")
      .insert({ title, chart_type: "snap_v0", is_public: true })
      .select().single();

    if (chartError) return alert(chartError.message);

    // 2. SnapScript kodunu mühürle
    await supabase.from("chart_scripts").insert({
      chart_id: chart.id,
      script: script
    });

    alert("Veri ve Kod Mühürlendi! 🚀");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-black">
              <Sparkles size={18} />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">Designer <span className="text-yellow-500">v0</span></h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 transition-all"
          >
            <Save size={14} /> {loading ? "MÜHÜRLENİYOR..." : "SİSTEME KAYDET"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SOL: VERİ GİRİŞİ */}
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
              <div className="flex items-center gap-2 text-gray-500 mb-6 uppercase text-[9px] font-black tracking-widest">
                <Database size={12} /> Analiz Başlığı
              </div>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 pb-2 text-2xl font-black italic outline-none focus:border-yellow-500 transition-all uppercase"
              />
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] opacity-50 cursor-not-allowed">
              <div className="text-gray-500 mb-4 uppercase text-[9px] font-black tracking-widest">Veri Seti (Yakında)</div>
              <div className="h-32 border-2 border-dashed border-white/5 rounded-2xl" />
            </div>
          </div>

          {/* SAĞ: SNAP SCRIPT EDITOR */}
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] shadow-2xl">
            <div className="flex items-center gap-2 text-yellow-500 mb-6 uppercase text-[9px] font-black tracking-widest">
              <Terminal size={12} /> SnapScript v0 Konsolu
            </div>
            <textarea 
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-[400px] bg-black/50 p-6 rounded-3xl border border-white/5 text-sm text-yellow-500 outline-none focus:border-yellow-500/30 transition-all resize-none leading-relaxed"
              spellCheck="false"
            />
            <div className="mt-4 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
              Not: Script otomatik olarak veri tabanına mühürlenir.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

