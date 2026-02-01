// supabase/functions/order-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const { record } = await req.json() // Trigger'dan gelen yeni sipariş satırı

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Krediyi Emanete Al (Locking)
  const { error: lockError } = await supabase
    .from('credit_locks')
    .insert({
      order_id: record.id,
      buyer_id: record.buyer_id,
      seller_id: record.seller_id,
      amount: record.amount_credits,
      status: 'locked',
      tenant_id: record.tenant_id
    })

  if (lockError) return new Response("Lock Error", { status: 400 })

  // 2. Satıcıya Haber Ver
  await supabase
    .from('notifications')
    .insert({
      user_id: record.seller_id,
      title: 'Yeni Sipariş!',
      body: `Hayırlı olsun kanka, ${record.amount_credits} kredilik bir iş aldın.`,
      type: 'order_received'
    })

  return new Response("Order Processed", { status: 200 })
})

