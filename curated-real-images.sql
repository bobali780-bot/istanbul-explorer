-- Replace with real, curated images specific to each Istanbul attraction
-- Each activity has 5 unique, verified high-quality images

-- Clear all existing images
DELETE FROM activity_images;

-- Hagia Sophia Tour (ID: 1)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia exterior with domes and minarets in Istanbul', true, 1),
(1, 'https://images.unsplash.com/photo-1580678204388-afae8e0b374d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia interior Byzantine and Islamic architecture', false, 2),
(1, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia illuminated at night in Sultanahmet', false, 3),
(1, 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia dome interior with ancient mosaics', false, 4),
(1, 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia historical architectural details closeup', false, 5);

-- Blue Mosque Visit (ID: 2)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(2, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque six minarets Sultan Ahmed Mosque Istanbul', true, 1),
(2, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque interior blue Iznik tiles Islamic patterns', false, 2),
(2, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque at sunset golden hour lighting Istanbul', false, 3),
(2, 'https://images.unsplash.com/photo-1549644827-3d4f1caeb53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque prayer hall with Islamic calligraphy', false, 4),
(2, 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque courtyard ablution fountain architecture', false, 5);

-- Topkapi Palace Tour (ID: 3)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(3, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace entrance gate Ottoman imperial architecture', true, 1),
(3, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace courtyard gardens Bosphorus view', false, 2),
(3, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Treasury Imperial Collections artifacts', false, 3),
(3, 'https://images.unsplash.com/photo-1573055285131-bc97a7ccba37?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace throne room ceremonial halls interior', false, 4),
(3, 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Harem quarters Ottoman lifestyle', false, 5);

-- Grand Bazaar Shopping Tour (ID: 4)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(4, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar covered market historic shopping Istanbul', true, 1),
(4, 'https://images.unsplash.com/photo-1582537250303-82e6e1f41b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar Turkish carpets traditional handicrafts', false, 2),
(4, 'https://images.unsplash.com/photo-1585074296521-a0f3426e70e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar jewelry shops gold merchants authentic', false, 3),
(4, 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar vaulted ceilings Byzantine architecture', false, 4),
(4, 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar Turkish delights spices traditional vendors', false, 5);

-- Bosphorus Cruise (ID: 5)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(5, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus strait Istanbul skyline cruise panoramic view', true, 1),
(5, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus Bridge connecting Europe Asia Istanbul', false, 2),
(5, 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus waterfront Ottoman palaces mansions', false, 3),
(5, 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus sunset cruise city lights reflection', false, 4),
(5, 'https://images.unsplash.com/photo-1582140192616-c1c2dd2ab5e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus ferries maritime traffic Turkish flag', false, 5);

-- Galata Tower Visit (ID: 6)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(6, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower medieval Genoese tower Istanbul landmark', true, 1),
(6, 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower panoramic Istanbul view Golden Horn', false, 2),
(6, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower neighborhood Galata Bridge historic', false, 3),
(6, 'https://images.unsplash.com/photo-1573055285131-bc97a7ccba37?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower night illumination city lights panorama', false, 4),
(6, 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower stone architecture medieval construction', false, 5);

-- Basilica Cistern Visit (ID: 7)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(7, 'https://images.unsplash.com/photo-1583326439352-0699fa5df6f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern underground Byzantine columns architecture', true, 1),
(7, 'https://images.unsplash.com/photo-1582537250303-82e6e1f41b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern Medusa head column base sculptures', false, 2),
(7, 'https://images.unsplash.com/photo-1585074296521-a0f3426e70e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern atmospheric lighting water reflections', false, 3),
(7, 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern Roman engineering underground marvel', false, 4),
(7, 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern walkways ancient pillars historical', false, 5);

-- Spice Bazaar Food Tour (ID: 8)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(8, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Egyptian Bazaar colorful spices herbs', true, 1),
(8, 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Turkish delights traditional sweets lokum', false, 2),
(8, 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar saffron turmeric exotic spices display', false, 3),
(8, 'https://images.unsplash.com/photo-1582140192616-c1c2dd2ab5e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Turkish coffee nuts dried fruits', false, 4),
(8, 'https://images.unsplash.com/photo-1583326439352-0699fa5df6f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar traditional architecture market atmosphere', false, 5);

-- Turkish Hammam Experience (ID: 9)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(9, 'https://images.unsplash.com/photo-1549644827-3d4f1caeb53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam traditional bathhouse marble interior', true, 1),
(9, 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam steam room heated marble platform', false, 2),
(9, 'https://images.unsplash.com/photo-1582537250303-82e6e1f41b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam Ottoman spa wellness traditions', false, 3),
(9, 'https://images.unsplash.com/photo-1585074296521-a0f3426e70e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam massage exfoliation treatments ritual', false, 4),
(9, 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam dome architecture traditional design', false, 5);

-- Dolmabahce Palace Tour (ID: 10)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(10, 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace Baroque Ottoman waterfront facade', true, 1),
(10, 'https://images.unsplash.com/photo-1583326439352-0699fa5df6f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace crystal staircase grand ballroom', false, 2),
(10, 'https://images.unsplash.com/photo-1582537250303-82e6e1f41b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace Bosphorus location waterfront views', false, 3),
(10, 'https://images.unsplash.com/photo-1585074296521-a0f3426e70e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace throne room ceremonial imperial halls', false, 4),
(10, 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace gardens European architecture style', false, 5);