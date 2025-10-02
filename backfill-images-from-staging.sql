-- First, check which published items have fewer than 10 images
WITH published_image_counts AS (
  SELECT 
    a.id,
    a.name,
    a.slug,
    'activity' as entity_type,
    'activities' as source_table,
    COUNT(um.id) as current_image_count
  FROM activities a
  LEFT JOIN universal_media um ON um.entity_id = a.id AND um.entity_type = 'activity'
  GROUP BY a.id, a.name, a.slug
  
  UNION ALL
  
  SELECT 
    h.id,
    h.name,
    h.slug,
    'hotel' as entity_type,
    'hotels' as source_table,
    COUNT(um.id) as current_image_count
  FROM hotels h
  LEFT JOIN universal_media um ON um.entity_id = h.id AND um.entity_type = 'hotel'
  GROUP BY h.id, h.name, h.slug
  
  UNION ALL
  
  SELECT 
    s.id,
    s.name,
    s.slug,
    'shop' as entity_type,
    'shopping' as source_table,
    COUNT(um.id) as current_image_count
  FROM shopping s
  LEFT JOIN universal_media um ON um.entity_id = s.id AND um.entity_type = 'shop'
  GROUP BY s.id, s.name, s.slug
  
  UNION ALL
  
  SELECT 
    r.id,
    r.name,
    r.slug,
    'restaurant' as entity_type,
    'restaurants' as source_table,
    COUNT(um.id) as current_image_count
  FROM restaurants r
  LEFT JOIN universal_media um ON um.entity_id = r.id AND um.entity_type = 'restaurant'
  GROUP BY r.id, r.name, r.slug
)
SELECT 
  pic.*,
  sq.title as staging_title,
  jsonb_array_length(sq.images) as staging_image_count
FROM published_image_counts pic
LEFT JOIN staging_queue sq ON LOWER(pic.name) = LOWER(sq.title) AND sq.status = 'published'
WHERE pic.current_image_count < 10
ORDER BY pic.current_image_count ASC;
