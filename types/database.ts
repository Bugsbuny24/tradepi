export type Profile = {
  id: string;
  role: 'user' | 'admin';
  free_claimed: boolean;
  created_at: string;
};

export type Chart = {
  id: string;
  user_id: string;
  title: string | null;
  chart_type: string;
  is_public: boolean;
  price: number;
  created_at: string;
};

export type DataEntry = {
  id: string;
  chart_id: string;
  label: string;
  value: number;
  sort_order: number;
};

export type UserQuota = {
  user_id: string;
  credits_remaining: number;
  api_call_remaining: number;
  tier: string;
};
