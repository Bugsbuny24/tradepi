'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Listings() {
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from('listings').select('*').eq('active', true)
      if (data) setListings(data)
    }
    fetchListings()
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Aktif B2B İlanları</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div key={item.id} className="border p-4 rounded-xl shadow bg-white">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-600 font-bold">{item.base_price} PI</span>
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm">Detay</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
