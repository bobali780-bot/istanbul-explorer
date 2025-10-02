import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const knowledgeBase: any = {
      business_info: {
        name: "Best Istanbul",
        mission: "We're passionate locals who believe Istanbul deserves to be explored authentically, not just ticked off a bucket list.",
        description: "Best Istanbul is a curated travel guide platform showcasing the best destinations, activities, and experiences in Istanbul. We provide hand-picked, locally-vetted recommendations backed by real reviews from actual visitors.",
        categories: ["Activities", "Shopping", "Food & Drink", "Hotels"],
        key_features: [
          "Locally curated recommendations",
          "Real verified reviews",
          "Beyond tourist trails - hidden gems",
          "For every traveler type (history buffs, foodies, shopaholics, sunset chasers)",
          "Transparent pricing with no hidden fees",
          "No sponsored content - merit-based recommendations only"
        ]
      },
      venues: {
        activities: [],
        shopping: [],
        restaurants: [],
        hotels: []
      },
      neighborhoods: new Set<string>(),
      popular_areas: [],
      tips: []
    };

    // Fetch all venues from each category
    const tables = [
      { table: 'activities', category: 'activities', entityType: 'activity' },
      { table: 'shopping', category: 'shopping', entityType: 'shop' },
      { table: 'restaurants', category: 'restaurants', entityType: 'restaurant' },
      { table: 'hotels', category: 'hotels', entityType: 'hotel' }
    ];

    for (const { table, category } of tables) {
      const { data: venues } = await supabase
        .from(table)
        .select('id, name, slug, short_overview, description, location, district, rating, review_count, price_range, why_visit, accessibility, facilities, practical_info, highlights')
        .eq('is_active', true)
        .order('popularity_score', { ascending: false })
        .limit(50); // Limit to top 50 per category for speed

      if (venues) {
        for (const venue of venues) {
          // Add neighborhood to set
          if (venue.district) knowledgeBase.neighborhoods.add(venue.district);

          // Skip individual review fetches - too slow
          knowledgeBase.venues[category].push({
            id: venue.id,
            name: venue.name,
            slug: venue.slug,
            description: venue.short_overview || venue.description,
            location: venue.location,
            district: venue.district,
            rating: venue.rating,
            review_count: venue.review_count,
            price_range: venue.price_range,
            why_visit: venue.why_visit,
            accessibility: venue.accessibility,
            facilities: venue.facilities,
            practical_info: venue.practical_info,
            highlights: venue.highlights
          });
        }
      }
    }

    // Convert neighborhoods set to array
    knowledgeBase.neighborhoods = Array.from(knowledgeBase.neighborhoods);

    // Generate summary statistics
    knowledgeBase.statistics = {
      total_activities: knowledgeBase.venues.activities.length,
      total_shopping: knowledgeBase.venues.shopping.length,
      total_restaurants: knowledgeBase.venues.restaurants.length,
      total_hotels: knowledgeBase.venues.hotels.length,
      total_venues: Object.values(knowledgeBase.venues).reduce((sum: number, arr: any) => sum + arr.length, 0),
      neighborhoods_covered: knowledgeBase.neighborhoods.length
    };

    // Popular neighborhoods (based on venue count)
    const neighborhoodCounts: Record<string, number> = {};
    Object.values(knowledgeBase.venues).forEach((venues: any) => {
      venues.forEach((v: any) => {
        if (v.district) {
          neighborhoodCounts[v.district] = (neighborhoodCounts[v.district] || 0) + 1;
        }
      });
    });

    knowledgeBase.popular_areas = Object.entries(neighborhoodCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([name, count]) => ({ name, venue_count: count }));

    // Add travel tips
    knowledgeBase.tips = [
      "Sultanahmet is the historic heart of Istanbul - home to Hagia Sophia, Blue Mosque, and Topkapi Palace",
      "Beyoğlu offers modern Istanbul with İstiklal Avenue, Galata Tower, and vibrant nightlife",
      "Beşiktaş is known for waterfront palaces like Dolmabahçe and upscale shopping",
      "Grand Bazaar and Spice Bazaar are must-visit for authentic Turkish shopping experiences",
      "Take a Bosphorus cruise to see Istanbul from the water - it connects Europe and Asia",
      "Many mosques require modest dress - bring a scarf and cover shoulders/knees",
      "Istanbul straddles two continents - explore both the European and Asian sides",
      "Try traditional Turkish breakfast, kebabs, baklava, and Turkish tea/coffee"
    ];

    return NextResponse.json({
      success: true,
      knowledge_base: knowledgeBase,
      summary: `Generated knowledge base with ${knowledgeBase.statistics.total_venues} venues across ${knowledgeBase.neighborhoods.length} neighborhoods`
    });

  } catch (error) {
    console.error('Knowledge base generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate knowledge base'
    }, { status: 500 });
  }
}
