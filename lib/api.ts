import { supabase } from './supabase';

export const TradepigloballAPI = {
  // 1. B2B İlanlarını ve Detaylarını Çek (B2B_DETAILS ile JOIN)
  async getB2BListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*, b2b_details(*)')
      .eq('listing_type', 'b2b')
      .eq('active', true);
    return { data, error };
  },

  // 2. Yeni RFQ (Teklif İsteği) Oluştur (RFQ_REQUESTS tablosu)
  async createRFQ(rfqData: Partial<RFQRequest>) {
    const { data, error } = await supabase
      .from('rfq_requests')
      .insert([rfqData]);
    return { data, error };
  },

  // 3. Pi Ödemesini Kaydet (PI_PAYMENTS tablosu)
  async recordPiPayment(paymentData: Partial<PiPayment>) {
    const { data, error } = await supabase
      .from('pi_payments')
      .insert([paymentData]);
    return { data, error };
  },

  // 4. Kullanıcı Cüzdan Bakiyesi (CREDIT_WALLETS tablosu)
  async getWalletBalance(userId: string) {
    const { data, error } = await supabase
      .from('credit_wallets')
      .select('balance')
      .eq('user_id', userId)
      .single();
    return { data, error };
  }
};
