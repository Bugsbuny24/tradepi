'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function SnapLogicMaster() {
  const [quotas, setQuotas] = useState<any>(null)
  const [charts, setCharts] = useState([])

  useEffect(() => {
    const init = async () => {
      // 1. Kullanıcı kotalarını çek
      const { data: q } = await supabase.from('user_quotas').select('*').single()
      setQuotas(q)
      // 2. Grafikleri çek
      const { data: c } = await supabase.from('charts').select('*, data_entries(*)')
      setCharts(c || [])
    }
    init()
  }, [])

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '30px', fontFamily: 'sans-serif' }}>
      {/* ÜST BAR: KOTALAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
        <h1 style={{ color: '#fbbf24', margin: 0 }}>SnapLogic.io</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: '#666', margin: 0 }}>KALAN İZLENME</p>
            <p style={{ fontWeight: 'bold', color: '#fbbf24' }}>{quotas?.embed_view_remaining || 0}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: '#666', margin: 0 }}>API KOTASI</p>
            <p style={{ fontWeight: 'bold', color: '#fbbf24' }}>{quotas?.api_call_remaining || 0}</p>
          </div>
        </div>
      </header>

      {/* ANA PANEL */}
      <main style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2>Grafiklerin</h2>
          <button style={{ background: '#fbbf24', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>+ YENİ WIDGET OLUŞTUR</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {charts.map((chart: any) => (
            <div key={chart.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '15px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>{chart.title}</h3>
              <div style={{ width: '100%', height: '150px' }}>
                <ResponsiveContainer>
                  <LineChart data={chart.data_entries}>
                    <Line type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button style={{ flex: 1, background: '#111', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '5px' }}>DÜZENLE</button>
                <button style={{ flex: 1, background: '#fbbf24', color: '#000', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>KODU AL (EMBED)</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
