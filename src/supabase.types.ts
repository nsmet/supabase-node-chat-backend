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
      api_keys: {
        Row: {
          app_id: string
          company_id: string
          created_at: string
          id: string
          key: string
          name: string
          owner_user_id: string
          updated_at: string | null
        }
        Insert: {
          app_id: string
          company_id: string
          created_at?: string
          id?: string
          key: string
          name: string
          owner_user_id: string
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          company_id?: string
          created_at?: string
          id?: string
          key?: string
          name?: string
          owner_user_id?: string
          updated_at?: string | null
        }
      }
      apps: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          owner_user_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          name: string
          owner_user_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string
          updated_at?: string | null
        }
      }
      channels: {
        Row: {
          app_id: string
          created_at: string
          id: string
          name: string
          owner_user_id: string
          updated_at: string | null
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          name: string
          owner_user_id: string
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string
          updated_at?: string | null
        }
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string
          updated_at?: string | null
        }
      }
      messages: {
        Row: {
          channel_id: string | null
          created_at: string
          id: string
          message: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string
          id?: string
          message: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string
          id?: string
          message?: string
          updated_at?: string | null
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
          app_id: string | null
          created_at: string
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          app_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          app_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string | null
          username?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
