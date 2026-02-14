import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import EmbedChartClient from './EmbedChartClient'

export const dynamic = 'force-dynamic'

export default async function EmbedPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: chart } = await supabase
    .from('charts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!chart) return <div className="text-gray-800 text-xs p-4">Analiz bulunamadı.</div>

  return <EmbedChartClient chart={chart} />
}
