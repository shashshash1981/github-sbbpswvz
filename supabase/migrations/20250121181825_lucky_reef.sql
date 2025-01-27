/*
  # Add trip details table and update customer schema

  1. New Tables
    - `trip_details`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `pickup_date` (date)
      - `pickup_time` (time)
      - `pickup_location` (text)
      - `dropoff_location` (text)
      - `passenger_count` (integer)
      - `special_notes` (text)
      - `created_at` (timestamptz)

  2. Changes to customers table
    - Add new address fields
    - Split name into first and last name

  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create trip_details table
CREATE TABLE IF NOT EXISTS trip_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  pickup_date date NOT NULL,
  pickup_time time NOT NULL,
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  passenger_count integer DEFAULT 1,
  special_notes text,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to customers table
DO $$ 
BEGIN
  -- Add new address fields if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'address_line1'
  ) THEN
    ALTER TABLE customers 
    ADD COLUMN address_line1 text,
    ADD COLUMN address_line2 text,
    ADD COLUMN city text,
    ADD COLUMN province text,
    ADD COLUMN country text,
    ADD COLUMN postal_code text;
  END IF;

  -- Add first_name and last_name if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE customers 
    ADD COLUMN first_name text,
    ADD COLUMN last_name text;
  END IF;
END $$;

-- Enable RLS on trip_details
ALTER TABLE trip_details ENABLE ROW LEVEL SECURITY;

-- Create policies for trip_details
CREATE POLICY "Users can read all trip_details"
  ON trip_details
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert trip_details"
  ON trip_details
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update trip_details"
  ON trip_details
  FOR UPDATE
  TO authenticated
  USING (true);