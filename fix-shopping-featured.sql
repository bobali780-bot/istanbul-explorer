-- Fix shopping items to have proper editor's picks vs regular activities
-- Run this in Supabase SQL Editor

-- Keep 2 items as editor's picks (is_featured: true)
-- Set 2 items as regular activities (is_featured: false)

-- Keep Zorlu Center and Forum Istanbul as editor's picks
UPDATE shopping SET is_featured = true WHERE name = 'Zorlu Center';
UPDATE shopping SET is_featured = true WHERE name = 'Forum Istanbul';

-- Set Kanyon Shopping Mall and İstanbul Cevahir Shopping Mall as regular activities
UPDATE shopping SET is_featured = false WHERE name = 'Kanyon Shopping Mall';
UPDATE shopping SET is_featured = false WHERE name = 'İstanbul Cevahir Shopping Mall';

-- Verify the changes
SELECT name, is_featured FROM shopping ORDER BY name;

