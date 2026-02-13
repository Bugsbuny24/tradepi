"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Database, Upload } from "lucide-react";

export default function DataInput({ onDataSave }: { onDataSave: (data: any[]) => void }) {
  const [entries, setEntries] = useState([
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" }
  ]);

  useEffect(() => {
    onDataSave(entries);
  }, [entries, onDataSave]);

  const addRow = () => {
    setEntries([...entries, { label: "", value: "" }]);
  };

  const removeRow = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: string, val: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: val };
    setEntries(newEntries);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      const newEntries = lines.map(line => {
        const [label, value] = line.split(',').map(s => s.trim());
        return { label: label || '', value: value || '' };
      }).filter(e => e.label && e.value);

      if (newEntries.length > 0) {
        setEntries(newEntries);
        alert(`✅ ${newEntries.length} rows imported!`);
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (confirm('Clear all data?')) {
      setEntries([{ label: "", value: "" }]);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-yellow-500" />
          <span className="text-xs text-gray-500 uppercase font-black">
            Data Entries
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* CSV Upload */}
          <label className="p-2 bg-white/5 text-gray-500 rounded-xl hover:text-yellow-500 cursor-pointer transition-all">
            <Upload size={16} />
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>

          {/* Add Row */}
          <button
            onClick={addRow}
            className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-black transition-all"
            title="Add Row"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex gap-2 items-center group"
          >
            <div className="w-8 text-center text-xs text-gray-700 font-bold">
              {i + 1}
            </div>
            
            <input
              placeholder="Label (e.g., January)"
              value={entry.label}
              onChange={(e) => updateRow(i, "label", e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-yellow-500/50 transition-all"
            />
            
            <input
              placeholder="Value"
              type="number"
              step="0.01"
              value={entry.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              className="w-28 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-yellow-500/50 text-yellow-500 font-bold transition-all"
            />
            
            <button
              onClick={() => removeRow(i)}
              disabled={entries.length === 1}
              className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
              title="Delete Row"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
        <div className="text-gray-600">
          {entries.filter(e => e.label && e.value).length} valid entries
        </div>
        
        <button
          onClick={clearAll}
          className="text-gray-600 hover:text-red-500 transition-colors uppercase font-bold"
        >
          Clear All
        </button>
      </div>

      {/* CSV Format Help */}
      <div className="mt-4 p-3 bg-black/30 rounded-xl border border-white/5">
        <div className="text-xs text-gray-600 mb-2 font-bold">CSV Format:</div>
        <code className="text-xs text-gray-500 block">
          Label1, 100<br />
          Label2, 200<br />
          Label3, 300
        </code>
      </div>
    </div>
  );
}
