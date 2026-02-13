// Callback içinde krediyi grants'e göre yükle
const { data: pkg } = await supabase
  .from('packages')
  .select('grants')
  .eq('code', packageId)
  .single();

// Kredi ve Özellikleri Tanımla
const newCredits = (userQuota?.credits_remaining || 0) + (pkg.grants.credits);
const newViews = (userQuota?.embed_view_remaining || 0) + (pkg.grants.views);

await supabase
  .from('user_quotas')
  .update({ 
    credits_remaining: newCredits,
    embed_view_remaining: newViews,
    // SnapScript v0 yetkisini profile veya quota'ya işle
    updated_at: new Date()
  })
  .eq('user_id', userId);
