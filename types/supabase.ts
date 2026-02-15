export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_quotas: {
        Row: {
          user_id: string
          credits_remaining: number
          api_call_remaining: number
          embed_view_remaining: number
          tier: string | null
          updated_at: string
        }
      },
      charts: {
        Row: {
          id: string
          user_id: string
          title: string | null
          chart_type: string
          config: Json | null
          is_public: boolean
          created_at: string
        }
      },
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          api_key: string | null
        }
      }
    }
  }
}
