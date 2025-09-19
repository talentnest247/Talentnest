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
          password: string
          first_name: string
          last_name: string
          full_name: string
          phone: string
          role: 'student' | 'artisan' | 'admin'
          profile_image: string | null
          student_id: string | null
          department: string | null
          level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          first_name: string
          last_name: string
          full_name: string
          phone: string
          role: 'student' | 'artisan' | 'admin'
          profile_image?: string | null
          student_id?: string | null
          department?: string | null
          level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          first_name?: string
          last_name?: string
          full_name?: string
          phone?: string
          role?: 'student' | 'artisan' | 'admin'
          profile_image?: string | null
          student_id?: string | null
          department?: string | null
          level?: string | null
          created_at?: string
          updated_at?: string
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
          experience: number
          location: string
          rating: number
          total_reviews: number
          verified: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
          verification_evidence: string[]
          certificates: string[]
          whatsapp_number: string | null
          availability_is_available: boolean
          availability_available_for_work: boolean
          availability_available_for_learning: boolean
          availability_response_time: string
          pricing_base_rate: number | null
          pricing_learning_rate: number | null
          pricing_currency: string
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
          experience: number
          location: string
          rating?: number
          total_reviews?: number
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          verification_evidence?: string[]
          certificates?: string[]
          whatsapp_number?: string | null
          availability_is_available?: boolean
          availability_available_for_work?: boolean
          availability_available_for_learning?: boolean
          availability_response_time?: string
          pricing_base_rate?: number | null
          pricing_learning_rate?: number | null
          pricing_currency?: string
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
          experience?: number
          location?: string
          rating?: number
          total_reviews?: number
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          verification_evidence?: string[]
          certificates?: string[]
          whatsapp_number?: string | null
          availability_is_available?: boolean
          availability_available_for_work?: boolean
          availability_available_for_learning?: boolean
          availability_response_time?: string
          pricing_base_rate?: number | null
          pricing_learning_rate?: number | null
          pricing_currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          provider_id: string
          title: string
          description: string
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration: string
          price: number
          max_students: number
          current_students: number
          images: string[]
          syllabus: string[]
          requirements: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          title: string
          description: string
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration: string
          price: number
          max_students: number
          current_students?: number
          images?: string[]
          syllabus?: string[]
          requirements?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          title?: string
          description?: string
          category?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration?: string
          price?: number
          max_students?: number
          current_students?: number
          images?: string[]
          syllabus?: string[]
          requirements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          skill_id: string
          provider_id: string
          status: 'pending' | 'active' | 'completed' | 'cancelled'
          enrolled_at: string
          completed_at: string | null
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          skill_id: string
          provider_id: string
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          enrolled_at?: string
          completed_at?: string | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          skill_id?: string
          provider_id?: string
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          enrolled_at?: string
          completed_at?: string | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      verification_requests: {
        Row: {
          id: string
          provider_id: string
          status: 'pending' | 'approved' | 'rejected'
          evidence_urls: string[]
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          status?: 'pending' | 'approved' | 'rejected'
          evidence_urls?: string[]
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          evidence_urls?: string[]
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_requests: {
        Row: {
          id: string
          student_id: string
          provider_id: string
          service_type: 'skill_learning' | 'direct_service'
          contact_method: 'whatsapp' | 'phone' | 'email'
          message_preview: string
          contacted_at: string
          response_received: boolean
          response_time_hours: number | null
          booking_completed: boolean
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          provider_id: string
          service_type: 'skill_learning' | 'direct_service'
          contact_method: 'whatsapp' | 'phone' | 'email'
          message_preview: string
          contacted_at?: string
          response_received?: boolean
          response_time_hours?: number | null
          booking_completed?: boolean
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          provider_id?: string
          service_type?: 'skill_learning' | 'direct_service'
          contact_method?: 'whatsapp' | 'phone' | 'email'
          message_preview?: string
          contacted_at?: string
          response_received?: boolean
          response_time_hours?: number | null
          booking_completed?: boolean
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          skill_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          skill_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          skill_count?: number
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
      user_role: 'student' | 'artisan' | 'admin'
      verification_status: 'pending' | 'approved' | 'rejected'
      enrollment_status: 'pending' | 'active' | 'completed' | 'cancelled'
      difficulty_level: 'beginner' | 'intermediate' | 'advanced'
      service_type: 'skill_learning' | 'direct_service'
      contact_method: 'whatsapp' | 'phone' | 'email'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
