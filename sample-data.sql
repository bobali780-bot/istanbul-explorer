-- Sample Data for Istanbul Explorer Activities
-- Run this AFTER the schema (supabase-schema.sql)

-- Insert sample activities
INSERT INTO activities (name, slug, description, short_overview, full_description, booking_url, rating, review_count, price_range, duration, opening_hours, location, highlights, trip_advisor_url) VALUES

-- Hagia Sophia
('Hagia Sophia Tour', 'hagia-sophia-tour', 'Explore the Byzantine masterpiece with skip-the-line access and learn its layered history.', 'Explore the Byzantine masterpiece with skip-the-line access and learn its layered history.', 'The Hagia Sophia stands as one of the world''s most extraordinary architectural achievements, seamlessly blending Christian and Islamic heritage. Originally built as a cathedral in 537 AD during the Byzantine Empire, it served as the world''s largest cathedral for nearly 1,000 years before becoming a mosque during Ottoman rule. Today, this UNESCO World Heritage Site showcases stunning mosaics, massive dome architecture, and centuries of cultural transformation.', 'https://www.getyourguide.com/hagia-sophia-l2705/', 4.7, 28947, '$25', '1-2 hours', '9:00 AM - 6:00 PM (varies by season)', 'Sultanahmet Square, Fatih', ARRAY['Skip-the-line entry to avoid crowds', 'Expert guide with historical insights', 'Marvel at 1,500-year-old architecture', 'See Christian mosaics and Islamic calligraphy', 'UNESCO World Heritage Site'], 'https://www.tripadvisor.com/Attraction_Review-g293974-d293976-Reviews-Hagia_Sophia-Istanbul.html'),

-- Blue Mosque
('Blue Mosque Visit', 'blue-mosque-visit', 'Visit the stunning Sultan Ahmet Mosque, renowned for its blue tile work and majestic architecture.', 'Visit the stunning Sultan Ahmet Mosque, renowned for its blue tile work and majestic architecture.', 'The Blue Mosque, officially known as Sultan Ahmet Mosque, represents the pinnacle of Ottoman architecture and Islamic art. Built between 1609-1616, this active mosque features six minarets, a rare architectural feature that initially caused controversy. The interior is adorned with over 20,000 handmade ceramic tiles in various shades of blue, giving the mosque its popular name.', 'https://www.viator.com/Istanbul-attractions/Blue-Mosque-Sultan-Ahmet-Camii/d585-a910', 4.6, 34521, 'Free', '45 minutes - 1 hour', '8:30 AM - 6:00 PM (closed during prayer times)', 'Sultanahmet Square, Fatih', ARRAY['Six magnificent minarets', '20,000+ handmade blue tiles', 'Active mosque with prayer services', 'Free entry for self-guided visits', 'Facing Hagia Sophia across the square'], 'https://www.tripadvisor.com/Attraction_Review-g293974-d293978-Reviews-Blue_Mosque-Istanbul.html'),

-- Topkapi Palace
('Topkapi Palace & Harem Tour', 'topkapi-palace-tour', 'Explore the opulent Ottoman palace with its treasures, courtyards, and famous Harem quarters.', 'Explore the opulent Ottoman palace with its treasures, courtyards, and famous Harem quarters.', 'Topkapi Palace served as the primary residence of Ottoman sultans for over 400 years, from 1465 to 1856. This sprawling palace complex offers visitors a glimpse into the lavish lifestyle of Ottoman royalty. The palace features four main courtyards, each with distinct functions and stunning architecture.', 'https://www.getyourguide.com/topkapi-palace-l3534/', 4.5, 22340, '$50', '2-3 hours', '9:00 AM - 5:00 PM (closed Tuesdays)', 'Sultanahmet, Fatih', ARRAY['Four historic courtyards to explore', 'Imperial Treasury with precious jewels', 'Harem quarters with intricate decorations', 'Panoramic views of Bosphorus', 'Sacred Relics collection'], 'https://www.tripadvisor.com/Attraction_Review-g293974-d293977-Reviews-Topkapi_Palace-Istanbul.html');

-- Insert sample images for each activity
-- You'll need to replace these URLs with actual uploaded images from your Supabase Storage bucket

-- Hagia Sophia images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia exterior view', true, 1),
(1, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia interior dome', false, 2),
(1, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia Islamic calligraphy', false, 3),
(1, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Hagia Sophia mosaics', false, 4);

-- Blue Mosque images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(2, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Blue Mosque exterior', true, 1),
(2, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Blue Mosque interior', false, 2),
(2, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Blue tiles detail', false, 3),
(2, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Blue Mosque minarets', false, 4);

-- Topkapi Palace images
INSERT INTO activity_images (activity_id, image_url, alt_text, is_primary, sort_order) VALUES
(3, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Topkapi Palace exterior', true, 1),
(3, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Palace courtyard', false, 2),
(3, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Harem quarters', false, 3),
(3, 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'Bosphorus view from palace', false, 4);

-- Insert sample reviews
INSERT INTO activity_reviews (activity_id, author, rating, comment, review_date) VALUES
(1, 'Sarah M.', 5, 'Absolutely breathtaking! The history and architecture are incredible. Our guide was very knowledgeable and the skip-the-line access saved us hours.', 'December 2024'),
(1, 'David K.', 5, 'A must-see in Istanbul. The combination of Christian and Islamic art is fascinating. Highly recommend getting a guide.', 'November 2024'),
(1, 'Maria L.', 4, 'Beautiful mosque with incredible history. Can get crowded but worth the visit. The mosaics are stunning.', 'October 2024'),

(2, 'Jennifer R.', 5, 'Stunning architecture and the blue tiles are absolutely gorgeous. Remember to dress modestly and bring shoe covers.', 'December 2024'),
(2, 'Ahmed H.', 4, 'Beautiful mosque, very peaceful inside. Best visited early in the morning to avoid crowds.', 'November 2024'),
(2, 'Elena P.', 5, 'The six minarets are spectacular! Free entry makes this a must-visit. The interior is breathtaking.', 'October 2024'),

(3, 'Robert T.', 5, 'Incredible palace with so much history. The Harem tour is definitely worth the extra cost. Amazing views!', 'December 2024'),
(3, 'Lisa M.', 4, 'Beautiful palace grounds and fascinating exhibits. Can be crowded but the audio guide helps navigate efficiently.', 'November 2024'),
(3, 'Carlos S.', 5, 'The treasury room is absolutely stunning. Don''t miss the Harem - it''s beautifully preserved.', 'October 2024');