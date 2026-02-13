// @/lib/supabase yolunu kullanarak import hatasını çözüyoruz
import { supabase } from '@/lib/supabase';

/**
 * SnapLogic Core Engine v1.0
 * Reaktif veri yayılımı ve SnapScript v0 yetkilendirme motoru.
 */

export const initializeSnapEngine = async (userId: string) => {
  // Kullanıcının paket yetkilerini kontrol et
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  const userRole = profile?.role || 'none';

  // SnapScript v0 Runtime Kapasitesini Tanımla
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
