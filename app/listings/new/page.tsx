'use client'
import { useState } from 'react'
// Üç kat yukarı çıkıp lib'e giriyoruz
import { supabase } from '../../../lib/supabase'

export default function NewListing() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const handleSave = async () => {
    const { error } = await supabase.from('listings').insert([
      { 
        title, 
        base_price: parseFloat(price), 
        active: true,
        listing_type: 'b2b' 
      }
    ])
    if (!error) {
      alert("İlan başarıyla eklendi!")
    } else {
      console.error("Hata:", error.message)
      alert("Bir hata oluştu.")
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-900 min-h-screen text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-yellow-500">Yeni İlan Oluştur</h1>
      <input 
        className="w-full border border-gray-700 bg-gray-800 p-3 mb-4 rounded text-white" 
        placeholder="Ürün Başlığı" 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <input 
        className="w-full border border-gray-700 bg-gray-800 p-3 mb-4 rounded text-white" 
        placeholder="Pi Fiyatı" 
        type="number"
        onChange={(e) => setPrice(e.target.value)} 
      />
      <button 
        onClick={handleSave} 
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg font-bold transition"
      >
        Yayınla
      </button>
    </div>
  )
}
