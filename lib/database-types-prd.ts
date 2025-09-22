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
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          full_name: string
          phone: string | null
          role: 'student' | 'provider' | 'admin'
          profile_image: string | null
          student_id: string | null
          department: string | null
          level: string | null
          status: 'active' | 'pending' | 'suspended' | 'rejected'
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role?: 'student' | 'provider' | 'admin'
          profile_image?: string | null
          student_id?: string | null
          department?: string | null
          level?: string | null
          status?: 'active' | 'pending' | 'suspended' | 'rejected'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: 'student' | 'provider' | 'admin'
          profile_image?: string | null
          student_id?: string | null
          department?: string | null
          level?: string | null
          status?: 'active' | 'pending' | 'suspended' | 'rejected'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          student_id: string
          department: string
          level: string
          year_of_study: number | null
          total_bookings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          student_id: string
          department: string
          level: string
          year_of_study?: number | null
          total_bookings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          student_id?: string
          department?: string
          level?: string
          year_of_study?: number | null
          total_bookings?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          provider_count: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          provider_count?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          provider_count?: number
          is_active?: boolean
          created_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          description: string
          bio: string | null
          specialization: string[]
          experience_years: number
          location: string
          rating: number
          total_reviews: number
          verified: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
          verification_evidence: string[] | null
          certificates: string[] | null
          verification_reviewed_at: string | null
          verification_reviewed_by: string | null
          verification_notes: string | null
          is_available: boolean
          available_for_work: boolean
          available_for_learning: boolean
          response_time: string
          service_rate: number | null
          learning_rate: number | null
          currency: string
          whatsapp_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          description: string
          bio?: string | null
          specialization: string[]
          experience_years?: number
          location: string
          rating?: number
          total_reviews?: number
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          verification_evidence?: string[] | null
          certificates?: string[] | null
          verification_reviewed_at?: string | null
          verification_reviewed_by?: string | null
          verification_notes?: string | null
          is_available?: boolean
          available_for_work?: boolean
          available_for_learning?: boolean
          response_time?: string
          service_rate?: number | null
          learning_rate?: number | null
          currency?: string
          whatsapp_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          description?: string
          bio?: string | null
          specialization?: string[]
          experience_years?: number
          location?: string
          rating?: number
          total_reviews?: number
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          verification_evidence?: string[] | null
          certificates?: string[] | null
          verification_reviewed_at?: string | null
          verification_reviewed_by?: string | null
          verification_notes?: string | null
          is_available?: boolean
          available_for_work?: boolean
          available_for_learning?: boolean
          response_time?: string
          service_rate?: number | null
          learning_rate?: number | null
          currency?: string
          whatsapp_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      portfolio: {
        Row: {
          id: string
          provider_id: string
          title: string
          description: string | null
          images: string[]
          category: string | null
          featured: boolean
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          title: string
          description?: string | null
          images: string[]
          category?: string | null
          featured?: boolean
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          title?: string
          description?: string | null
          images?: string[]
          category?: string | null
          featured?: boolean
          completed_at?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          student_id: string
          provider_id: string
          service_type: 'direct_service' | 'training'
          description: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booked_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          provider_id: string
          service_type?: 'direct_service' | 'training'
          description?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booked_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          provider_id?: string
          service_type?: 'direct_service' | 'training'
          description?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          booked_at?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          student_id: string
          provider_id: string
          booking_id: string | null
          student_name: string
          rating: number
          comment: string | null
          service_type: 'direct_service' | 'training'
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          provider_id: string
          booking_id?: string | null
          student_name: string
          rating: number
          comment?: string | null
          service_type?: 'direct_service' | 'training'
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          provider_id?: string
          booking_id?: string | null
          student_name?: string
          rating?: number
          comment?: string | null
          service_type?: 'direct_service' | 'training'
          verified?: boolean
          created_at?: string
        }
      }
      verification_requests: {
        Row: {
          id: string
          provider_id: string
          status: 'pending' | 'approved' | 'rejected'
          evidence_files: string[]
          admin_notes: string | null
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          provider_id: string
          status?: 'pending' | 'approved' | 'rejected'
          evidence_files: string[]
          admin_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          provider_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          evidence_files?: string[]
          admin_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      contact_requests: {
        Row: {
          id: string
          student_id: string
          provider_id: string
          service_type: 'direct_service' | 'training'
          contact_method: string
          message_preview: string | null
          contacted_at: string
          response_received: boolean
          booking_completed: boolean
        }
        Insert: {
          id?: string
          student_id: string
          provider_id: string
          service_type?: 'direct_service' | 'training'
          contact_method?: string
          message_preview?: string | null
          contacted_at?: string
          response_received?: boolean
          booking_completed?: boolean
        }
        Update: {
          id?: string
          student_id?: string
          provider_id?: string
          service_type?: 'direct_service' | 'training'
          contact_method?: string
          message_preview?: string | null
          contacted_at?: string
          response_received?: boolean
          booking_completed?: boolean
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