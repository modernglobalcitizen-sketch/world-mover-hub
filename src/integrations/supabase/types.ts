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
      [_ in never]: never
    }
    Functions: {
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
