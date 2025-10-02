-- Clear all main category tables for fresh affiliate-quality content
-- Run this in Supabase SQL Editor

-- Clear activities table
DELETE FROM activities;

-- Clear hotels table  
DELETE FROM hotels;

-- Clear shopping table
DELETE FROM shopping;

-- Clear restaurants table
DELETE FROM restaurants;

-- Clear universal_media entries for these categories
DELETE FROM universal_media 
WHERE entity_type IN ('activities', 'hotels', 'shopping', 'restaurants');

-- Reset auto-increment sequences to start fresh
ALTER SEQUENCE activities_id_seq RESTART WITH 1;
ALTER SEQUENCE hotels_id_seq RESTART WITH 1;
ALTER SEQUENCE shopping_id_seq RESTART WITH 1;
ALTER SEQUENCE restaurants_id_seq RESTART WITH 1;
ALTER SEQUENCE universal_media_id_seq RESTART WITH 1;

-- Verify all tables are empty
SELECT 'activities' as table_name, COUNT(*) as count FROM activities
UNION ALL
SELECT 'hotels' as table_name, COUNT(*) as count FROM hotels  
UNION ALL
SELECT 'shopping' as table_name, COUNT(*) as count FROM shopping
UNION ALL
SELECT 'restaurants' as table_name, COUNT(*) as count FROM restaurants
UNION ALL
SELECT 'universal_media' as table_name, COUNT(*) as count FROM universal_media;
