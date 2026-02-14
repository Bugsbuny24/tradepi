import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import EliteDashboardClient from './EliteDashboardClient'; // Altta vereceğim istemci bileşeni

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Kota Bilgileri
  const { data: quota } = await supabase.from('user_quotas').select('*').eq('user_id', user?.id).single();

  // 2. Grafik İstatistikleri (Son 7 Gün)
  const { data: stats } = await supabase.from('project_analytics')
    .select('viewed_at')
    .eq('viewer_id', user?.id);

  // 3. Market Ürünleri
  const { data: marketCharts } = await supabase.from('charts')
    .select('*, profiles(id)')
    .eq('is_public', true)
    .limit(6);

  return (
    <EliteDashboardClient 
      quota={quota || {}} 
      chartStats={stats || []} 
      marketCharts={marketCharts || []} 
    />
  );
}
