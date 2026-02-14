import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import AdminClient from './AdminClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  // Güvenlik: Admin değilse ana sayfaya fırlat
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  if (profile?.role !== 'admin') { redirect('/') }

  // Global İstatistikleri Çek
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: chartCount } = await supabase.from('charts').select('*', { count: 'exact', head: true })
  const { data: allUsers } = await supabase.from('user_quotas').select('*, profiles(username, email)')

  return (
    <AdminClient 
      stats={{ userCount, chartCount }} 
      users={allUsers || []} 
    />
  )
}
