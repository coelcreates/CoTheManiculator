export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          base_duration_minutes: number
          base_price: number | null
          has_length_options: boolean
          buffer_time_minutes: number
          is_addon: boolean
          requires_base_service: boolean
          can_be_booked_alone: boolean
          display_order: number | null
          is_active: boolean
          created_at: string
        }
      }
      customers: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string
          google_id: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}