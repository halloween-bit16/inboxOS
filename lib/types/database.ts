export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string;
          role: string;
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          avatar_url?: string;
          role?: string;
          department?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string;
          role?: string;
          department?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      threads: {
        Row: {
          id: string;
          subject: string;
          status: string;
          urgency_score: number;
          category: string;
          priority: string;
          pending_action: string;
          stakeholders: string[];
          deadline: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          subject: string;
          status?: string;
          urgency_score?: number;
          category?: string;
          priority?: string;
          pending_action?: string;
          stakeholders?: string[];
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          subject?: string;
          status?: string;
          urgency_score?: number;
          category?: string;
          priority?: string;
          pending_action?: string;
          stakeholders?: string[];
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
          created_by?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_name: string;
          sender_email: string;
          content: string;
          message_type: string;
          created_at: string;
          is_external: boolean;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_name: string;
          sender_email: string;
          content: string;
          message_type?: string;
          created_at?: string;
          is_external?: boolean;
        };
        Update: {
          id?: string;
          thread_id?: string;
          sender_name?: string;
          sender_email?: string;
          content?: string;
          message_type?: string;
          created_at?: string;
          is_external?: boolean;
        };
      };
      actions: {
        Row: {
          id: string;
          thread_id: string;
          action_type: string;
          description: string;
          status: string;
          created_by: string | null;
          completed_by: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          thread_id: string;
          action_type: string;
          description: string;
          status?: string;
          created_by?: string | null;
          completed_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          thread_id?: string;
          action_type?: string;
          description?: string;
          status?: string;
          created_by?: string | null;
          completed_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      reminders: {
        Row: {
          id: string;
          thread_id: string;
          reminder_type: string;
          message: string;
          reminder_date: string;
          is_sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          reminder_type: string;
          message: string;
          reminder_date: string;
          is_sent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          reminder_type?: string;
          message?: string;
          reminder_date?: string;
          is_sent?: boolean;
          created_at?: string;
        };
      };
      ai_summaries: {
        Row: {
          id: string;
          thread_id: string;
          summary_type: string;
          content: string;
          suggested_actions: Json;
          confidence_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          summary_type?: string;
          content: string;
          suggested_actions?: Json;
          confidence_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          summary_type?: string;
          content?: string;
          suggested_actions?: Json;
          confidence_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      approvals: {
        Row: {
          id: string;
          thread_id: string;
          approver_email: string;
          approver_name: string;
          approval_type: string;
          status: string;
          due_date: string | null;
          created_at: string;
          responded_at: string | null;
        };
        Insert: {
          id?: string;
          thread_id: string;
          approver_email: string;
          approver_name: string;
          approval_type: string;
          status?: string;
          due_date?: string | null;
          created_at?: string;
          responded_at?: string | null;
        };
        Update: {
          id?: string;
          thread_id?: string;
          approver_email?: string;
          approver_name?: string;
          approval_type?: string;
          status?: string;
          due_date?: string | null;
          created_at?: string;
          responded_at?: string | null;
        };
      };
      documents: {
        Row: {
          id: string;
          thread_id: string;
          document_name: string;
          document_type: string;
          status: string;
          required: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          document_name: string;
          document_type: string;
          status?: string;
          required?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          document_name?: string;
          document_type?: string;
          status?: string;
          required?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
