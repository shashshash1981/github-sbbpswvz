/*
  # Customer and Trip Cost Database Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `address` (text)
      - `phone` (text, required)
      - `pickup_address` (text, required)
      - `dropoff_address` (text, required)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `meet_greet_details`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `airline_flight` (text)
      - `arrival_time` (time)
      - `passenger_count` (integer)
      - `luggage_count` (integer)
      - `special_notes` (text)

    - `trip_costs`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `cost_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  address text,
  phone text NOT NULL,
  pickup_address text NOT NULL,
  dropoff_address text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create meet_greet_details table
CREATE TABLE IF NOT EXISTS meet_greet_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  airline_flight text,
  arrival_time time,
  passenger_count integer DEFAULT 1,
  luggage_count integer DEFAULT 0,
  special_notes text,
  created_at timestamptz DEFAULT now()
);

-- Create trip_costs table
CREATE TABLE IF NOT EXISTS trip_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  cost_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE meet_greet_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_costs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (true);

-- Similar policies for meet_greet_details
CREATE POLICY "Users can read all meet_greet_details"
  ON meet_greet_details
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert meet_greet_details"
  ON meet_greet_details
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update meet_greet_details"
  ON meet_greet_details
  FOR UPDATE
  TO authenticated
  USING (true);

-- Similar policies for trip_costs
CREATE POLICY "Users can read all trip_costs"
  ON trip_costs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert trip_costs"
  ON trip_costs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update trip_costs"
  ON trip_costs
  FOR UPDATE
  TO authenticated
  USING (true);