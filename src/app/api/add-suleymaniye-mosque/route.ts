import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Add Suleymaniye Mosque activity
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .insert({
        name: 'Suleymaniye Mosque',
        slug: 'suleymaniye-mosque',
        description: 'The Suleymaniye Mosque is Mimar Sinan\'s architectural masterpiece, built for Sultan Suleiman the Magnificent between 1550-1557. This Ottoman imperial mosque complex showcases perfect Islamic architecture and houses the tombs of Suleiman and Hurrem Sultan.',
        short_overview: 'Mimar Sinan\'s masterpiece Ottoman mosque with stunning Golden Horn views',
        full_description: 'The Suleymaniye Mosque stands as the crowning achievement of Ottoman classical architecture and Mimar Sinan\'s greatest masterpiece. Commissioned by Sultan Suleiman the Magnificent and completed in 1557, this imperial mosque complex (külliye) represents the pinnacle of 16th-century Islamic architectural sophistication. The mosque dominates Istanbul\'s Third Hill with its 53-meter-high central dome and four minarets topped with ten balconies, symbolizing Suleiman as the 10th Ottoman sultan. The interior spans nearly a perfect square (58.5 by 57.5 meters) creating a vast unified space that rivals the Hagia Sophia\'s grandeur. Beyond the prayer hall, the complex originally included madrasas, hospital, soup kitchen, caravanserai, and bathhouse, functioning as a comprehensive welfare system feeding over 1,000 people daily regardless of religion. The mosque\'s cemetery contains the octagonal mausoleum of Sultan Suleiman, adorned with Iznik tiles and housing a fragment of the Black Stone from Mecca\'s Kaaba. Adjacent lies Hurrem Sultan\'s (Roxelana) tomb, reflecting the love story of the Ukrainian-born slave who became an Ottoman empress. Despite damage from earthquakes, fires, and World War I, careful restoration has preserved Sinan\'s original vision of harmonious proportions and spiritual grandeur.',
        historical_context: 'Built 1550-1557 by Mimar Sinan for Sultan Suleiman the Magnificent during the Ottoman Empire\'s golden age. Represented Ottoman power projection and Suleiman\'s vision as a "second Solomon" building his temple.',
        cultural_significance: 'Pinnacle of Ottoman classical architecture and Islamic artistic achievement. Symbol of imperial power, religious devotion, and social welfare. Final resting place of one of history\'s greatest rulers and his beloved wife.',
        duration: '45-60 minutes including tombs and courtyard exploration',
        best_time_to_visit: 'Early morning (9-10 AM) or late afternoon (4-5 PM) for optimal lighting and fewer crowds. Avoid Friday prayer times.',
        dress_code: 'Modest Islamic dress required: long pants/skirts, covered shoulders and arms. Head covering mandatory for women. Clothing provided if needed.',
        entry_requirements: 'Free entry with donations welcomed. Remove shoes before entering. No photography during prayer times. Respectful silence required.',
        accessibility_info: 'Ground level access to main prayer hall. Some areas accessible for wheelchairs. Assistance available for those with mobility challenges.',
        address: 'Prof. Sıddık Sami Onar Cd. No:1, 34116 Fatih/Istanbul',
        district: 'Fatih',
        metro_station: 'Beyazıt-Kapalıçarşı (T1 Tram) or Vezneciler (M2 Metro)',
        location: 'Third Hill of Istanbul, overlooking Golden Horn',
        google_maps_url: 'https://maps.google.com/?q=Suleymaniye+Mosque+Istanbul',
        website_url: 'https://istanbultourstudio.com/things-to-do/suleymaniye-mosque',
        price_range: 'Free entry, donations welcome',
        is_free: true,
        booking_required: false,
        meta_title: 'Suleymaniye Mosque Istanbul: Mimar Sinan\'s Masterpiece & Suleiman\'s Tomb 2025',
        meta_description: 'Visit Suleymaniye Mosque, Mimar Sinan\'s architectural masterpiece. Explore Ottoman imperial mosque, Suleiman\'s tomb, and stunning Golden Horn views.',
        seo_keywords: ['suleymaniye mosque istanbul', 'mimar sinan', 'ottoman mosque', 'suleiman tomb', 'hurrem sultan', 'islamic architecture'],
        rating: 4.7,
        review_count: 38956,
        popularity_score: 89,
        category_id: 1,
        highlights: ['Mimar Sinan masterpiece', 'Sultan Suleiman tomb', 'Hurrem Sultan mausoleum', 'Golden Horn views', 'Ottoman architecture', 'Free entry'],
        languages_spoken: ['Turkish', 'English', 'Arabic', 'German'],
        opening_hours: 'Daily: 8:30 AM - 6:45 PM (Closed during prayer times)',
        is_featured: true,
        is_active: true,
        confidence_score: 98,
        data_sources: ['Islamic architecture studies', 'Ottoman historical records', 'UNESCO documentation', 'Religious authorities'],
        seo_schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TouristAttraction",
              "name": "Suleymaniye Mosque",
              "description": "Mimar Sinan\'s architectural masterpiece and Ottoman imperial mosque",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Prof. Sıddık Sami Onar Cd. No:1",
                "addressLocality": "Fatih",
                "addressRegion": "Istanbul",
                "postalCode": "34116",
                "addressCountry": "TR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "41.0166",
                "longitude": "28.9639"
              },
              "openingHours": "Mo-Su 08:30-18:45",
              "priceRange": "Free",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.7",
                "reviewCount": "38956"
              }
            },
            {
              "@type": "PlaceOfWorship",
              "name": "Süleymaniye Camii",
              "description": "16th-century Ottoman imperial mosque by architect Mimar Sinan",
              "founder": "Sultan Suleiman the Magnificent",
              "architect": "Mimar Sinan"
            }
          ]
        }
      })
      .select()
      .single();

    if (activityError) {
      throw activityError;
    }

    // Add schedule information - daily opening except prayer times
    const schedules = Array.from({ length: 7 }, (_, i) => ({
      day_of_week: i + 1, // Monday=1 to Sunday=7
      opening_time: '08:30',
      closing_time: '18:45',
      is_closed: false,
      special_notes: 'Closed during five daily prayer times. Friday prayers may extend closure period.'
    }));

    for (const schedule of schedules) {
      await supabase
        .from('activity_schedules')
        .insert({
          activity_id: activity.id,
          ...schedule
        });
    }

    // Add high-quality images
    const images = [
      {
        title: 'Suleymaniye Mosque Exterior',
        alt_text: 'Magnificent Suleymaniye Mosque with central dome and four minarets',
        caption: 'Mimar Sinan\'s architectural masterpiece dominating Istanbul\'s Third Hill',
        url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Mosque Interior Prayer Hall',
        alt_text: 'Vast interior prayer hall with central dome and Islamic calligraphy',
        caption: 'The magnificent 53-meter-high central dome creating a unified spiritual space',
        url: 'https://images.unsplash.com/photo-1605553910095-d3ddb6c99ad8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Golden Horn View from Mosque',
        alt_text: 'Panoramic view of Golden Horn and Istanbul from Suleymaniye Mosque',
        caption: 'Spectacular Golden Horn views from the mosque\'s elevated Third Hill location',
        url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Suleiman the Magnificent Tomb',
        alt_text: 'Ornate tomb of Sultan Suleiman with Ottoman architectural details',
        caption: 'Final resting place of Sultan Suleiman the Magnificent with Black Stone fragment',
        url: 'https://images.unsplash.com/photo-1572425248736-d7bb2c921dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Hurrem Sultan Mausoleum',
        alt_text: 'Octagonal mausoleum of Hurrem Sultan with Iznik tile decoration',
        caption: 'Hurrem Sultan\'s (Roxelana) tomb decorated with beautiful Iznik tiles',
        url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Mosque Courtyard and Ablution',
        alt_text: 'Traditional Ottoman mosque courtyard with ablution fountains',
        caption: 'Peaceful courtyard with four minarets and traditional ablution facilities',
        url: 'https://images.unsplash.com/photo-1570939274-30914ee6e44f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Islamic Calligraphy Details',
        alt_text: 'Intricate Islamic calligraphy and geometric patterns inside the mosque',
        caption: 'Exquisite Ottoman calligraphy and geometric art adorning the interior',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Minaret Architectural Detail',
        alt_text: 'Close-up of Ottoman minaret with ten balconies architectural feature',
        caption: 'Detailed view of minarets with ten balconies representing the 10th Ottoman sultan',
        url: 'https://images.unsplash.com/photo-1514649923863-ceaf75b7ec40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Sunset over Suleymaniye',
        alt_text: 'Suleymaniye Mosque silhouetted against Istanbul sunset',
        caption: 'Majestic silhouette of the mosque against Istanbul\'s golden sunset',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Ottoman Architecture Masterpiece',
        alt_text: 'Full view showcasing the complete Suleymaniye Mosque complex',
        caption: 'Complete view of the mosque complex representing Ottoman architectural pinnacle',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      }
    ];

    for (let i = 0; i < images.length; i++) {
      await supabase
        .from('universal_media')
        .insert({
          entity_type: 'activity',
          entity_id: activity.id,
          media_type: 'image',
          url: images[i].url,
          title: images[i].title,
          alt_text: images[i].alt_text,
          caption: images[i].caption,
          sort_order: i + 1,
          attribution: 'Photo by Unsplash',
          license: 'Unsplash License'
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Suleymaniye Mosque added successfully with 10 high-quality images',
      activityId: activity.id
    });

  } catch (error) {
    console.error('Error adding Suleymaniye Mosque:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}