export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      affiliate_sales: {
        Row: {
          affiliate_id: string
          buyer_email: string | null
          commission_amount: number
          created_at: string
          ebook_title: string
          id: string
          notes: string | null
          paid_at: string | null
          sale_amount: number
          status: string
        }
        Insert: {
          affiliate_id: string
          buyer_email?: string | null
          commission_amount: number
          created_at?: string
          ebook_title: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          sale_amount?: number
          status?: string
        }
        Update: {
          affiliate_id?: string
          buyer_email?: string | null
          commission_amount?: number
          created_at?: string
          ebook_title?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          sale_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          commission_rate: number
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          referral_code: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          referral_code: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          commission_rate?: number
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          referral_code?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          opportunity_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      breakout_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          field: string
          id: string
          is_private: boolean
          max_members: number | null
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          field: string
          id?: string
          is_private?: boolean
          max_members?: number | null
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          field?: string
          id?: string
          is_private?: boolean
          max_members?: number | null
          name?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      fund_applications: {
        Row: {
          admin_notes: string | null
          amount_requested: number
          created_at: string
          description: string
          id: string
          purpose: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount_requested: number
          created_at?: string
          description: string
          id?: string
          purpose: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount_requested?: number
          created_at?: string
          description?: string
          id?: string
          purpose?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fund_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          recipient_name: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description: string
          id?: string
          recipient_name?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          recipient_name?: string | null
          transaction_type?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          about: string
          benefits: string | null
          category: string
          created_at: string
          deadline: string | null
          eligibility: string | null
          id: string
          is_active: boolean
          link: string | null
          location: string | null
          requirements: string | null
          title: string
          updated_at: string
        }
        Insert: {
          about: string
          benefits?: string | null
          category: string
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean
          link?: string | null
          location?: string | null
          requirements?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          about?: string
          benefits?: string | null
          category?: string
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean
          link?: string | null
          location?: string | null
          requirements?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string
          created_at: string
          display_name: string | null
          email: string | null
          field_of_work: string | null
          founding_member_number: number | null
          id: string
          is_founding_member: boolean
          opportunity_interests: string[] | null
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          field_of_work?: string | null
          founding_member_number?: number | null
          id: string
          is_founding_member?: boolean
          opportunity_interests?: string[] | null
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          field_of_work?: string | null
          founding_member_number?: number | null
          id?: string
          is_founding_member?: boolean
          opportunity_interests?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      remote_job_applications: {
        Row: {
          country: string | null
          created_at: string
          details: string | null
          email: string
          id: string
          name: string
          resume_url: string | null
          status: string
          status_updated_at: string | null
          user_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          details?: string | null
          email: string
          id?: string
          name: string
          resume_url?: string | null
          status?: string
          status_updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          details?: string | null
          email?: string
          id?: string
          name?: string
          resume_url?: string | null
          status?: string
          status_updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      remote_jobs: {
        Row: {
          apply_url: string | null
          category: string
          company_name: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          job_type: string
          location: string
          salary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          apply_url?: string | null
          category?: string
          company_name: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          job_type?: string
          location?: string
          salary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          apply_url?: string | null
          category?: string
          company_name?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          job_type?: string
          location?: string
          salary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          review_text: string
          reviewer_email: string | null
          reviewer_name: string
          service: string
          verified_purchase: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          review_text: string
          reviewer_email?: string | null
          reviewer_name: string
          service: string
          verified_purchase?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          review_text?: string
          reviewer_email?: string | null
          reviewer_name?: string
          service?: string
          verified_purchase?: boolean
        }
        Relationships: []
      }
      room_invitations: {
        Row: {
          created_at: string
          id: string
          invited_by: string
          invited_user_id: string
          message: string | null
          responded_at: string | null
          room_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by: string
          invited_user_id: string
          message?: string | null
          responded_at?: string | null
          room_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string
          invited_user_id?: string
          message?: string | null
          responded_at?: string | null
          room_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_invitations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "breakout_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "breakout_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "breakout_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_shared_opportunities: {
        Row: {
          created_at: string
          id: string
          message: string | null
          opportunity_id: string
          room_id: string
          shared_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id: string
          room_id: string
          shared_by: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          opportunity_id?: string
          room_id?: string
          shared_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_shared_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_shared_opportunities_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "breakout_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_opportunities: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_remote_jobs: {
        Row: {
          created_at: string
          id: string
          remote_job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          remote_job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          remote_job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_remote_jobs_remote_job_id_fkey"
            columns: ["remote_job_id"]
            isOneToOne: false
            referencedRelation: "remote_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          canceled_at: string | null
          created_at: string
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: string
          paypal_payer_id: string | null
          paypal_subscription_id: string
          plan_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: string
          paypal_payer_id?: string | null
          paypal_subscription_id: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: string
          paypal_payer_id?: string | null
          paypal_subscription_id?: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      talent_intro_requests: {
        Row: {
          created_at: string
          id: string
          message: string
          requester_company: string | null
          requester_email: string
          requester_name: string
          status: string
          talent_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          requester_company?: string | null
          requester_email: string
          requester_name: string
          status?: string
          talent_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          requester_company?: string | null
          requester_email?: string
          requester_name?: string
          status?: string
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_intro_requests_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_pool"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_pool: {
        Row: {
          additional_notes: string | null
          availability: string
          cover_letter_url: string | null
          created_at: string
          education_level: string
          email: string
          id: string
          industry: string
          is_featured: boolean
          linkedin_url: string | null
          name: string
          phone: string | null
          portfolio_url: string | null
          resume_url: string | null
          role_current: string | null
          role_desired: string | null
          salary_expectation: string | null
          skills: string | null
          status: string
          status_updated_at: string | null
          user_id: string | null
          work_authorization: string
          years_of_experience: string
        }
        Insert: {
          additional_notes?: string | null
          availability: string
          cover_letter_url?: string | null
          created_at?: string
          education_level: string
          email: string
          id?: string
          industry: string
          is_featured?: boolean
          linkedin_url?: string | null
          name: string
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          role_current?: string | null
          role_desired?: string | null
          salary_expectation?: string | null
          skills?: string | null
          status?: string
          status_updated_at?: string | null
          user_id?: string | null
          work_authorization: string
          years_of_experience: string
        }
        Update: {
          additional_notes?: string | null
          availability?: string
          cover_letter_url?: string | null
          created_at?: string
          education_level?: string
          email?: string
          id?: string
          industry?: string
          is_featured?: boolean
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          role_current?: string | null
          role_desired?: string | null
          salary_expectation?: string | null
          skills?: string | null
          status?: string
          status_updated_at?: string | null
          user_id?: string | null
          work_authorization?: string
          years_of_experience?: string
        }
        Relationships: []
      }
      teach_abroad_programs: {
        Row: {
          apply_url: string | null
          benefits: string | null
          contract_length: string | null
          country: string
          created_at: string
          deadline: string | null
          description: string
          id: string
          is_active: boolean
          organization: string
          program_name: string | null
          region: string
          requirements: string | null
          salary: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          apply_url?: string | null
          benefits?: string | null
          contract_length?: string | null
          country: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          is_active?: boolean
          organization: string
          program_name?: string | null
          region?: string
          requirements?: string | null
          salary?: string | null
          subject?: string
          updated_at?: string
        }
        Update: {
          apply_url?: string | null
          benefits?: string | null
          contract_length?: string | null
          country?: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          is_active?: boolean
          organization?: string
          program_name?: string | null
          region?: string
          requirements?: string | null
          salary?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      fund_applications_user: {
        Row: {
          amount_requested: number | null
          created_at: string | null
          description: string | null
          id: string | null
          purpose: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_requested?: number | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          purpose?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_requested?: number | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          purpose?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions_safe: {
        Row: {
          amount: number | null
          canceled_at: string | null
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          email: string | null
          id: string | null
          plan_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          canceled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string | null
          id?: string | null
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          canceled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string | null
          id?: string | null
          plan_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_affiliate_sales: {
        Args: never
        Returns: {
          commission_amount: number
          created_at: string
          ebook_title: string
          id: string
          sale_amount: number
          status: string
        }[]
      }
      get_featured_talent_pool: {
        Args: never
        Returns: {
          created_at: string
          education_level: string
          id: string
          industry: string
          portfolio_url: string
          role_current: string
          role_desired: string
          skills: string
          years_of_experience: string
        }[]
      }
      get_founding_members_public: {
        Args: never
        Returns: {
          country: string
          created_at: string
          display_name: string
          founding_member_number: number
          id: string
        }[]
      }
      get_reviews_admin: {
        Args: never
        Returns: {
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          review_text: string
          reviewer_email: string
          reviewer_name: string
          service: string
          verified_purchase: boolean
        }[]
      }
      has_pending_invitation: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_room_creator: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_member: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "member"],
    },
  },
} as const
