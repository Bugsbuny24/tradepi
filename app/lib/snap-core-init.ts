// app/lib/snap-core-init.ts (Yeni dosya oluştur)
import { supabase } from './supabase';

/**
 * SnapLogic Core Engine v1.0
 * Reaktif veri yayılımı ve SnapScript v0 yetkilendirme motoru.
 */

export const initializeSnapEngine = async (userId: string) => {
  // 1. Kullanıcının paket yetkilerini kontrol et (Role-Based Access)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  const userRole = profile?.role || 'none';

  // 2. SnapScript v0 Runtime Kapasitesini Tanımla
  const engineConfig = {
    version: "1.0.0-v0",
    reactiveMode: userRole !== 'none' ? true : false,
    apiAccess: ["pk_250", "pk_300", "pk_350", "pk_400", "pk_450", "pk_500"].includes(userRole),
    domainLock: userRole === 'unlimited' ? Infinity : parseInt(userRole) || 0
  };

  console.log("🚀 SNAPCORE_ENGINE: INITIALIZED", engineConfig);
  return engineConfig;
};

/**
 * Projeyi Mühürle (Sealing)
 * README'de belirtilen Snap-Architect misyonuna uygun kayıt
 */
export const sealSnapProject = async (chartId: string, scriptContent: string) => {
  const { error } = await supabase
    .from('chart_scripts')
    .upsert({ 
      chart_id: chartId, 
      script: scriptContent,
      updated_at: new Date() 
    });

  if (error) throw new Error("Mühürleme başarısız: " + error.message);
  return true;
};
