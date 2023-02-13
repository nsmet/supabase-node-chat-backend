export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      channels: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string
        }
        Insert: {
          created_at: string
          id?: string
          name: string
          owner_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string
        }
      }
      messages: {
        Row: {
          channel_id: string | null
          created_at: string
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at: string
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string
          id?: string
          message?: string
          user_id?: string | null
        }
      }
      user_channel: {
        Row: {
          channel_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          channel_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          channel_id?: string | null
          id?: string
          user_id?: string | null
        }
      }
      users: {
        Row: {
          created_at: string
          id: string
          username: string
          apikey?: string
        }
        Insert: {
          created_at: string
          id?: string
          username: string
          apikey?: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
          apikey?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
