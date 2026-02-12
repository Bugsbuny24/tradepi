// Bu kısım Pi Network'ten onay gelince çalışır
// Şemandaki pi_purchases tablosuna kaydeder ve user_quotas'u artırır
const { data: updatedQuota } = await supabase
  .rpc('increment_user_quota', { // SQL Function kullanarak güvenli artış
    user_id_input: userId,
    api_inc: 5000,   // Pakete göre gelen artı kredi
    embed_inc: 10000 // Pakete göre gelen artı izlenim
  });
