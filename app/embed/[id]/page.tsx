// app/embed/[id]/page.tsx
import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
// Buraya daha önce yazdığımız Recharts bileşenini (Bar, Line vb.) import edeceğiz

export default async function PublicEmbed({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Grafiği ve verilerini çek
  const { data: chart } = await supabase
    .from('charts')
    .select('*, data_entries(*)')
    .eq('id', params.id)
    .single()

  if (!chart) return notFound()

  return (
    <div className="w-full h-screen bg-transparent p-4">
      {/* Burada Recharts bileşeni chart.data_entries ile render edilecek */}
      <h2 className="text-center font-bold">{chart.title}</h2>
      <div className="w-full h-[90%] flex items-center justify-center text-slate-400">
        Grafik Motoru Yükleniyor... (Recharts Bileşeni Buraya)
      </div>
    </div>
  )
}
