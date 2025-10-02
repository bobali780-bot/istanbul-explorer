import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const tables = [
      { table: 'activities', category: 'activities' },
      { table: 'shopping', category: 'shopping' },
      { table: 'restaurants', category: 'food-drink' },
      { table: 'hotels', category: 'hotels' }
    ];

    const allVenues: any[] = [];

    // Fetch venues in parallel for speed
    const venuePromises = tables.map(async ({ table, category }) => {
      const { data, error } = await supabase
        .from(table)
        .select('id, name, slug, location, district, rating, review_count, price_range, short_overview')
        .eq('is_active', true)
        .order('popularity_score', { ascending: false })
        .limit(50); // Reduce to 50 per category for speed

      if (error || !data) return [];

      const entityType = category === 'activities' ? 'activity' : category === 'shopping' ? 'shop' : category === 'food-drink' ? 'restaurant' : 'hotel';

      // Fetch all primary images in one batch query
      const venueIds = data.map(v => v.id);
      const { data: mediaList } = await supabase
        .from('universal_media')
        .select('entity_id, media_url')
        .eq('entity_type', entityType)
        .in('entity_id', venueIds)
        .eq('is_primary', true);

      // Create a map of venue ID to image URL
      const imageMap = new Map(mediaList?.map(m => [m.entity_id, m.media_url]) || []);

      return data.map(venue => ({
        ...venue,
        category,
        image_url: imageMap.get(venue.id) || null
      }));
    });

    const venueArrays = await Promise.all(venuePromises);
    venueArrays.forEach(venues => allVenues.push(...venues));

    // Sort by rating and popularity
    allVenues.sort((a, b) => {
      const scoreA = (a.rating || 0) * (a.review_count || 0);
      const scoreB = (b.rating || 0) * (b.review_count || 0);
      return scoreB - scoreA;
    });

    return NextResponse.json({
      success: true,
      venues: allVenues,
      total: allVenues.length
    });

  } catch (error) {
    console.error('Explore API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch venues',
      venues: []
    }, { status: 500 });
  }
}
