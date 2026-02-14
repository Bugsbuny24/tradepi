import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import EliteDashboardClient from './EliteDashboardClient';

// Vercel'de hata vermemesi için dinamik render'ı zorunlu tutalım
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Kullanıcıyı al
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // 1. Kotaları Çek
  const { data: quota } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  // 2. Market Projelerini Çek
  const { data: marketCharts } = await supabase
    .from('charts')
    .select('*, profiles(id)')
    .eq('is_public', true)
    .limit(6);

  // 3. Grafik Verilerini Çek (Analiz için)
  const { data: analytics } = await supabase
    .from('project_analytics')
    .select('viewed_at')
    .eq('chart_id', 'HERHANGI_BIR_ID_VEYA_GENEL');

  return (
    <EliteDashboardClient 
      quota={quota || {}} 
      chartStats={analytics || []} 
      marketCharts={marketCharts || []} 
    />
  );
}
