"use client";

import { useState } from "react";
import { Plus, Trash2, Database } from "lucide-react";

export default function DataInput({ onDataSave }: { onDataSave: (data: any[]) => void }) {
  const [entries, setEntries] = useState([{ label: "", value: "" }]);

  const addRow = () => setEntries([...entries, { label: "", value: "" }]);
  
  const removeRow = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const updateRow = (index: number, field: string, val: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: val };
    setEntries(newEntries);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-gray-500 uppercase text-[9px] font-black tracking-widest">
          <Database size={12} /> Veri Seti Girişi
        </div>
        <button 
          onClick={addRow}
          className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-black transition-all"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-3 items-center group">
            <input 
              placeholder="Etiket (Oca, Şub...)"
              value={entry.label}
              onChange={(e) => updateRow(i, "label", e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-yellow-500/50 transition-all"
            />
            <input 
              placeholder="Değer"
              type="number"
              value={entry.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              className="w-24 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-yellow-500/50 transition-all text-yellow-500 font-bold"
            />
            <button 
              onClick={() => removeRow(i)}
              className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onDataSave(entries)}
        className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
      >
        Veri Setini Mühürle
      </button>
    </div>
  );
}

