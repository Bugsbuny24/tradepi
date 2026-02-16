import { randomBytes, createHash } from 'crypto';

/**
 * Güvenli bir API anahtarı üretir.
 * Format: sl_live_ [32 karakter random string]
 */
export function generateSecureApiKey() {
  const prefix = 'sl_live_';
  const secret = randomBytes(24).toString('hex'); // 48 karakterlik güvenli string
  const fullKey = `${prefix}${secret}`;
  
  // Veritabanında saklanacak hash
  const hash = createHash('sha256').update(fullKey).digest('hex');
  
  return {
    fullKey, // Kullanıcıya SADECE BİR KEZ gösterilecek
    prefix,  // Listeleme için maskeli hal (sl_live_...)
    hash     // Veritabanında saklanacak güvenli kopya
  };
}
