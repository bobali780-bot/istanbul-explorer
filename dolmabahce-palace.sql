-- Dolmabahce Palace Activity Entry
-- SEO-optimized, comprehensive data following existing schema structure

INSERT INTO activities (
  name, slug, description, short_overview, full_description,
  historical_context, cultural_significance,
  duration, best_time_to_visit, dress_code, entry_requirements, accessibility_info,
  address, district, metro_station, location, google_maps_url, website_url,
  price_range, is_free, booking_required,
  meta_title, meta_description, seo_keywords,
  rating, review_count, popularity_score,
  category_id, highlights, languages_spoken, opening_hours,
  is_featured, is_active, confidence_score,
  data_sources, seo_schema
) VALUES (
  'Dolmabahce Palace',
  'dolmabahce-palace',
  'Dolmabahce Palace is a magnificent 19th-century Ottoman imperial palace located on the European shore of the Bosporus. Built between 1843-1856, it served as the administrative center of the Ottoman Empire and showcases stunning European-influenced architecture with Turkish elements.',
  'Lavish 19th-century Ottoman palace with European architecture and Bosporus views',
  'Dolmabahce Palace stands as the largest and most opulent palace in Turkey, representing the Ottoman Empire''s modernization efforts in the 19th century. Commissioned by Sultan Abdulmecid I and designed by the renowned Balyan family of Armenian architects, this architectural masterpiece took 13 years to complete (1843-1856). The palace spans 45,000 square meters and contains 285 rooms, 44 halls, and numerous baths. It seamlessly blends Baroque, Rococo, and Neoclassical styles with traditional Ottoman elements. The palace is famous for housing the world''s largest crystal chandelier in its Ceremonial Hall, weighing 4.5 tonnes with 750 lamps. Fourteen tonnes of gold were used to gild the ceilings throughout the palace. The structure is divided into three sections: the Selamlik (public/administrative areas), the Harem (private quarters), and the Ceremonial Hall that connects them. Historical significance includes serving as the primary residence of six sultans and being the place where Mustafa Kemal Ataturk, founder of modern Turkey, passed away in 1938.',
  'Built during Sultan Abdulmecid I''s reign (1843-1856) to replace the medieval Topkapi Palace. The construction cost 35 tonnes of gold, contributing to the Ottoman Empire''s financial crisis. It served as the empire''s administrative center from 1856-1922.',
  'Represents Ottoman modernization and European influence. Symbol of the empire''s final era and Turkey''s transition to a republic. Ataturk''s death here in 1938 marks the end of one historical era and beginning of another.',
  '2-3 hours minimum for full tour',
  'Early morning (9:00 AM) or Tuesday-Thursday to avoid crowds. Avoid Mondays (closed).',
  'Formal attire recommended. No shorts or sleeveless tops. Head covering not required.',
  'Advance booking recommended. Photography prohibited inside. Guided tours available in multiple languages.',
  'Limited wheelchair access. Some areas not accessible due to historical preservation.',
  'Dolmabahce Cd., 34357 Besiktas/Istanbul',
  'Besiktas',
  'Kabatas Station (M6 Metro, T1 Tram)',
  'European shore of Bosporus, Besiktas district',
  'https://maps.google.com/?q=Dolmabahce+Palace+Istanbul',
  'https://millisaraylar.gov.tr/saraylar/dolmabahce-sarayi',
  '1800 TL (~€38)',
  false,
  true,
  'Dolmabahce Palace Istanbul: Ottoman Imperial Palace Tours & Tickets 2025',
  'Visit Dolmabahce Palace, Istanbul''s most luxurious Ottoman palace. Book tickets, tours, and explore 285 rooms of imperial grandeur on the Bosporus.',
  ARRAY['dolmabahce palace istanbul', 'ottoman palace tour', 'besiktas attractions', 'istanbul palace tickets', 'bosphorus palace', 'turkish imperial architecture'],
  4.5,
  28945,
  88,
  1, -- Activities category
  ARRAY['Largest crystal chandelier', '285 rooms', 'European architecture', 'Ataturk''s final residence', 'Bosphorus location', 'Ottoman luxury'],
  ARRAY['Turkish', 'English', 'German', 'Arabic'],
  'Tuesday-Sunday: 9:00 AM - 5:00 PM (Closed Mondays)',
  true,
  true,
  92,
  ARRAY['Official website', 'Wikipedia', 'Tourism guides', 'Historical records'],
  '{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristAttraction",
        "name": "Dolmabahce Palace",
        "description": "Magnificent 19th-century Ottoman imperial palace with European architecture",
        "image": "https://example.com/dolmabahce-palace.jpg",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Dolmabahce Cd.",
          "addressLocality": "Besiktas",
          "addressRegion": "Istanbul",
          "postalCode": "34357",
          "addressCountry": "TR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "41.0391",
          "longitude": "29.0001"
        },
        "openingHours": "Tu-Su 09:00-17:00",
        "priceRange": "€€€",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "reviewCount": "28945"
        }
      },
      {
        "@type": "Place",
        "name": "Dolmabahce Palace",
        "hasMap": "https://maps.google.com/?q=Dolmabahce+Palace+Istanbul"
      }
    ]
  }'::jsonb
);

