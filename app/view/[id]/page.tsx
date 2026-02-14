import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import ChartViewClient from './ChartViewClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ViewPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  // Grafiği ve sahibinin profilini çek
  const { data: chart, error } = await supabase
    .from('charts')
    .select('*, profiles(username, avatar_url)')
    .eq('id', params.id)
    .single()

  if (error || !chart) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-6xl font-black italic opacity-20 mb-4">404</h1>
          <p className="text-gray-500 uppercase font-bold tracking-widest">Analiz Bulunamadı</p>
        </div>
      </div>
    )
  }

  return <ChartViewClient chart={chart} />
}
