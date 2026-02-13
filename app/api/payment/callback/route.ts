// app/api/payment/callback/route.ts
const packageId = result.conversationId.split('_')[1];
const { data: pkg } = await supabase.from('packages').select('grants').eq('code', packageId).single();

if (pkg) {
  const { data: q } = await supabase.from('user_quotas').select('*').eq('user_id', userId).single();
  
  await supabase.from('user_quotas').update({
    credits_remaining: (q.credits_remaining || 0) + pkg.grants.credits,
    embed_view_remaining: (q.embed_view_remaining || 0) + pkg.grants.views,
    updated_at: new Date()
  }).eq('user_id', userId);
}
