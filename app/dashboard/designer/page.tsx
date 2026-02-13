"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Terminal, Save, Database, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import DataInput from "./DataInput";

export default function DesignerPage() {
  const [title, setTitle] = useState("YENİ ANALİZ");
  const [script, setScript] = useState("// SnapScript v0\nchart.ignite();");
  const [entries, setEntries] = useState([{ label: "", value: "" }]);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    const validEntries = entries.filter(e => e.label && e.value);
    if (!title || validEntries.length === 0) return alert("Veri girişi yap kanka!");
    setLoading(true);
    try {
      const { data: chart, error } = await supabase.from("charts").insert({ 
        title: title.toUpperCase(), is_locked: isLocked, price: 1.0, is_public: true 
      }).select().single();
      if (error) throw error;

      await supabase.from("chart_scripts").insert({ chart_id: chart.id, script });
      const dataToInsert = validEntries.map(e => ({ chart_id: chart.id, label: e.label, value: parseFloat(e.value) || 0 }));
      await supabase.from("data_entries").insert(dataToInsert);

      alert("Analiz Veri Borsasına Mühürlendi! 💰");
      window.location.href = "/dashboard";
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-[#0A0A0A] p-6 rounded-[30px] border border-white/5 shadow-2xl">
          <Link href="/dashboard" className="text-[9px] font-black uppercase text-gray-500 hover:text-white transition-all">← Terminal</Link>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsLocked(!isLocked)} className={`p-3 rounded-xl transition-all ${isLocked ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                {isLocked ? <Lock size={16}/> : <Unlock size={16}/>}
             </button>
             <button onClick={handleSave} disabled={loading} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-yellow-500/20">
                {loading ? "MÜHÜRLENİYOR..." : "SİSTEME MÜHÜRLE"}
             </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-2xl font-black italic outline-none focus:border-yellow-500 text-yellow-500 uppercase" />
            </div>
            <DataInput onDataSave={(data) => setEntries(data)} />
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] relative">
            <div className="text-yellow-500 mb-4 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Terminal size={12}/> SnapScript v0</div>
            <textarea value={script} onChange={(e) => setScript(e.target.value)} className="w-full h-[300px] bg-black/50 p-6 rounded-3xl border border-white/5 text-sm text-yellow-500 font-mono outline-none focus:border-yellow-500/30 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
