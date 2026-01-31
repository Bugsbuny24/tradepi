'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function NewRFQ() {
  const [formData, setFormData] = useState({
    listing_id: '', // Hangi ürün için
    quantity: 0,
    budget_min: 0,
    budget_max: 0,
    requirements: '',
    target_country: '',
    deadline: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Şemadaki rfq_requests tablosuna kayıt atıyoruz
    const { data, error } = await supabase
      .from('rfq_requests')
      .insert([
        { 
          ...formData,
          status: 'pending', // Başlangıç durumu
          created_at: new Date().toISOString()
        }
      ])

    if (error) {
      alert("Hata oluştu: " + error.message)
    } else {
      alert("Teklif isteğiniz satıcılara iletildi!")
    }
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">Yeni Teklif İsteği (RFQ)</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Hedef Miktar (Adet/Birim)</label>
          <input 
            type="number" 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700"
            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Min Bütçe (PI)</label>
            <input 
              type="number" 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              onChange={(e) => setFormData({...formData, budget_min: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Max Bütçe (PI)</label>
            <input 
              type="number" 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700"
              onChange={(e) => setFormData({...formData, budget_max: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Teslimat Ülkesi</label>
          <input 
            type="text" 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700"
            placeholder="Örn: Türkiye, Almanya"
            onChange={(e) => setFormData({...formData, target_country: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Özel Gereksinimler</label>
          <textarea 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700 h-24"
            placeholder="Ürün detayları, paketleme tercihi vb."
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Son Teklif Tarihi</label>
          <input 
            type="date" 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700"
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 rounded-lg transition"
        >
          RFQ Oluştur ve Gönder
        </button>
      </form>
    </div>
  )
}
