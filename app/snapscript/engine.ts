import { parse } from './core/parser'
import { executeSnapScript } from './core/runtime'
import { createSealedContext } from './core/seal'

/**
 * SnapScript Ana Motoru
 * Scripti parse eder, mühürler ve güvenli ortamda çalıştırır.
 */
export async function runSnapEngine(inputData: any, scriptCode: string) {
  try {
    // 1. Önce scriptin temel güvenlik kontrolünü ve parse işlemini yap (Opsiyonel)
    // Eğer parser dosyan hazırsa burada parse(scriptCode) çağrılabilir.

    // 2. Güvenli runtime üzerinden scripti çalıştır
    // 'run' yerine yeni 'executeSnapScript' fonksiyonunu kullanıyoruz.
    const result = await executeSnapScript(scriptCode, inputData);

    if (!result.success) {
      return {
        success: false,
        error: `SnapScript Çalıştırma Hatası: ${result.error}`,
        duration: result.duration
      };
    }

    return {
      success: true,
      data: result.data,
      duration: result.duration
    };

  } catch (error: any) {
    console.error('SnapEngine Kritik Hata:', error.message);
    return {
      success: false,
      error: 'Motor beklenmedik bir hata ile durdu.'
    };
  }
}
