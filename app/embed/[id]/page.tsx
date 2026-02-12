// Bu sayfa tamamen minimalist olacak, sadece grafik!
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function EmbedChart({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEmbedData() {
      const { data: entries } = await supabase
        .from("data_entries")
        .select("*")
        .eq("chart_id", params.id);
      setData(entries || []);
    }
    fetchEmbedData();
  }, [params.id]);

  return (
    <div className="w-full h-full bg-transparent flex items-end justify-center gap-1 p-4 overflow-hidden">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div 
            className="w-full bg-yellow-500 rounded-sm opacity-80 group-hover:opacity-100 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
            style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
          />
          <span className="text-[6px] text-gray-500 font-black uppercase">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
