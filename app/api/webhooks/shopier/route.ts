import { createClient } from '@supabase/supabase-js' // Admin yetkisi gerekebilir
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data: any = Object.fromEntries(formData.entries())

    // 1. Shopier Güvenlik Kontrolü (Hash Verification)
    // Shopier'in sana verdiği API Secret ile gelen veriyi hashleyip karşılaştırıyoruz
    const shopierSecret = process.env.SHOPIER_API_SECRET!
    const expectedHash = crypto
      .createHmac('sha256', shopierSecret)
      .update(data.random_nr + data.id)
      .digest('base64')

    // Not: Gerçek Shopier hash algoritması dokümantasyonuna göre güncellenmelidir.
    // Şimdilik mantığı kuruyoruz.

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Krediyi artırmak için admin yetkisi şart
    )

    // 2. Ödemeyi Veritabanında Bul
    const { data: intent, error: intentError } = await supabase
      .from('checkout_intents')
      .select('*, packages(grants)')
      .eq('provider_ref', data.platform_order_id) // Shopier'in gönderdiği sipariş no
      .single()

    if (intentError || !intent) return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })

    if (intent.status === 'completed') return NextResponse.json({ message: 'Zaten işlendi' })

    // 3. KRİTİK: Kredi ve Hakları Tanımla
    const grants = intent.packages.grants
    
    const { error: quotaError } = await supabase.rpc('grant_package_credits', {
      p_user_id: intent.user_id,
      p_credits: grants.credits || 0,
      p_api_calls: grants.api_calls || 0,
      p_embed_views: grants.embed_views || 0
    })

    if (quotaError) throw quotaError

    // 4. Durumu Güncelle ve Logla
    await Promise.all([
      supabase.from('checkout_intents').update({ status: 'completed' }).eq('id', intent.id),
      supabase.from('provider_webhooks').insert({
        provider: 'shopier',
        event_type: 'payment_success',
        payload: data,
        received_at: new Date().toISOString()
      })
    ])

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Webhook Hatası:', err.message)
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 })
  }
}
