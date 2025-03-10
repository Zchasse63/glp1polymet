
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
      medications: {
        Row: {
          id: string
          name: string
          dose: string
          frequency: string
          last_taken: string | null
          next_dose: string | null
          level: number
          total_dose: number | null
          unit: string | null
          color: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          dose: string
          frequency: string
          last_taken?: string | null
          next_dose?: string | null
          level?: number
          total_dose?: number | null
          unit?: string | null
          color: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          dose?: string
          frequency?: string
          last_taken?: string | null
          next_dose?: string | null
          level?: number
          total_dose?: number | null
          unit?: string | null
          color?: string
          user_id?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          glp_start_date: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          glp_start_date?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          glp_start_date?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
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
