'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function RFQList() {
  const [rfqs, setRfqs] = useState<any[]>([])

  useEffect(() => {
    const fetchRFQs = async () => {
      // Şemadaki rfq_requests tablosundan verileri çekiyoruz
      const { data } = await supabase
        .from('rfq_requests')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setRfqs(data)
    }
    fetchRFQs()
  }, [])

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Açık Teklif İstekleri</h2>
      <div className="space-y-4">
        {rfqs.map((rfq) => (
          <div key={rfq.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">Miktar: {rfq.quantity} Adet</p>
                <p className="text-sm text-gray-500">Hedef: {rfq.target_country}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {rfq.status.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-gray-700 text-sm line-clamp-2">{rfq.requirements}</p>
            <div className="mt-4 flex justify-between items-center border-t pt-3">
              <span className="text-gray-900 font-semibold">
                Bütçe: {rfq.budget_min}-{rfq.budget_max} PI
              </span>
              <button className="text-yellow-600 font-bold text-sm">Teklif Ver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
