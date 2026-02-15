'use client'
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Table as TableIcon, Upload, Plus, Trash2, 
  Save, Zap, AreaChart as ChartIcon
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts'
import Papa from 'papaparse'

export default function DataManagerPage({ searchParams }: { searchParams: { new?: string } }) {
  const supabase = createClient()
  const chartId = searchParams.new
  const [loading, setLoading] = useState(false)
  
  // Başlangıç verisi (Boş kalmasın diye kanka)
  const [rows, setRows] = useState([
    { label: 'Ocak', value: '400' },
    { label: 'Şubat', value: '700' },
    { label: 'Mart', value: '500' }
  ])

  const updateRow = (index: number, field: 'label' | 'value', val: string) => {
    const newRows = [...rows]
    newRows[index][field] = val
    setRows(newRows)
  }

  const addRow = () => setRows([...rows, { label: '', value: '' }])
  const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index))

  // Grafik için veriyi sayıya çeviriyoruz
  const chartData = rows.map(r => ({
    name: r.label,
    value: parseFloat(r.value) || 0
  }))

  const handleSave = async () => {
    if (!chartId) return alert('Kanka önce bir grafik oluşturmalısın!')
    setLoading(true)
    await supabase.from('data_entries').delete().eq('chart_id', chartId)
    const { error } = await supabase.from('data_entries').insert(
      rows.map(r => ({ label: r.label, value: r.value, chart_id: chartId }))
    )
    if (error) alert('Hata: ' + error.message)
    else alert('Veriler başarıyla mühürlendi! 🚀')
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10 px-4">
      
      {/* 1. ÜST PANEL: AKSİYONLAR */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl border-b-4 border-blue-600">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20"><Zap size={24} fill="white" /></div>
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter text-white">Live Data Engine</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Gerçek Zamanlı Mühürleme</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
          >
            {loading ? 'İŞLENİYOR...' : 'GRAFİĞİ MÜHÜRLE'} <Save size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* 2. SOL TARAF: VERİ EDİTÖRÜ */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Veri Giriş Tablosu</h3>
            <button onClick={addRow} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-1 hover:underline">
              <Plus size={14} /> Satır Ekle
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Etiket</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Değer</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map((row, index) => (
                    <tr key={index} className="group hover:bg-blue-50/30 transition-all">
                      <td className="px-4 py-2">
                        <input 
                          className="w-full bg-transparent p-3 font-bold text-slate-800 outline-none focus:bg-white rounded-xl border border-transparent focus:border-blue-100"
                          value={row.label}
                          onChange={(e) => updateRow(index, 'label', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number"
                          className="w-full bg-transparent p-3 font-black text-blue-600 outline-none focus:bg-white rounded-xl border border-transparent focus:border-blue-100"
                          value={row.value}
                          onChange={(e) => updateRow(index, 'value', e.target.value)}
                        />
                      </td>
                      <td className="pr-4">
                        <button onClick={() => removeRow(index)} className="text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. SAĞ TARAF: LIVE PREVIEW */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic px-4 flex items-center gap-2">
            <ChartIcon size={14} /> Canlı Grafik Önizlemesi
          </h3>
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 h-[550px] shadow-sm flex flex-col justify-center">
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#prevGrad)" 
                    animationDuration={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 text-center leading-relaxed">
                 BU GRAFİK ŞU AN CANLI VERİLERİNİZİ SİMÜLE EDİYOR. <br />
                 KAYDETTİĞİNİZDE BU GÖRÜNÜMÜN AYNISI SİTENİZDE MÜHÜRLENECEKTİR.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
