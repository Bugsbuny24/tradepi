'use client'
import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Table as TableIcon, Upload, Plus, Trash2, 
  Save, Zap, Download, FileSpreadsheet 
} from 'lucide-react'
import Papa from 'papaparse' // CSV parse için

export default function DataManagerPage({ searchParams }: { searchParams: { new?: string } }) {
  const supabase = createClient()
  const chartId = searchParams.new
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([{ label: 'Ocak', value: '100' }, { label: 'Şubat', value: '200' }])

  // 1. Satır Ekleme
  const addRow = () => setRows([...rows, { label: '', value: '' }])

  // 2. Satır Silme
  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index)
    setRows(newRows)
  }

  // 3. Veri Değişimi
  const updateRow = (index: number, field: 'label' | 'value', val: string) => {
    const newRows = [...rows]
    newRows[index][field] = val
    setRows(newRows)
  }

  // 4. CSV Import Sihirbazı
  const handleCSV = (e: any) => {
    const file = e.target.files[0]
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedRows = results.data.map((d: any) => ({
          label: Object.values(d)[0] as string,
          value: Object.values(d)[1] as string
        }))
        setRows(importedRows)
      }
    })
  }

  // 5. Veritabanına Mühürleme (Save)
  const handleSave = async () => {
    if (!chartId) return alert('Kanka önce bir grafik oluşturmalısın!')
    setLoading(true)
    
    // Önce eski verileri temizle, sonra yenileri bas
    await supabase.from('data_entries').delete().eq('chart_id', chartId)
    
    const { error } = await supabase.from('data_entries').insert(
      rows.map(r => ({ ...r, chart_id: chartId }))
    )

    if (error) alert('Hata: ' + error.message)
    else alert('Veriler başarıyla mühürlendi! 🚀')
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      
      {/* Üst Bar: Aksiyonlar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl"><TableIcon size={24} /></div>
          <div>
            <h2 className="text-2xl font-black italic">Veri Editörü</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manuel Giriş veya CSV Import</p>
          </div>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 transition-all border border-white/10">
            <Upload size={16} /> CSV YÜKLE
            <input type="file" className="hidden" accept=".csv" onChange={handleCSV} />
          </label>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-lg"
          >
            {loading ? 'MÜHÜRLENİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'} <Save size={16} />
          </button>
        </div>
      </div>

      {/* Veri Giriş Tablosu */}
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-left tracking-[0.2em]">Etiket (X Ekseni)</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-left tracking-[0.2em]">Değer (Y Ekseni)</th>
              <th className="px-8 py-5 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, index) => (
              <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    placeholder="Örn: Ocak" 
                    className="w-full bg-transparent p-3 font-bold text-slate-800 outline-none focus:bg-white rounded-xl border border-transparent focus:border-blue-200 transition-all"
                    value={row.label}
                    onChange={(e) => updateRow(index, 'label', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full bg-transparent p-3 font-black text-blue-600 outline-none focus:bg-white rounded-xl border border-transparent focus:border-blue-200 transition-all"
                    value={row.value}
                    onChange={(e) => updateRow(index, 'value', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => removeRow(index)} className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Satır Ekleme Butonu */}
        <div className="p-6 bg-slate-50/30 flex justify-center">
          <button 
            onClick={addRow}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-all"
          >
            <Plus size={14} /> Yeni Satır Ekle
          </button>
        </div>
      </div>

      {/* Yardımcı Bilgi */}
      <div className="flex items-start gap-4 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
        <Zap className="text-blue-600 shrink-0" size={24} fill="currentColor" />
        <p className="text-sm font-medium text-blue-900 leading-relaxed">
          Kanka, buraya girdiğin veriler anlık olarak kaydedilmez. Değişiklikleri yaptıktan sonra yukarıdaki <b>"Kaydet"</b> butonuna basmayı unutma. CSV yüklerken ilk sütunun "İsim", ikinci sütunun "Rakam" olduğundan emin ol!
        </p>
      </div>

    </div>
  )
}
