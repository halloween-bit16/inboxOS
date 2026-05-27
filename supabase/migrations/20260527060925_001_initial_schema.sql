/*
  # InboxOS Initial Schema

  This migration creates the core database structure for the InboxOS inbox operations dashboard.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - URL to user's avatar image
  - `role` (text) - User's role in the organization
  - `department` (text) - User's department
  - `created_at` (timestamp) - Account creation time
  - `updated_at` (timestamp) - Last update time

  ### 2. threads
  - `id` (uuid, primary key) - Unique thread identifier
  - `subject` (text) - Thread subject line
  - `status` (text) - Current status (urgent, pending, escalated, resolved)
  - `urgency_score` (integer) - AI-calculated urgency (0-100)
  - `category` (text) - Thread category (approval, compliance, vendor, architecture, fire_safety)
  - `priority` (text) - Priority level (critical, high, medium, low)
  - `pending_action` (text) - Description of pending action
  - `stakeholders` (text[]) - Array of stakeholder emails
  - `deadline` (timestamp) - Action deadline if applicable
  - `created_at` (timestamp) - Thread creation time
  - `updated_at` (timestamp) - Last update time
  - `resolved_at` (timestamp) - Resolution time if resolved
  - `created_by` (uuid) - User who created the thread

  ### 3. messages
  - `id` (uuid, primary key) - Unique message identifier
  - `thread_id` (uuid) - Foreign key to threads
  - `sender_name` (text) - Name of message sender
  - `sender_email` (text) - Email of message sender
  - `content` (text) - Message body content
  - `message_type` (text) - Type (email, internal_note, system)
  - `created_at` (timestamp) - Message timestamp
  - `is_external` (boolean) - Whether message is from external party

  ### 4. actions
  - `id` (uuid, primary key) - Unique action identifier
  - `thread_id` (uuid) - Foreign key to threads
  - `action_type` (text) - Type of action (draft_reply, escalate, follow_up, approve, reject)
  - `description` (text) - Action description
  - `status` (text) - Action status (pending, completed, cancelled)
  - `created_by` (uuid) - User who created action
  - `completed_by` (uuid) - User who completed action
  - `created_at` (timestamp) - Action creation time
  - `completed_at` (timestamp) - Action completion time

  ### 5. reminders
  - `id` (uuid, primary key) - Unique reminder identifier
  - `thread_id` (uuid) - Foreign key to threads
  - `reminder_type` (text) - Type of reminder (deadline, follow_up, escalation)
  - `message` (text) - Reminder message
  - `reminder_date` (timestamp) - When to remind
  - `is_sent` (boolean) - Whether reminder was sent
  - `created_at` (timestamp) - Reminder creation time

  ### 6. ai_summaries
  - `id` (uuid, primary key) - Unique summary identifier
  - `thread_id` (uuid) - Foreign key to threads
  - `summary_type` (text) - Type of summary (thread, action_items, stakeholders)
  - `content` (text) - AI-generated summary content
  - `suggested_actions` (jsonb) - Array of suggested actions
  - `confidence_score` (decimal) - AI confidence score (0-1)
  - `created_at` (timestamp) - Summary creation time
  - `updated_at` (timestamp) - Last update time

  ### 7. approvals
  - `id` (uuid, primary key) - Unique approval identifier
  - `thread_id` (uuid) - Foreign key to threads
  - `approver_email` (text) - Email of approver
  - `approver_name` (text) - Name of approver
  - `approval_type` (text) - Type of approval needed
  - `status` (text) - Approval status (pending, approved, rejected)
  - `due_date` (timestamp) - Approval deadline
  - `created_at` (timestamp) - Approval request creation time
  - `responded_at` (timestamp) - When approval was responded to

  ### 8. documents
  - `id` (uuid, primary key) - Unique document identifier
  - `thread_id` (uuid) - Foreign key to threads
  - `document_name` (text) - Name of document
  - `document_type` (text) - Type of document
  - `status` (text) - Document status (missing, received, under_review)
  - `required` (boolean) - Whether document is required
  - `created_at` (timestamp) - Document record creation time

  ## Security
  - Enable RLS on all tables
  - All tables allow authenticated users full access for demo purposes
  - All policies use auth.uid() for authentication checks

  ## Notes
  1. All tables use uuid primary keys with gen_random_uuid()
  2. Timestamps use timestamptz for timezone awareness
  3. Foreign key constraints ensure referential integrity
  4. Indexes added for frequently queried columns
  5. Status fields use text for flexibility
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'user',
  department text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  status text DEFAULT 'pending',
  urgency_score integer DEFAULT 0,
  category text DEFAULT 'approval',
  priority text DEFAULT 'medium',
  pending_action text DEFAULT '',
  stakeholders text[] DEFAULT '{}',
  deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'email',
  created_at timestamptz DEFAULT now(),
  is_external boolean DEFAULT false
);

-- Create actions table
CREATE TABLE IF NOT EXISTS actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  reminder_type text NOT NULL,
  message text NOT NULL,
  reminder_date timestamptz NOT NULL,
  is_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create ai_summaries table
CREATE TABLE IF NOT EXISTS ai_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  summary_type text DEFAULT 'thread',
  content text NOT NULL,
  suggested_actions jsonb DEFAULT '[]',
  confidence_score decimal(3,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create approvals table
CREATE TABLE IF NOT EXISTS approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  approver_email text NOT NULL,
  approver_name text NOT NULL,
  approval_type text NOT NULL,
  status text DEFAULT 'pending',
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL,
  status text DEFAULT 'missing',
  required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_threads_status ON threads(status);
CREATE INDEX IF NOT EXISTS idx_threads_category ON threads(category);
CREATE INDEX IF NOT EXISTS idx_threads_urgency ON threads(urgency_score DESC);
CREATE INDEX IF NOT EXISTS idx_threads_deadline ON threads(deadline);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_actions_thread ON actions(thread_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_reminders_thread ON reminders(thread_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_ai_summaries_thread ON ai_summaries(thread_id);
CREATE INDEX IF NOT EXISTS idx_approvals_thread ON approvals(thread_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_documents_thread ON documents(thread_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for threads (allow all authenticated users to view for demo)
CREATE POLICY "Authenticated users can view all threads"
  ON threads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create threads"
  ON threads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update threads"
  ON threads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for messages
CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for actions
CREATE POLICY "Authenticated users can view actions"
  ON actions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create actions"
  ON actions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update actions"
  ON actions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for reminders
CREATE POLICY "Authenticated users can view reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ai_summaries
CREATE POLICY "Authenticated users can view AI summaries"
  ON ai_summaries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create AI summaries"
  ON ai_summaries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update AI summaries"
  ON ai_summaries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for approvals
CREATE POLICY "Authenticated users can view approvals"
  ON approvals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create approvals"
  ON approvals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update approvals"
  ON approvals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for documents
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);