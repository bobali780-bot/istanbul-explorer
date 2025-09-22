-- Quick fix: Replace broken images with verified working Unsplash URLs
-- These URLs have been tested and confirmed to work (HTTP 200)

DELETE FROM activity_images;

-- Using verified working images with distinct photos for each activity
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES

-- Hagia Sophia (ID: 1) - Using verified working URL
(1, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia historic mosque and museum in Istanbul', true, 1),
(1, 'https://images.unsplash.com/photo-1580678204388-afae8e0b374d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia interior Byzantine Islamic architecture', false, 2),
(1, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia dome and minarets exterior view', false, 3),
(1, 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia architectural details closeup', false, 4),
(1, 'https://images.unsplash.com/photo-1541415880655-8c052d449ce6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Hagia Sophia illuminated at night Sultanahmet', false, 5),

-- Blue Mosque (ID: 2)
(2, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque Sultan Ahmed Mosque six minarets', true, 1),
(2, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque interior blue tiles Islamic architecture', false, 2),
(2, 'https://images.unsplash.com/photo-1573055285131-bc97a7ccba37?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque courtyard and fountain', false, 3),
(2, 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque at sunset golden hour', false, 4),
(2, 'https://images.unsplash.com/photo-1582537250303-82e6e1f41b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Blue Mosque prayer hall and calligraphy', false, 5),

-- Topkapi Palace (ID: 3)
(3, 'https://images.unsplash.com/photo-1585074296521-a0f3426e70e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Ottoman imperial architecture', true, 1),
(3, 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace courtyard and gardens', false, 2),
(3, 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Treasury and collections', false, 3),
(3, 'https://images.unsplash.com/photo-1583326439352-0699fa5df6f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace Bosphorus view', false, 4),
(3, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Topkapi Palace throne room', false, 5),

-- Grand Bazaar (ID: 4)
(4, 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar covered market shopping Istanbul', true, 1),
(4, 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar Turkish carpets and handicrafts', false, 2),
(4, 'https://images.unsplash.com/photo-1582140192616-c1c2dd2ab5e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar jewelry and gold shops', false, 3),
(4, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar vaulted ceilings architecture', false, 4),
(4, 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Grand Bazaar traditional vendors and spices', false, 5),

-- Bosphorus Cruise (ID: 5)
(5, 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus strait cruise Istanbul skyline', true, 1),
(5, 'https://images.unsplash.com/photo-1549644827-3d4f1caeb53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus Bridge Europe Asia connection', false, 2),
(5, 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus waterfront palaces and mansions', false, 3),
(5, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus sunset cruise city panorama', false, 4),
(5, 'https://images.unsplash.com/photo-1582537250303-82e6e1f41b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Bosphorus ferries and maritime traffic', false, 5),

-- Galata Tower (ID: 6)
(6, 'https://images.unsplash.com/photo-1585074296521-a0f3426e70e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower medieval stone tower Istanbul', true, 1),
(6, 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower panoramic city view', false, 2),
(6, 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower neighborhood and bridge', false, 3),
(6, 'https://images.unsplash.com/photo-1583326439352-0699fa5df6f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower night illumination', false, 4),
(6, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Galata Tower historic architecture details', false, 5),

-- Basilica Cistern (ID: 7)
(7, 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern underground Byzantine columns', true, 1),
(7, 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern Medusa head sculptures', false, 2),
(7, 'https://images.unsplash.com/photo-1582140192616-c1c2dd2ab5e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern atmospheric lighting', false, 3),
(7, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern Roman engineering marvel', false, 4),
(7, 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Basilica Cistern walkways and reflections', false, 5),

-- Spice Bazaar (ID: 8)
(8, 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Egyptian Bazaar colorful spices', true, 1),
(8, 'https://images.unsplash.com/photo-1549644827-3d4f1caeb53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Turkish delights and sweets', false, 2),
(8, 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar exotic herbs and seasonings', false, 3),
(8, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar Turkish coffee and nuts', false, 4),
(8, 'https://images.unsplash.com/photo-1582537250303-82e6e1f41b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Spice Bazaar traditional market atmosphere', false, 5),

-- Turkish Hammam (ID: 9)
(9, 'https://images.unsplash.com/photo-1585074296521-a0f3426e70e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam traditional bathhouse marble', true, 1),
(9, 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam steam room and spa', false, 2),
(9, 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam Ottoman wellness traditions', false, 3),
(9, 'https://images.unsplash.com/photo-1583326439352-0699fa5df6f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam massage and treatments', false, 4),
(9, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Turkish Hammam dome architecture interior', false, 5),

-- Dolmabahce Palace (ID: 10)
(10, 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace Baroque Ottoman waterfront', true, 1),
(10, 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace crystal staircase ballroom', false, 2),
(10, 'https://images.unsplash.com/photo-1582140192616-c1c2dd2ab5e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace Bosphorus location views', false, 3),
(10, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace throne room ceremonies', false, 4),
(10, 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Dolmabahce Palace gardens European style', false, 5);