'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function NewListing() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const handleSave = async () => {
    const { error } = await supabase.from('listings').insert([
      { title, base_price: parseFloat(price), active: true }
    ])
    if (!error) alert("İlan başarıyla eklendi!")
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni İlan Oluştur</h1>
      <input 
        className="w-full border p-2 mb-4 rounded" 
        placeholder="Ürün Başlığı" 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <input 
        className="w-full border p-2 mb-4 rounded" 
        placeholder="Pi Fiyatı" 
        type="number"
        onChange={(e) => setPrice(e.target.value)} 
      />
      <button onClick={handleSave} className="w-full bg-yellow-500 text-white p-3 rounded-lg font-bold">
        Yayınla
      </button>
    </div>
  )
}
