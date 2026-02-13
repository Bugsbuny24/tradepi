"use client";
import { useState } from "react";
import { Plus, Trash2, Database } from "lucide-react";

export default function DataInput({ onDataSave }: { onDataSave: (data: any[]) => void }) {
  const [entries, setEntries] = useState([{ label: "", value: "" }]);

  const addRow = () => setEntries([...entries, { label: "", value: "" }]);
  const removeRow = (index: number) => setEntries(entries.filter((_, i) => i !== index));
  const updateRow = (index: number, field: string, val: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: val };
    setEntries(newEntries);
    onDataSave(newEntries);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-gray-500 uppercase text-[9px] font-black tracking-widest text-yellow-500/50">
          <Database size={12} /> Veri Seti Girişi
        </div>
        <button onClick={addRow} className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl hover:bg-yellow-500 transition-all"><Plus size={16} /></button>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-3 items-center group animate-in fade-in slide-in-from-left-2">
            <input placeholder="Etiket" value={entry.label} onChange={(e) => updateRow(i, "label", e.target.value)} className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-yellow-500/50" />
            <input placeholder="Değer" type="number" value={entry.value} onChange={(e) => updateRow(i, "value", e.target.value)} className="w-24 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-yellow-500/50 text-yellow-500 font-bold" />
            <button onClick={() => removeRow(i)} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
