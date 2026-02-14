// types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      charts: {
        Row: {
          id: string
          user_id: string
          title: string | null
          chart_type: string // 'bar' | 'line' | 'pie' vb.
          is_public: boolean
          price: number | null
          is_locked: boolean | null
          created_at: string
        }
      },
      data_entries: {
        Row: {
          id: string
          chart_id: string
          label: string
          value: number
          sort_order: number
          created_at: string
        }
      },
      user_quotas: {
        Row: {
          user_id: string
          api_call_remaining: number
          credits_remaining: number
          embed_create_remaining: number
          tier: string | null
          updated_at: string
        }
      }
    }
  }
}
