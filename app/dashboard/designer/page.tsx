"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Terminal, Save, Database, Sparkles, ArrowLeft, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import DataInput from "./DataInput";

export default function DesignerPage() {
  const [title, setTitle] = useState("YENİ ANALİZ");
  const [script, setScript] = useState("// SnapScript v0\nchart.ignite();");
  const [entries, setEntries] = useState([{ label: "", value: "" }]);
  const [isLocked, setIsLocked] = useState(false); // Kilit State'i eklendi
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    const validEntries = entries.filter(e => e.label && e.value);
    if (!title || validEntries.length === 0) return alert("Başlık ve veri seti eksik kanka!");
    
    setLoading(true);
    try {
      // 1. GRAFİK OLUŞTUR (is_locked eklendi)
      const { data: chart, error: chartError } = await supabase
        .from("charts")
        .insert({ 
          title: title.toUpperCase(), 
          chart_type: "snap_v0", 
          is_public: true,
          is_locked: isLocked 
        })
        .select().single();

      if (chartError) throw chartError;

      // 2. SCRİPTİ MÜHÜRLE
      await supabase.from("chart_scripts").insert({
        chart_id: chart.id,
        script: script
      });

      // 3. VERİLERİ DAĞIT
      const dataToInsert = validEntries.map(entry => ({
        chart_id: chart.id,
        label: entry.label,
        value: parseFloat(entry.value) || 0
      }));

      await supabase.from("data_entries").insert(dataToInsert);

      alert("Analiz SnapCore Veritabanına Mühürlendi! 🚀");
      window.location.href = "/dashboard";

    } catch (err: any) {
      alert("Mühürleme Hatası: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[9px] font-black">
            <ArrowLeft size={14} /> Geri Dön
          </Link>
          
          <div className="flex items-center gap-4">
            {/* KİLİT TOGGLE */}
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isLocked ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-white/10 text-gray-500'}`}
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
              <span className="text-[9px] font-black uppercase tracking-widest">{isLocked ? 'Pİ KİLİDİ AKTİF' : 'HERKESE AÇIK'}</span>
            </button>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-yellow-500 text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_-5px_rgba(234,179,8,0.3)]"
            >
              <Save size={14} /> {loading ? "MÜHÜRLENİYOR..." : "SİSTEME KAYDET"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
              <div className="flex items-center gap-2 text-gray-500 mb-6 uppercase text-[9px] font-black tracking-widest text-yellow-500/50">
                <Database size={12} /> Analiz Kimliği
              </div>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 pb-2 text-2xl font-black italic outline-none focus:border-yellow-500 transition-all uppercase text-yellow-500"
              />
            </div>
            <DataInput onDataSave={(data) => setEntries(data)} />
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-yellow-500 mb-6 uppercase text-[9px] font-black tracking-widest">
              <Terminal size={12} /> SnapScript v0 Konsolu
            </div>
            <textarea 
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-[350px] bg-black/50 p-6 rounded-3xl border border-white/5 text-sm text-yellow-500 outline-none focus:border-yellow-500/30 transition-all resize-none leading-relaxed font-mono"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