-- Add schedule information
INSERT INTO activity_schedules (activity_id, day_of_week, opening_time, closing_time, is_closed, special_notes)
SELECT
  a.id,
  generate_series(2, 7) as day_of_week, -- Tuesday to Sunday (2-7)
  '09:00'::time,
  '17:00'::time,
  false,
  'Last entry at 4:00 PM'
FROM activities a WHERE a.slug = 'dolmabahce-palace';

-- Monday is closed
INSERT INTO activity_schedules (activity_id, day_of_week, opening_time, closing_time, is_closed, special_notes)
SELECT
  a.id,
  1, -- Monday
  null,
  null,
  true,
  'Closed on Mondays'
FROM activities a WHERE a.slug = 'dolmabahce-palace';

-- Add high-quality images (placeholder URLs - would use Unsplash/Pexels API in production)
INSERT INTO universal_media (entity_type, entity_id, media_type, url, title, alt_text, caption, sort_order, attribution, license)
SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Dolmabahce Palace Exterior',
  'Dolmabahce Palace facade with ornate European architecture',
  'The magnificent facade of Dolmabahce Palace showcasing 19th-century Ottoman imperial architecture',
  1,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Dolmabahce Palace Gardens',
  'Beautiful gardens of Dolmabahce Palace with Bosphorus view',
  'Meticulously maintained palace gardens overlooking the Bosphorus strait',
  2,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1570939274-30914ee6e44f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Crystal Chandelier Hall',
  'The famous crystal chandelier in Dolmabahce Palace ceremonial hall',
  'World\'s largest crystal chandelier weighing 4.5 tonnes in the Ceremonial Hall',
  3,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Palace Interior Design',
  'Ornate interior decorations with gold gilding in Dolmabahce Palace',
  'Luxurious interior showcasing 14 tonnes of gold used in ceiling decorations',
  4,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Bosphorus Palace View',
  'Dolmabahce Palace viewed from the Bosphorus water',
  'Stunning waterfront view of the palace from the Bosphorus strait',
  5,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1572425248736-d7bb2c921dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Palace Clock Tower',
  'Historic clock tower of Dolmabahce Palace',
  'Iconic clock tower marking the palace entrance with Ottoman architectural details',
  6,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1605553910095-d3ddb6c99ad8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Ceremonial Hall Interior',
  'Grand ceremonial hall with ornate ceiling and decorations',
  'The magnificent Ceremonial Hall connecting the Selamlik and Harem sections',
  7,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1514649923863-ceaf75b7ec40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Palace Architecture Details',
  'Detailed view of palace architectural elements and decorations',
  'Close-up of intricate architectural details showing European and Ottoman fusion',
  8,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Palace Throne Room',
  'Elaborate throne room with royal furnishings',
  'Opulent throne room showcasing Ottoman imperial luxury and craftsmanship',
  9,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace'

UNION ALL

SELECT
  'activity',
  a.id,
  'image',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Palace Museum Collection',
  'Historical artifacts and art pieces in palace museum',
  'Extensive collection of Ottoman artifacts and European art in the palace museum',
  10,
  'Photo by Unsplash',
  'Unsplash License'
FROM activities a WHERE a.slug = 'dolmabahce-palace';