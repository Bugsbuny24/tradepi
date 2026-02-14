import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tradepigloball.co'
  
  // Supabase'den herkese açık grafikleri çekelim ki Google her birini indexlesin
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data: charts } = await supabase
    .from('charts')
    .select('id, updated_at')
    .eq('is_public', true)

  const chartUrls = (charts || []).map((chart) => ({
    url: `${baseUrl}/view/${chart.id}`,
    lastModified: chart.updated_at,
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/market`, lastModified: new Date() },
    { url: `${baseUrl}/dashboard`, lastModified: new Date() },
    ...chartUrls,
  ]
}
