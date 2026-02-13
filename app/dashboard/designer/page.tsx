"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Terminal, Save, Lock, Unlock, Eye, BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import Link from "next/link";
import DataInput from "./DataInput";

const CHART_TYPES = [
  { id: "bar", name: "Bar Chart", icon: BarChart3 },
  { id: "line", name: "Line Chart", icon: LineChart },
  { id: "pie", name: "Pie Chart", icon: PieChart },
  { id: "donut", name: "Donut Chart", icon: TrendingUp },
];

export default function DesignerPage() {
  const [title, setTitle] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [entries, setEntries] = useState([{ label: "", value: "" }]);
  const [isPublic, setIsPublic] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const supabase = createClient();

  const handleSave = async () => {
    const validEntries = entries.filter(e => e.label && e.value);
    
    if (!title.trim()) {
      alert("⚠️ Grafik başlığı gerekli!");
      return;
    }
    
    if (validEntries.length === 0) {
      alert("⚠️ En az 1 veri girişi yapmalısın!");
      return;
    }

    if (isLocked && price <= 0) {
      alert("⚠️ Kilitli grafik için fiyat belirle!");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Chart oluştur
      const { data: chart, error: chartError } = await supabase
        .from("charts")
        .insert({ 
          title: title.trim(),
          chart_type: chartType,
          is_public: isPublic,
          is_locked: isLocked,
          price: isLocked ? price : null
        })
        .select()
        .single();

      if (chartError) throw chartError;

      // 2. Data entries ekle (sort_order ile)
      const dataToInsert = validEntries.map((e, index) => ({
        chart_id: chart.id,
        label: e.label,
        value: parseFloat(e.value) || 0,
        sort_order: index
      }));

      const { error: dataError } = await supabase
        .from("data_entries")
        .insert(dataToInsert);

      if (dataError) throw dataError;

      alert("🎉 Grafik başarıyla oluşturuldu!");
      window.location.href = `/dashboard/chart/${chart.id}`;
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`❌ Hata: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Preview data hesapla
  const previewData = entries
    .filter(e => e.label && e.value)
    .map(e => ({
      label: e.label,
      value: parseFloat(e.value) || 0
    }));

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-6 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A0A0A] p-4 md:p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-xs font-black uppercase text-gray-500 hover:text-yellow-500 transition-all"
            >
              ← Dashboard
            </Link>
            <div className="h-4 w-px bg-white/10"></div>
            <h1 className="text-sm font-black uppercase text-yellow-500">Chart Designer</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Public/Private Toggle */}
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                isPublic 
                  ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                  : 'bg-white/5 text-gray-500 border border-white/10'
              }`}
            >
              {isPublic ? 'Public' : 'Private'}
            </button>

            {/* Lock Toggle */}
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`p-3 rounded-xl transition-all ${
                isLocked 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-white/5 text-gray-500'
              }`}
              title={isLocked ? 'Locked (Paid)' : 'Unlocked (Free)'}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>

            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-3 bg-white/5 text-gray-500 rounded-xl hover:text-yellow-500 transition-all"
              title="Toggle Preview"
            >
              <Eye size={16} />
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase shadow-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Chart"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
              <label className="text-xs text-gray-500 uppercase font-black mb-2 block">
                Chart Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter chart title..."
                className="w-full bg-transparent border-b-2 border-white/10 pb-3 text-xl font-black italic outline-none focus:border-yellow-500 text-white uppercase transition-all"
              />
            </div>

            {/* Chart Type Selector */}
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
              <label className="text-xs text-gray-500 uppercase font-black mb-4 block">
                Chart Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CHART_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setChartType(type.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        chartType === type.id
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                          : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                      }`}
                    >
                      <Icon size={20} className="mx-auto mb-2" />
                      <div className="text-xs font-black uppercase">{type.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price (if locked) */}
            {isLocked && (
              <div className="bg-[#0A0A0A] border border-yellow-500/30 p-6 rounded-3xl">
                <label className="text-xs text-yellow-500 uppercase font-black mb-2 block">
                  Price (TRY)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-transparent border-b-2 border-yellow-500/30 pb-3 text-2xl font-black outline-none focus:border-yellow-500 text-yellow-500"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Users will pay this amount to view the chart
                </p>
              </div>
            )}

            {/* Data Input */}
            <DataInput onDataSave={(data) => setEntries(data)} />
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {showPreview && (
              <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-gray-500 uppercase font-black">
                    Live Preview
                  </div>
                  <div className="text-xs text-yellow-500 font-bold">
                    {previewData.length} data points
                  </div>
                </div>
                
                {previewData.length > 0 ? (
                  <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                    <SimpleChart 
                      data={previewData} 
                      type={chartType}
                      title={title || "Untitled Chart"}
                    />
                  </div>
                ) : (
                  <div className="bg-black/50 p-12 rounded-2xl border border-white/5 text-center">
                    <BarChart3 size={48} className="mx-auto mb-4 text-gray-700" />
                    <p className="text-gray-600 text-sm">
                      Add data to see preview
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Chart Info */}
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
              <div className="text-xs text-gray-500 uppercase font-black mb-4">
                Chart Settings
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-white font-bold uppercase">{chartType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Visibility:</span>
                  <span className={`font-bold ${isPublic ? 'text-green-500' : 'text-gray-400'}`}>
                    {isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Access:</span>
                  <span className={`font-bold ${isLocked ? 'text-yellow-500' : 'text-green-500'}`}>
                    {isLocked ? `Paid (${price} TRY)` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data Points:</span>
                  <span className="text-white font-bold">{previewData.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Chart Preview Component
function SimpleChart({ data, type, title }: { data: any[], type: string, title: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  if (type === 'bar') {
    return (
      <div className="space-y-3">
        <div className="text-center text-sm font-black text-yellow-500 mb-4 uppercase">
          {title}
        </div>
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-yellow-500 font-bold">{item.value}</span>
            </div>
            <div className="h-6 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'pie' || type === 'donut') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
      <div className="space-y-4">
        <div className="text-center text-sm font-black text-yellow-500 uppercase">
          {title}
        </div>
        <div className="space-y-2">
          {data.map((item, i) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden w-24">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-yellow-500 font-bold w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Line chart (simple)
  return (
    <div className="space-y-4">
      <div className="text-center text-sm font-black text-yellow-500 uppercase">
        {title}
      </div>
      <div className="h-48 flex items-end justify-around gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-yellow-500 rounded-t-lg transition-all"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-400 text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
