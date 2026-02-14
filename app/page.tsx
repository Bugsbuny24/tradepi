import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import EliteDashboardClient from './dashboard/EliteDashboardClient' // Yolu dashboard olarak güncelledik!

export const dynamic = 'force-dynamic'

export default async function IndexPage() {
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

  const { data: { user } } = await supabase.auth.getUser()
  
  // Eğer kullanıcı giriş yapmamışsa veriler boş gitsin, hata vermesin
  const { data: quota } = await supabase.from('user_quotas').select('*').eq('user_id', user?.id).single()
  const { data: marketCharts } = await supabase.from('charts').select('*').eq('is_public', true).limit(4)

  return <EliteDashboardClient quota={quota || {}} marketCharts={marketCharts || []} />
}
