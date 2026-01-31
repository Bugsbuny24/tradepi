// Şemadaki temel tabloların tipleri
export type Listing = {
  id: string;
  owner_id: string;
  title: string;
  base_price: number;
  listing_type: 'b2b' | 'digital' | 'service';
  active: boolean;
};

export type RFQRequest = {
  id: string;
  buyer_id: string;
  listing_id: string;
  quantity: number;
  budget_min: number;
  budget_max: number;
  status: 'pending' | 'accepted' | 'rejected';
};

export type PiPayment = {
  id: string;
  pi_tx_id: string;
  amount_pi: number;
  status: string;
};
