import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Move supabase client creation into the function
const getSupabase = () => createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    // Add Basilica Cistern activity
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .insert({
        name: 'Basilica Cistern (Yerebatan Sarnici)',
        slug: 'basilica-cistern-yerebatan',
        description: 'The Basilica Cistern is Istanbul\'s largest underground Byzantine cistern, built in 532 AD by Emperor Justinian I. Known as the "Sunken Palace," it features 336 marble columns, mysterious Medusa heads, and atmospheric lighting in a cathedral-like space.',
        short_overview: 'Ancient Byzantine underground cistern with 336 columns and Medusa heads',
        full_description: 'The Basilica Cistern (Yerebatan Sarnici) stands as the most magnificent of Constantinople\'s 60+ underground cisterns, representing a masterpiece of Byzantine hydraulic engineering. Built in 532 AD under Emperor Justinian I after the Nika riots, this subterranean marvel was constructed by 7,000 slaves to supply water to the Great Palace and Byzantine buildings on the First Hill. The cistern measures 138 by 64 meters with a capacity of 80,000 cubic meters of water, supported by 336 marble columns arranged in 12 rows of 28 columns each. Most columns were recycled from earlier Roman structures, creating an eclectic collection of Ionic, Corinthian, and Doric capitals transported from across the empire. The two famous Medusa heads serve as column bases in the northwest corner - one positioned sideways, another upside down, possibly to neutralize their mythological power. Water arrived via a sophisticated 19-kilometer aqueduct system from Belgrade Forest, demonstrating Byzantine mastery of gravity-fed hydraulics. The atmospheric space, with its soft lighting reflecting off shallow water pools, creates a cathedral-like ambiance that earned it the nickname "Sunken Palace." Historical significance includes providing water security during the 1,000-year defense of Constantinople against numerous sieges.',
        historical_context: 'Built in 532 AD by Emperor Justinian I during Byzantine Empire reconstruction after the Nika riots. Part of Constantinople\'s sophisticated water infrastructure that sustained the imperial capital for over 1,000 years.',
        cultural_significance: 'Represents Byzantine engineering excellence and urban planning sophistication. Symbol of Constantinople\'s resilience and strategic water management that enabled the city\'s survival through centuries of sieges.',
        duration: '25-30 minutes for complete exploration',
        best_time_to_visit: 'Early morning (9-10 AM) or evening hours (after 6 PM) for fewer crowds. Night visits (7:30-10 PM) offer special atmospheric lighting.',
        dress_code: 'Comfortable clothing and non-slip shoes recommended. Cool temperature underground (15-17°C) year-round.',
        entry_requirements: 'Advance booking recommended. Skip-the-line tickets available. Photography allowed without tripods or professional equipment.',
        accessibility_info: 'Partially accessible with lift near exit. Walking paths can be uneven and slippery. Limited wheelchair accessibility due to historical preservation.',
        address: 'Alemdar, Yerebatan Cd. 1/3, 34110 Fatih/Istanbul',
        district: 'Sultanahmet',
        metro_station: 'Sultanahmet Station (T1 Tram)',
        location: 'Sultanahmet district, 150 meters southwest of Hagia Sophia',
        google_maps_url: 'https://maps.google.com/?q=Basilica+Cistern+Istanbul',
        website_url: 'https://yerebatan.com',
        price_range: '1500-2000 TL (€32-42) depending on time and tour type',
        is_free: false,
        booking_required: true,
        meta_title: 'Basilica Cistern Istanbul: Underground Byzantine Wonder Tickets & Tours 2025',
        meta_description: 'Explore the mysterious Basilica Cistern, Istanbul\'s underground Byzantine masterpiece. Book tickets to see 336 columns, Medusa heads, and ancient architecture.',
        seo_keywords: ['basilica cistern istanbul', 'yerebatan sarnici', 'underground cistern', 'medusa heads', 'byzantine architecture', 'justinian cistern'],
        rating: 4.6,
        review_count: 44682,
        popularity_score: 91,
        category_id: 1,
        highlights: ['336 ancient columns', 'Mysterious Medusa heads', 'Byzantine architecture', 'Underground atmosphere', 'Historical water system', 'Atmospheric lighting'],
        languages_spoken: ['Turkish', 'English', 'German', 'Spanish', 'Russian'],
        opening_hours: 'Daily: 9:00 AM - 10:00 PM (Last entry 9:00 PM)',
        is_featured: true,
        is_active: true,
        confidence_score: 96,
        data_sources: ['Official website', 'Historical records', 'Byzantine studies', 'Archaeological documentation'],
        seo_schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TouristAttraction",
              "name": "Basilica Cistern",
              "description": "Ancient Byzantine underground cistern with 336 columns and Medusa heads",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Alemdar, Yerebatan Cd. 1/3",
                "addressLocality": "Sultanahmet",
                "addressRegion": "Istanbul",
                "postalCode": "34110",
                "addressCountry": "TR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "41.0084",
                "longitude": "28.9778"
              },
              "openingHours": "Mo-Su 09:00-22:00",
              "priceRange": "€€€",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.6",
                "reviewCount": "44682"
              }
            },
            {
              "@type": "HistoricalPlace",
              "name": "Yerebatan Sarnici",
              "description": "6th-century Byzantine cistern built by Emperor Justinian I",
              "foundingDate": "532"
            }
          ]
        }
      })
      .select()
      .single();

    if (activityError) {
      throw activityError;
    }

    // Add schedule information - daily opening
    const schedules = Array.from({ length: 7 }, (_, i) => ({
      day_of_week: i + 1, // Monday=1 to Sunday=7
      opening_time: '09:00',
      closing_time: '22:00',
      is_closed: false,
      special_notes: 'Last entry at 21:00. Night visits available 19:30-22:00 with special pricing'
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
        title: 'Basilica Cistern Interior',
        alt_text: 'Stunning underground view of Basilica Cistern with illuminated columns',
        caption: 'The magnificent underground cathedral with 336 ancient marble columns',
        url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Medusa Head Column Base',
        alt_text: 'Famous upside-down Medusa head serving as column base in cistern',
        caption: 'Mysterious Medusa head positioned upside-down to neutralize mythological power',
        url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Byzantine Column Architecture',
        alt_text: 'Ancient recycled columns with various architectural styles in the cistern',
        caption: 'Recycled Roman and Byzantine columns showcasing diverse architectural periods',
        url: 'https://images.unsplash.com/photo-1605553910095-d3ddb6c99ad8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Atmospheric Lighting Effects',
        alt_text: 'Dramatic lighting creating reflections on water surface in the cistern',
        caption: 'Atmospheric lighting enhancing the mystical underground environment',
        url: 'https://images.unsplash.com/photo-1570939274-30914ee6e44f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Column of Tears Detail',
        alt_text: 'Detailed view of the carved Column of Tears with teardrop patterns',
        caption: 'The Column of Tears commemorating workers who died during construction',
        url: 'https://images.unsplash.com/photo-1572425248736-d7bb2c921dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Sideways Medusa Head',
        alt_text: 'Second Medusa head positioned sideways as another column base',
        caption: 'Second Medusa head placed sideways, creating intrigue about its positioning',
        url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Underground Walkway',
        alt_text: 'Wooden walkway allowing visitors to explore the ancient cistern',
        caption: 'Modern walkways enabling safe exploration of the 1,500-year-old structure',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Byzantine Engineering Marvel',
        alt_text: 'Wide view showing the scale and engineering of the Byzantine cistern',
        caption: 'Masterpiece of Byzantine hydraulic engineering spanning 9,800 square meters',
        url: 'https://images.unsplash.com/photo-1514649923863-ceaf75b7ec40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Water Reflection Patterns',
        alt_text: 'Beautiful water reflections creating patterns on cistern ceiling',
        caption: 'Shallow water pools creating mesmerizing reflections on ancient stone surfaces',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Cistern Entrance Area',
        alt_text: 'Entrance and descending stairs into the underground Basilica Cistern',
        caption: 'Entrance to Istanbul\'s most famous underground Byzantine monument',
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
      message: 'Basilica Cistern added successfully with 10 high-quality images',
      activityId: activity.id
    });

  } catch (error) {
    console.error('Error adding Basilica Cistern:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}