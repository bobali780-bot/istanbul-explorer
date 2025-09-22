#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🏆 Generating Top 10 rankings...');

  try {
    // Generate rankings for each category
    const categories = ['activity', 'restaurant', 'hotel', 'shopping_venue'];

    for (const category of categories) {
      await generateTop10Ranking(category);
      console.log(`✅ Generated Top 10 ${category} ranking`);
    }

    // Generate themed rankings
    await generateThemedRankings();

    console.log('🎉 All rankings generated successfully');

  } catch (error) {
    console.error('❌ Rankings generation failed:', error);
    process.exit(1);
  }
}

async function generateTop10Ranking(entityType) {
  const tableName = `${entityType}s`;

  // Get top entities based on multiple factors
  const { data: topEntities } = await supabase
    .from(tableName)
    .select(`
      id,
      name,
      slug,
      rating,
      review_count,
      popularity_score,
      visitor_count,
      is_featured
    `)
    .eq('is_active', true)
    .order('popularity_score', { ascending: false })
    .limit(15); // Get 15 to have flexibility

  if (!topEntities || topEntities.length === 0) {
    console.log(`No ${entityType}s found for ranking`);
    return;
  }

  // Calculate composite score
  const rankedEntities = topEntities.map(entity => {
    let score = 0;

    // Popularity score (40% weight)
    score += (entity.popularity_score || 0) * 0.4;

    // Rating (30% weight)
    if (entity.rating && entity.review_count > 0) {
      score += (entity.rating / 5) * 100 * 0.3;
    }

    // Review count (20% weight) - normalized
    if (entity.review_count > 0) {
      score += Math.min((entity.review_count / 100) * 100, 100) * 0.2;
    }

    // Featured status bonus (10% weight)
    if (entity.is_featured) {
      score += 10;
    }

    return {
      ...entity,
      composite_score: Math.round(score)
    };
  });

  // Sort by composite score and take top 10
  const top10 = rankedEntities
    .sort((a, b) => b.composite_score - a.composite_score)
    .slice(0, 10);

  // Create or update visitor guide
  const guideSlug = `top-10-${entityType}s-istanbul`;
  const guideTitle = `Top 10 ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}s in Istanbul`;

  const includeEntities = top10.map((entity, index) => ({
    type: entityType,
    id: entity.id,
    rank: index + 1,
    score: entity.composite_score
  }));

  // Generate description
  const description = `Discover the ${top10.length} best ${entityType}s in Istanbul, ranked by popularity, ratings, and visitor reviews. Updated daily with real data.`;

  // Check if guide exists
  const { data: existingGuide } = await supabase
    .from('visitor_guides')
    .select('id')
    .eq('slug', guideSlug)
    .single();

  if (existingGuide) {
    // Update existing guide
    await supabase
      .from('visitor_guides')
      .update({
        included_entities: includeEntities,
        last_auto_update: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existingGuide.id);
  } else {
    // Create new guide
    await supabase
      .from('visitor_guides')
      .insert({
        title: guideTitle,
        slug: guideSlug,
        description,
        guide_type: 'top_10',
        target_audience: 'general',
        included_entities: includeEntities,
        is_featured: true,
        is_published: true,
        last_auto_update: new Date().toISOString()
      });
  }

  console.log(`📊 Top 10 ${entityType}s: ${top10.map(e => e.name).join(', ')}`);
}

async function generateThemedRankings() {
  // Generate themed rankings like "Best Budget Hotels", "Best Turkish Restaurants", etc.
  const themedRankings = [
    {
      type: 'restaurant',
      filter: { cuisine_type: 'Turkish' },
      title: 'Best Turkish Restaurants in Istanbul',
      slug: 'best-turkish-restaurants-istanbul',
      audience: 'food-lovers'
    },
    {
      type: 'hotel',
      filter: { price_range: '$' },
      title: 'Best Budget Hotels in Istanbul',
      slug: 'best-budget-hotels-istanbul',
      audience: 'budget'
    },
    {
      type: 'activity',
      filter: { highlights: { contains: ['historic', 'history', 'museum'] } },
      title: 'Best Historic Sites in Istanbul',
      slug: 'best-historic-sites-istanbul',
      audience: 'history-buffs'
    }
  ];

  for (const ranking of themedRankings) {
    try {
      await generateThemedRanking(ranking);
    } catch (error) {
      console.error(`Failed to generate themed ranking: ${ranking.title}`, error);
    }
  }
}

async function generateThemedRanking(ranking) {
  const tableName = `${ranking.type}s`;

  // Build query with filters
  let query = supabase
    .from(tableName)
    .select('id, name, slug, rating, review_count, popularity_score')
    .eq('is_active', true);

  // Apply filters
  Object.entries(ranking.filter).forEach(([key, value]) => {
    if (typeof value === 'string') {
      query = query.ilike(key, `%${value}%`);
    } else if (Array.isArray(value)) {
      // For array contains checks
      query = query.overlaps(key, value);
    }
  });

  const { data: entities } = await query
    .order('popularity_score', { ascending: false })
    .limit(10);

  if (!entities || entities.length === 0) {
    console.log(`No entities found for themed ranking: ${ranking.title}`);
    return;
  }

  const includeEntities = entities.map((entity, index) => ({
    type: ranking.type,
    id: entity.id,
    rank: index + 1
  }));

  // Check if guide exists
  const { data: existingGuide } = await supabase
    .from('visitor_guides')
    .select('id')
    .eq('slug', ranking.slug)
    .single();

  if (existingGuide) {
    await supabase
      .from('visitor_guides')
      .update({
        included_entities: includeEntities,
        last_auto_update: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existingGuide.id);
  } else {
    await supabase
      .from('visitor_guides')
      .insert({
        title: ranking.title,
        slug: ranking.slug,
        description: `Curated list of the best ${ranking.type}s in Istanbul for ${ranking.audience}. Updated automatically with latest data.`,
        guide_type: 'themed_itinerary',
        target_audience: ranking.audience,
        included_entities: includeEntities,
        is_featured: false,
        is_published: true,
        last_auto_update: new Date().toISOString()
      });
  }

  console.log(`✨ Generated themed ranking: ${ranking.title}`);
}

main();