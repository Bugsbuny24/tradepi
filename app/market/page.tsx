import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import MarketClient from './MarketClient'

export const dynamic = 'force-dynamic'

export default async function MarketPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  // Veritabanından verileri çekmeyi dene
  const { data: charts, error } = await supabase
    .from('charts')
    .select('*, profiles(username)')
    .eq('is_public', true) // Kanka veritabanında bu 'true' olmalı!

  if (error) console.error("Market Hatası:", error);

  return <MarketClient initialCharts={charts || []} />
}
