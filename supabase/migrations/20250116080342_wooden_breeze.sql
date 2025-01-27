/*
  # Fix customer table columns

  1. Changes
    - Rename columns to match application code
    - Add missing columns
    - Ensure consistent naming convention

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Rename columns if they exist with different names
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'pickup_address'
  ) THEN
    ALTER TABLE customers RENAME COLUMN pickup_address TO pickupaddress;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'dropoff_address'
  ) THEN
    ALTER TABLE customers RENAME COLUMN dropoff_address TO dropoffaddress;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE customers RENAME COLUMN full_name TO fullname;
  END IF;

  -- Add columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'pickupaddress'
  ) THEN
    ALTER TABLE customers ADD COLUMN pickupaddress text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'dropoffaddress'
  ) THEN
    ALTER TABLE customers ADD COLUMN dropoffaddress text NOT NULL DEFAULT '';
  END IF;
END $$;