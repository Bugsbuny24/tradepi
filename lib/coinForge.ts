import { supabase } from './supabase';

export const CoinForgeAPI = {
  // Yeni Coin Bilgilerini Kaydet (token_treasury tablosu)
  async createToken(tokenData: any) {
    return await supabase
      .from('token_treasury')
      .insert([tokenData]);
  },

  // Coin Yakma İşlemi (token_burns tablosu)
  async burnToken(burnData: any) {
    return await supabase
      .from('token_burns')
      .insert([burnData]);
  }
};

