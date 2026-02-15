'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Trash2, Save, BarChart2, LineChart, PieChart, ArrowLeft, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function CreateChart() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Grafik Devlet (State)
  const [title, setTitle] = useState('Yeni Grafiğim')
  const [type, setType] = useState('bar')
  const [data, setData] = useState([
    { label: 'Ocak', value: 400 },
    { label: 'Şubat', value: 300 },
  ])

  useEffect(() => { setMounted(true) }, [])

  // Veri Satırı Ekle
  const addRow = () => setData([...data, { label: '', value: 0 }])

  // Veri Sil
  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index)
    setData(newData)
  }

  // Veri Güncelle
  const updateData = (index: number, field: 'label' | 'value', val: string) => {
    const newData = [...data]
    if (field === 'value') {
      newData[index][field] = Number(val)
    } else {
      newData[index][field] = val
    }
    setData(newData)
  }

  // Kaydetme Fonksiyonu (Asıl Mevzu)
  const saveChart = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return alert('Oturum açman lazım kanka!')

    // 1. Önce Grafiği Oluştur
    const { data: chart, error: chartErr } = await supabase
      .from('charts')
      .insert({
        user_id: user.id,
        title: title,
        chart_type: type,
        is_public: true
      })
      .select()
      .single()

    if (chartErr) {
      alert('Grafik oluşturulamadı: ' + chartErr.message)
      setLoading(false)
      return
    }

    // 2. Veri Girişlerini (Entries) Kaydet
    const entries = data.map((item, index) => ({
      chart_id: chart.id,
      label: item.label,
      value: item.value,
      sort_order: index
    }))

    const { error: entryErr } = await supabase.from('data_entries').insert(entries)

    if (entryErr) {
      alert('Veriler kaydedilemedi: ' + entryErr.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Üst Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-all">
              <ArrowLeft size={20} />
            </Link>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-black bg-transparent border-none focus:ring-0 text-slate-900 w-64"
            />
          </div>
          <button 
            onClick={saveChart}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Yayınla ve Kaydet
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: Veri Girişi */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-600" />
              Grafik Tipi
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'bar', icon: BarChart2 },
                { id: 'line', icon: LineChart },
                { id: 'pie', icon: PieChart },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setType(item.id)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${type === item.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <item.icon size={24} />
                  <span className="text-xs font-bold uppercase">{item.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Veri Seti</h3>
              <button onClick={addRow} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all">
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {data.map((row, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input 
                    placeholder="Etiket"
                    value={row.label}
                    onChange={(e) => updateData(index, 'label', e.target.value)}
                    className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="number"
                    placeholder="Değer"
                    value={row.value}
                    onChange={(e) => updateData(index, 'value', e.target.value)}
                    className="w-24 bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={() => removeRow(index)} className="text-slate-300 hover:text-red-500 p-2 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ: Canlı Önizleme */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black text-slate-800">{title}</h2>
              <p className="text-slate-400 text-sm">Canlı Önizleme</p>
            </div>
            
            <div className="flex-1 w-full min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {type === 'bar' ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : type === 'line' ? (
                  <ReLineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} />
                  </ReLineChart>
                ) : (
                  <RePieChart>
                    <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  </RePieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
