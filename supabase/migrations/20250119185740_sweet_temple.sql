/*
  # Add affiliates table and relationships

  1. New Tables
    - `affiliates`
      - `id` (uuid, primary key)
      - `name` (text, company/affiliate name)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `affiliates` table
    - Add policies for authenticated users
*/

-- Create affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all affiliates"
  ON affiliates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert affiliates"
  ON affiliates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update affiliates"
  ON affiliates
  FOR UPDATE
  TO authenticated
  USING (true);