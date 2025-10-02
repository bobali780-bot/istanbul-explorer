import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const categories = [
      { name: 'activities', table: 'activities' },
      { name: 'hotels', table: 'hotels' },
      { name: 'shopping', table: 'shopping' },
      { name: 'food-drink', table: 'restaurants' }
    ];

    const allPlaces = [];

    for (const category of categories) {
      try {
        const { data: places, error } = await supabase
          .from(category.table)
          .select(`
            id,
            name,
            rating,
            review_count,
            location,
            district,
            slug,
            coordinates
          `)
          .not('coordinates', 'is', null)
          .eq('is_active', true)
          .limit(50);

        if (error) {
          console.log(`No data in ${category.table} table, skipping...`);
          continue;
        }

        if (places && places.length > 0) {
          // Get images for these places
          const placeIds = places.map(p => p.id);
          const entityType = category.name === 'food-drink' ? 'restaurant' : 
                           category.name === 'shopping' ? 'shop' : 
                           category.name === 'hotels' ? 'hotel' : 'activity';
          
          const { data: mediaData } = await supabase
            .from('universal_media')
            .select('entity_id, media_url, is_primary, sort_order')
            .eq('entity_type', entityType)
            .in('entity_id', placeIds)
            .order('sort_order', { ascending: true });

          const formattedPlaces = places.map(place => {
            // Find primary image or first image for this place
            const placeImages = mediaData?.filter(media => media.entity_id === place.id) || [];
            const primaryImage = placeImages.find(img => img.is_primary) || placeImages[0];
            
            return {
              id: `${category.name}-${place.id}`, // Make ID unique across categories
              name: place.name,
              category: category.name,
              coordinates: place.coordinates,
              rating: place.rating,
              neighborhood: place.district,
              slug: place.slug,
              image: primaryImage?.media_url || null
            };
          });

          allPlaces.push(...formattedPlaces);
          console.log(`Loaded ${formattedPlaces.length} places from ${category.name}`);
        }
      } catch (err) {
        console.log(`Error loading ${category.name}:`, err);
        // Continue with other categories
      }
    }

    console.log(`Total places with coordinates: ${allPlaces.length}`);

    return NextResponse.json({
      success: true,
      places: allPlaces,
      totalCount: allPlaces.length
    });

  } catch (error) {
    console.error('Map data API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch map data' },
      { status: 500 }
    );
  }
}
