// types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; role: string | null; free_claimed: boolean; created_at: string }
        Insert: { id: string; role?: string | null; free_claimed?: boolean }
      },
      user_quotas: {
        Row: { 
          user_id: string; 
          api_call_remaining: number; 
          embed_view_remaining: number;
          credits_remaining: number;
          updated_at: string 
        }
      },
      charts: {
        Row: { id: string; user_id: string; title: string | null; chart_type: string; is_public: boolean }
        Insert: { user_id: string; title?: string | null; chart_type: string; is_public?: boolean }
      },
      chart_scripts: {
        Row: { chart_id: string; script: string; updated_at: string }
        Insert: { chart_id: string; script: string }
      }
      // ... Diğer tablolar (pi_purchases, usage_logs vb.) bu mantıkla eklenecek
    }
  }
}
