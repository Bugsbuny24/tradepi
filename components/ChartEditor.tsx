'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ChartEditor({ initialChart }: { initialChart: any }) {
  const [entries, setEntries] = useState(initialChart.data_entries || [])
  const [loading, setLoading] = useState(false)

  // Yeni Veri Satırı Ekle
  const addRow = () => {
    setEntries([...entries, { label: 'Yeni Veri', value: 0, sort_order: entries.length }])
  }

  // Veri Güncelle
  const updateRow = (index: number, field: string, val: any) => {
    const newEntries = [...entries]
    newEntries[index][field] = field === 'value' ? Number(val) : val
    setEntries(newEntries)
  }

  // Veritabanına Kaydet
  const handleSave = async () => {
    setLoading(true)
    // 1. Önce eski verileri temizle (basit mantık)
    await supabase.from('data_entries').delete().eq('chart_id', initialChart.id)
    
    // 2. Yeni verileri ekle
    const toInsert = entries.map((e: any, i: number) => ({
      chart_id: initialChart.id,
      label: e.label,
      value: e.value,
      sort_order: i
    }))

    await supabase.from('data_entries').insert(toInsert)
    setLoading(false)
    alert('Kaydedildi!')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* SOL: Veri Giriş Formu */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Veri Girişi</h2>
          <button onClick={addRow} className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-all">
            <Plus size={16} /> Satır Ekle
          </button>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {entries.map((entry: any, index: number) => (
            <div key={index} className="flex gap-3 items-center animate-in fade-in slide-in-from-left-2">
              <input 
                type="text" 
                value={entry.label} 
                onChange={(e) => updateRow(index, 'label', e.target.value)}
                className="flex-1 p-2 border rounded-lg outline-none focus:border-blue-500 text-sm"
                placeholder="Etiket (Örn: Ocak)"
              />
              <input 
                type="number" 
                value={entry.value} 
                onChange={(e) => updateRow(index, 'value', e.target.value)}
                className="w-24 p-2 border rounded-lg outline-none focus:border-blue-500 text-sm"
              />
              <button 
                onClick={() => setEntries(entries.filter((_: any, i: number) => i !== index))}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Değişiklikleri Kaydet</>}
        </button>
      </div>

      {/* SAĞ: Canlı Grafik Önizleme */}
      <div className="bg-slate-900 p-6 rounded-2xl min-h-[400px] flex flex-col shadow-xl">
        <h2 className="text-white/70 text-sm font-medium mb-8 uppercase tracking-widest text-center">Canlı Önizleme</h2>
        <div className="flex-1 w-full h-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {initialChart.chart_type === 'bar' ? (
              <BarChart data={entries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : initialChart.chart_type === 'line' ? (
              <LineChart data={entries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            ) : (
                <PieChart>
                  <Pie data={entries} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
                    {entries.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
