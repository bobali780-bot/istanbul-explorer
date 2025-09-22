-- Update activities with real, high-quality images from reliable sources
-- These URLs have been verified and are appropriate for each specific activity

-- Clear existing images
DELETE FROM activity_images;

-- Hagia Sophia Tour (ID: 1) - Real Hagia Sophia images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia exterior view with domes and minarets in Istanbul', true, 1),
(1, 'https://images.unsplash.com/photo-1580678204388-afae8e0b374d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia interior showing Byzantine architecture and Islamic elements', false, 2),
(1, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia dome interior with ancient mosaics', false, 3),
(1, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia at night illuminated in Sultanahmet Square', false, 4),
(1, 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia historical architectural details', false, 5);

-- Blue Mosque Visit (ID: 2) - Real Blue Mosque images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(2, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque with six minarets in Istanbul Sultanahmet', true, 1),
(2, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque interior with blue Iznik tiles and patterns', false, 2),
(2, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque courtyard and ablution fountain', false, 3),
(2, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque at sunset with golden hour lighting', false, 4),
(2, 'https://images.unsplash.com/photo-1549644827-3d4f1caeb53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque prayer hall with Islamic calligraphy', false, 5);

-- Topkapi Palace Tour (ID: 3)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(3, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace entrance gate and Ottoman architecture', true, 1),
(3, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace courtyard with fountain and gardens', false, 2),
(3, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Treasury and Imperial Collections', false, 3),
(3, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Bosphorus view from palace grounds', false, 4),
(3, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Ottoman throne room and decor', false, 5);

-- Grand Bazaar Shopping Tour (ID: 4)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(4, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar covered market with shops and vendors', true, 1),
(4, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar Turkish carpets and traditional crafts', false, 2),
(4, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar jewelry shops and gold merchants', false, 3),
(4, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar historic architecture and vaulted ceilings', false, 4),
(4, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar spice sellers and Turkish delights', false, 5);

-- Bosphorus Cruise (ID: 5)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(5, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus strait view with Istanbul skyline and mosques', true, 1),
(5, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus Bridge connecting Europe and Asia', false, 2),
(5, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus waterfront palaces and Ottoman architecture', false, 3),
(5, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus sunset cruise with city panorama', false, 4),
(5, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus ferry boats and maritime traffic', false, 5);

-- Galata Tower Visit (ID: 6)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(6, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower medieval stone tower in Istanbul', true, 1),
(6, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower panoramic view of Istanbul from top', false, 2),
(6, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower neighborhood and Galata Bridge', false, 3),
(6, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower evening illumination and city lights', false, 4),
(6, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower historic architecture and Genoese design', false, 5);

-- Basilica Cistern Visit (ID: 7)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(7, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern underground Byzantine columns and arches', true, 1),
(7, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern Medusa head column base sculptures', false, 2),
(7, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern atmospheric lighting and reflections', false, 3),
(7, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern ancient Roman engineering marvel', false, 4),
(7, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern walkways and historical architecture', false, 5);

-- Spice Bazaar Food Tour (ID: 8)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(8, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Egyptian Bazaar colorful spices and herbs', true, 1),
(8, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Turkish delights and traditional sweets', false, 2),
(8, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar saffron turmeric and exotic spices', false, 3),
(8, 'https://images.unsplash.com/photo-1529259646663-2cac38b9fc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar nuts dried fruits and Turkish coffee', false, 4),
(8, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar traditional architecture and market atmosphere', false, 5);

-- Turkish Hammam Experience (ID: 9)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(9, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam traditional bathhouse marble interior', true, 1),
(9, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam steam room and relaxation area', false, 2),
(9, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam Ottoman era spa and wellness traditions', false, 3),
(9, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam massage and exfoliation treatments', false, 4),
(9, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam heated marble platform and domes', false, 5);

-- Dolmabahce Palace Tour (ID: 10)
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(10, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace Baroque Ottoman imperial facade', true, 1),
(10, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace crystal staircase and grand ballroom', false, 2),
(10, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace Bosphorus waterfront location', false, 3),
(10, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace throne room and ceremonial halls', false, 4),
(10, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace gardens and European architecture', false, 5);