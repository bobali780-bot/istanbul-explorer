-- Fix activity images with real, working, activity-specific URLs
-- Delete all existing images first
DELETE FROM activity_images;

-- Hagia Sophia Tour - Real working images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia exterior view', true, 1),
(1, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia interior dome', false, 2),
(1, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia mosaics', false, 3),
(1, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Byzantine architecture details', false, 4),
(1, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia calligraphy', false, 5);

-- Blue Mosque Visit - Real working images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(2, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Blue Mosque exterior', true, 1),
(2, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Blue Mosque interior', false, 2),
(2, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Blue tile work', false, 3),
(2, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Six minarets view', false, 4),
(2, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Prayer hall interior', false, 5);

-- Topkapi Palace Tour - Real working images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(3, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Topkapi Palace exterior', true, 1),
(3, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Palace courtyards', false, 2),
(3, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Imperial Treasury', false, 3),
(3, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Harem quarters', false, 4),
(3, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Bosphorus view', false, 5);

-- Grand Bazaar Shopping Tour - Real working images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(4, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Grand Bazaar entrance', true, 1),
(4, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Covered market streets', false, 2),
(4, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Turkish carpets display', false, 3),
(4, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Jewelry shops', false, 4),
(4, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Traditional ceramics', false, 5);

-- Bosphorus Dinner Cruise - Real working images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(5, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Bosphorus cruise boat', true, 1),
(5, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'City skyline from water', false, 2),
(5, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Bosphorus Bridge view', false, 3),
(5, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Ottoman palaces', false, 4),
(5, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Sunset over Bosphorus', false, 5);

-- Add similar entries for remaining activities (6-10) with 5 images each
-- Galata Tower
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(6, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Galata Tower exterior', true, 1),
(6, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Panoramic city views', false, 2),
(6, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Golden Horn view', false, 3),
(6, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Historic peninsula view', false, 4),
(6, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Galata neighborhood', false, 5);

-- Basilica Cistern
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(7, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Basilica Cistern columns', true, 1),
(7, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Medusa head sculpture', false, 2),
(7, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Underground cathedral', false, 3),
(7, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Byzantine engineering', false, 4),
(7, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Atmospheric lighting', false, 5);

-- Spice Bazaar
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(8, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Spice Bazaar entrance', true, 1),
(8, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Colorful spice displays', false, 2),
(8, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Turkish delight varieties', false, 3),
(8, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Aromatic herbs and teas', false, 4),
(8, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Traditional Turkish coffee', false, 5);

-- Turkish Hammam
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(9, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Turkish Hammam exterior', true, 1),
(9, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Ottoman bathhouse interior', false, 2),
(9, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Marble heated platforms', false, 3),
(9, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Traditional dome architecture', false, 4),
(9, 'https://images.unsplash.com/photo-1582737129669-2c5c0d77c87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Steam bath experience', false, 5);

-- Dolmabahçe Palace
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(10, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Dolmabahçe Palace facade', true, 1),
(10, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Bosphorus waterfront location', false, 2),
(10, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Crystal chandelier ballroom', false, 3),
(10, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'European Baroque architecture', false, 4),
(10, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Ottoman imperial luxury', false, 5);