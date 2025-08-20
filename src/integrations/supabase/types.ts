export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          created_at: string
          id: string
          section1_application_outcomes: string[] | null
          section1_changes_description: string | null
          section1_cooperation_level: number | null
          section1_cooperation_usage: string[] | null
          section1_cooperation_usage_other: string | null
          section1_culture_level: number | null
          section1_culture_usage: string[] | null
          section1_culture_usage_other: string | null
          section1_funding_level: number | null
          section1_funding_usage: string[] | null
          section1_funding_usage_other: string | null
          section1_green_level: number | null
          section1_green_usage: string[] | null
          section1_green_usage_other: string | null
          section1_it_level: number | null
          section1_it_usage: string[] | null
          section1_it_usage_other: string | null
          section1_knowledge_after: number | null
          section1_knowledge_before: number | null
          section1_knowledge_outcomes: string[] | null
          section1_knowledge_solutions: string[] | null
          section1_knowledge_solutions_other: string | null
          section1_new_dev_level: number | null
          section1_new_dev_usage: string[] | null
          section1_new_dev_usage_other: string | null
          section1_overall_change_level: number | null
          section1_problems_before: string[] | null
          section1_problems_other: string | null
          section1_success_description: string | null
          section1_success_factors: string[] | null
          section1_success_factors_other: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          section1_application_outcomes?: string[] | null
          section1_changes_description?: string | null
          section1_cooperation_level?: number | null
          section1_cooperation_usage?: string[] | null
          section1_cooperation_usage_other?: string | null
          section1_culture_level?: number | null
          section1_culture_usage?: string[] | null
          section1_culture_usage_other?: string | null
          section1_funding_level?: number | null
          section1_funding_usage?: string[] | null
          section1_funding_usage_other?: string | null
          section1_green_level?: number | null
          section1_green_usage?: string[] | null
          section1_green_usage_other?: string | null
          section1_it_level?: number | null
          section1_it_usage?: string[] | null
          section1_it_usage_other?: string | null
          section1_knowledge_after?: number | null
          section1_knowledge_before?: number | null
          section1_knowledge_outcomes?: string[] | null
          section1_knowledge_solutions?: string[] | null
          section1_knowledge_solutions_other?: string | null
          section1_new_dev_level?: number | null
          section1_new_dev_usage?: string[] | null
          section1_new_dev_usage_other?: string | null
          section1_overall_change_level?: number | null
          section1_problems_before?: string[] | null
          section1_problems_other?: string | null
          section1_success_description?: string | null
          section1_success_factors?: string[] | null
          section1_success_factors_other?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          section1_application_outcomes?: string[] | null
          section1_changes_description?: string | null
          section1_cooperation_level?: number | null
          section1_cooperation_usage?: string[] | null
          section1_cooperation_usage_other?: string | null
          section1_culture_level?: number | null
          section1_culture_usage?: string[] | null
          section1_culture_usage_other?: string | null
          section1_funding_level?: number | null
          section1_funding_usage?: string[] | null
          section1_funding_usage_other?: string | null
          section1_green_level?: number | null
          section1_green_usage?: string[] | null
          section1_green_usage_other?: string | null
          section1_it_level?: number | null
          section1_it_usage?: string[] | null
          section1_it_usage_other?: string | null
          section1_knowledge_after?: number | null
          section1_knowledge_before?: number | null
          section1_knowledge_outcomes?: string[] | null
          section1_knowledge_solutions?: string[] | null
          section1_knowledge_solutions_other?: string | null
          section1_new_dev_level?: number | null
          section1_new_dev_usage?: string[] | null
          section1_new_dev_usage_other?: string | null
          section1_overall_change_level?: number | null
          section1_problems_before?: string[] | null
          section1_problems_other?: string | null
          section1_success_description?: string | null
          section1_success_factors?: string[] | null
          section1_success_factors_other?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "survey_users"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses_section2: {
        Row: {
          created_at: string
          id: string
          response_id: string
          section2_applications: Json | null
          section2_continued_development: string | null
          section2_data_benefits: string[] | null
          section2_data_level: number | null
          section2_data_sources: string | null
          section2_data_types: string[] | null
          section2_data_types_other: string | null
          section2_network_expansion: Json | null
          section2_partner_organizations: string[] | null
          section2_partner_organizations_other: string | null
          section2_partner_participation: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          response_id: string
          section2_applications?: Json | null
          section2_continued_development?: string | null
          section2_data_benefits?: string[] | null
          section2_data_level?: number | null
          section2_data_sources?: string | null
          section2_data_types?: string[] | null
          section2_data_types_other?: string | null
          section2_network_expansion?: Json | null
          section2_partner_organizations?: string[] | null
          section2_partner_organizations_other?: string | null
          section2_partner_participation?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          response_id?: string
          section2_applications?: Json | null
          section2_continued_development?: string | null
          section2_data_benefits?: string[] | null
          section2_data_level?: number | null
          section2_data_sources?: string | null
          section2_data_types?: string[] | null
          section2_data_types_other?: string | null
          section2_network_expansion?: Json | null
          section2_partner_organizations?: string[] | null
          section2_partner_organizations_other?: string | null
          section2_partner_participation?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_section2_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "survey_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses_section3: {
        Row: {
          budget_knowledge_development: number | null
          budget_system_development: number | null
          communication_to_users: number | null
          cooperation_between_agencies: number | null
          created_at: string
          digital_infrastructure: number | null
          digital_mindset: number | null
          government_digital_support: number | null
          id: string
          innovation_ecosystem: number | null
          internal_communication: number | null
          it_skills: number | null
          leadership_importance: number | null
          learning_organization: number | null
          policy_continuity: number | null
          policy_stability: number | null
          reaching_target_groups: number | null
          response_id: string
          staff_importance: number | null
          updated_at: string
        }
        Insert: {
          budget_knowledge_development?: number | null
          budget_system_development?: number | null
          communication_to_users?: number | null
          cooperation_between_agencies?: number | null
          created_at?: string
          digital_infrastructure?: number | null
          digital_mindset?: number | null
          government_digital_support?: number | null
          id?: string
          innovation_ecosystem?: number | null
          internal_communication?: number | null
          it_skills?: number | null
          leadership_importance?: number | null
          learning_organization?: number | null
          policy_continuity?: number | null
          policy_stability?: number | null
          reaching_target_groups?: number | null
          response_id: string
          staff_importance?: number | null
          updated_at?: string
        }
        Update: {
          budget_knowledge_development?: number | null
          budget_system_development?: number | null
          communication_to_users?: number | null
          cooperation_between_agencies?: number | null
          created_at?: string
          digital_infrastructure?: number | null
          digital_mindset?: number | null
          government_digital_support?: number | null
          id?: string
          innovation_ecosystem?: number | null
          internal_communication?: number | null
          it_skills?: number | null
          leadership_importance?: number | null
          learning_organization?: number | null
          policy_continuity?: number | null
          policy_stability?: number | null
          reaching_target_groups?: number | null
          response_id?: string
          staff_importance?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_section3_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "survey_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_users: {
        Row: {
          auth_user_id: string | null
          created_at: string
          full_name: string
          id: string
          organization: string
          phone: string
          position: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          full_name: string
          id?: string
          organization: string
          phone: string
          position: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          organization?: string
          phone?: string
          position?: string
          updated_at?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
