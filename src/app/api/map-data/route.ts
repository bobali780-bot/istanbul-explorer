import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Cache for 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const categories = [
      { name: 'activities', table: 'activities', entityType: 'activity' },
      { name: 'hotels', table: 'hotels', entityType: 'hotel' },
      { name: 'shopping', table: 'shopping', entityType: 'shop' },
      { name: 'food-drink', table: 'restaurants', entityType: 'restaurant' }
    ];

    // Fetch all categories in parallel instead of sequentially
    const categoryPromises = categories.map(async (category) => {
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
          .limit(30); // Reduced from 50 for faster loading

        if (error || !places || places.length === 0) {
          console.log(`No data in ${category.table} table, skipping...`);
          return { category: category.name, places: [] };
        }

        return { category: category.name, places, entityType: category.entityType };
      } catch (err) {
        console.log(`Error loading ${category.name}:`, err);
        return { category: category.name, places: [] };
      }
    });

    const categoryResults = await Promise.all(categoryPromises);

    // Collect all place IDs grouped by entity type for batch media fetching
    const mediaQueries = categoryResults
      .filter(result => result.places.length > 0)
      .map(async (result) => {
        const placeIds = result.places.map((p: any) => p.id);
        const { data: mediaData } = await supabase
          .from('universal_media')
          .select('entity_id, media_url, is_primary')
          .eq('entity_type', result.entityType)
          .in('entity_id', placeIds)
          .eq('is_primary', true); // Only fetch primary images for performance

        return { category: result.category, mediaData: mediaData || [], places: result.places };
      });

    const mediaResults = await Promise.all(mediaQueries);

    // Format all places with their images
    const allPlaces = mediaResults.flatMap(({ category, mediaData, places }) => {
      return places.map((place: any) => {
        const primaryImage = mediaData.find((media: any) => media.entity_id === place.id);
        
        return {
          id: `${category}-${place.id}`,
          name: place.name,
          category: category,
          coordinates: place.coordinates,
          rating: place.rating,
          neighborhood: place.district,
          slug: place.slug,
          image: primaryImage?.media_url || null
        };
      });
    });

    console.log(`Total places with coordinates: ${allPlaces.length}`);

    return NextResponse.json({
      success: true,
      places: allPlaces,
      totalCount: allPlaces.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('Map data API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch map data' },
      { status: 500 }
    );
  }
}
