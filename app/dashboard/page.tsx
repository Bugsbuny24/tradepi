import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import EliteDashboardClient from './EliteDashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Kullanıcı ve veri çekme
  const { data: { user } } = await supabase.auth.getUser()
  
  // Kota bilgilerini çek
  const { data: quota } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  // Market ürünlerini çek
  const { data: marketCharts } = await supabase
    .from('charts')
    .select('*')
    .eq('is_public', true)
    .limit(6)

  return (
    <EliteDashboardClient 
      quota={quota || {}} 
      marketCharts={marketCharts || []} 
    />
  )
}
