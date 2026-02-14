import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import MarketClient from './MarketClient'

export const dynamic = 'force-dynamic'

export default async function MarketPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

  // Sadece yayında olan grafikleri çek
  const { data: charts } = await supabase
    .from('charts')
    .select('*, profiles(username)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return <MarketClient initialCharts={charts || []} />
}
