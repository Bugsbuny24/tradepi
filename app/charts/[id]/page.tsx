import { createClient } from '@/lib/supabase'
import ChartEditor from '@/components/ChartEditor'
import { notFound } from 'next/navigation'

export default async function ChartDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // 1. Grafik bilgilerini ve mevcut verilerini çek
  const { data: chart } = await supabase
    .from('charts')
    .select(`*, data_entries(*)`)
    .eq('id', params.id)
    .single()

  if (!chart) notFound()

  return (
    <div className="p-4 md:p-8">
      <ChartEditor initialChart={chart} />
    </div>
  )
}
