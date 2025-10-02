-- Direct fix for shopping items
-- Run this in Supabase SQL Editor

-- First, let's see the current state
SELECT name, is_featured FROM shopping ORDER BY name;

-- Now update the items
UPDATE shopping SET is_featured = false WHERE name = 'Kanyon Shopping Mall';
UPDATE shopping SET is_featured = false WHERE name = 'İstanbul Cevahir Shopping Mall';

-- Verify the changes
SELECT name, is_featured FROM shopping ORDER BY name;

