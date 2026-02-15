'use client'

import React, { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ChartEngine({ chart, entries, script }: any) {
  
  // Veriyi Script'ten Geçir (Eğer script varsa)
  const processedData = useMemo(() => {
    if (!script || !script.script) return entries;

    try {
      // Güvenli bir Sandbox oluştur: Script "data" değişkenini bekler ve "return data" yapmalıdır.
      const runScript = new Function('data', `${script.script}; return data;`);
      return runScript([...entries]); // Orijinal veriyi bozmamak için kopya gönderiyoruz
    } catch (err) {
      console.error("Snap Script Hatası:", err);
      return entries; // Hata durumunda ham veriyi göster
    }
  }, [entries, script]);

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {chart.chart_type === 'bar' ? (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : chart.chart_type === 'line' ? (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
          </LineChart>
        ) : (
          <PieChart>
            <Pie data={processedData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={120} label>
              {processedData.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
