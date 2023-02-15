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
      api_key_app: {
        Row: {
          api_key_id: string | null
          app_id: string | null
          id: string
        }
        Insert: {
          api_key_id?: string | null
          app_id?: string | null
          id?: string
        }
        Update: {
          api_key_id?: string | null
          app_id?: string | null
          id?: string
        }
      }
      api_key_developer: {
        Row: {
          api_key_id: string | null
          developer_id: string | null
          id: string
        }
        Insert: {
          api_key_id?: string | null
          developer_id?: string | null
          id?: string
        }
        Update: {
          api_key_id?: string | null
          developer_id?: string | null
          id?: string
        }
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
      }
      apps: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
      }
      channel_app: {
        Row: {
          app_id: string | null
          channel_id: string | null
          id: string
        }
        Insert: {
          app_id?: string | null
          channel_id?: string | null
          id?: string
        }
        Update: {
          app_id?: string | null
          channel_id?: string | null
          id?: string
        }
      }
      channels: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string | null
          updated_at?: string
        }
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
      }
      company_app: {
        Row: {
          app_id: string | null
          company_id: string | null
          id: string
        }
        Insert: {
          app_id?: string | null
          company_id?: string | null
          id?: string
        }
        Update: {
          app_id?: string | null
          company_id?: string | null
          id?: string
        }
      }
      company_developer: {
        Row: {
          company_id: string | null
          developer_owner_id: string | null
          id: string
        }
        Insert: {
          company_id?: string | null
          developer_owner_id?: string | null
          id?: string
        }
        Update: {
          company_id?: string | null
          developer_owner_id?: string | null
          id?: string
        }
      }
      developer_app: {
        Row: {
          app_id: string | null
          developer_id: string | null
          id: string
        }
        Insert: {
          app_id?: string | null
          developer_id?: string | null
          id?: string
        }
        Update: {
          app_id?: string | null
          developer_id?: string | null
          id?: string
        }
      }
      developers: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
      }
      message_channel: {
        Row: {
          channel_id: string | null
          id: string
          message: string | null
        }
        Insert: {
          channel_id?: string | null
          id?: string
          message?: string | null
        }
        Update: {
          channel_id?: string | null
          id?: string
          message?: string | null
        }
      }
      message_user: {
        Row: {
          id: string
          message: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message?: string | null
          user_id?: string | null
        }
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          updated_at?: string
        }
      }
      user_app: {
        Row: {
          app_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          app_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          app_id?: string | null
          id?: string
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
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
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
