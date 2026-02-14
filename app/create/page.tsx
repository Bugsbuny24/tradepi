import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import CreateChartClient from './CreateChartClient'

export default async function CreatePage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { data: quota } = await supabase.from('user_quotas').select('*').eq('user_id', user?.id).single()

  return <CreateChartClient userId={user?.id} currentQuota={quota} />
}
