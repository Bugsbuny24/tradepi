import crypto from 'crypto';

/**
 * Shopier'den gelen verinin doğruluğunu kontrol eder.
 * @param data Shopier'den gelen POST body verisi
 * @param signature Shopier'den gelen signature (genelde data['signature'])
 */
export function verifyShopierSignature(data: any, signature: string): boolean {
  const shopierSecret = process.env.SHOPIER_SECRET_KEY;
  if (!shopierSecret) {
    console.error("❌ HATA: SHOPIER_SECRET_KEY tanımlanmamış!");
    return false;
  }

  // Shopier algoritması: random + id + amount verilerini birleştirip hashler
  // Not: Shopier dökümantasyonundaki spesifik sırayı buraya ekliyoruz
  const expectedData = data.random + data.id + data.amount;
  const hash = crypto
    .createHmac('sha256', shopierSecret)
    .update(expectedData)
    .digest('base64');

  return hash === signature;
}
