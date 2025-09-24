import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface WikipediaResponse {
  extract?: string;
  pageviews?: { [date: string]: number };
}

interface UnsplashImage {
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { entityType, entityId, targetEntity } = await request.json();

    console.log(`Starting content generation for ${entityType}:${entityId}`);

    // Log automation start
    const { data: logEntry } = await supabase
      .from('automation_logs')
      .insert({
        job_type: 'content_update',
        entity_type: entityType,
        entity_id: entityId,
        status: 'running',
        details: { target_entity: targetEntity }
      })
      .select()
      .single();

    let results = {
      wikipediaContent: null as WikipediaResponse | null,
      images: [] as UnsplashImage[],
      popularityScore: 0,
      socialContent: [] as any[],
      nearbyRecommendations: [] as any[]
    };

    try {
      // 1. Fetch Wikipedia content for description enhancement
      results.wikipediaContent = await fetchWikipediaContent(supabase, targetEntity) || null;

      // 2. Fetch free images from Unsplash
      results.images = await fetchUnsplashImages(supabase, targetEntity, 5);

      // 3. Calculate popularity score from multiple free sources
      results.popularityScore = await calculatePopularityScore(supabase, targetEntity);

      // 4. Update database with generated content
      await updateEntityContent(supabase, entityType, entityId, results);

      // 5. Generate nearby recommendations
      results.nearbyRecommendations = await generateNearbyRecommendations(supabase, entityType, entityId);

      // Update automation log
      await supabase
        .from('automation_logs')
        .update({
          status: 'completed',
          end_time: new Date().toISOString(),
          details: {
            ...logEntry?.details,
            results_summary: {
              wikipedia_content: !!results.wikipediaContent,
              images_found: results.images.length,
              popularity_score: results.popularityScore,
              nearby_recommendations: results.nearbyRecommendations.length
            }
          }
        })
        .eq('id', logEntry?.id);

      return NextResponse.json({
        success: true,
        message: 'Content generation completed successfully',
        results
      });

    } catch (error) {
      // Update automation log with error
      await supabase
        .from('automation_logs')
        .update({
          status: 'failed',
          end_time: new Date().toISOString(),
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', logEntry?.id);

      throw error;
    }

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function fetchWikipediaContent(supabase: any, entityName: string): Promise<WikipediaResponse | null> {
  try {
    // Track API usage
    await supabase
      .from('api_usage_tracking')
      .insert({
        api_name: 'wikipedia',
        endpoint: 'extract',
        cost_per_request: 0
      });

    // Get Wikipedia extract
    const extractResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(entityName)}`,
      { headers: { 'User-Agent': 'IstanbulExplorer/1.0' } }
    );

    if (!extractResponse.ok) {
      console.log(`Wikipedia extract not found for: ${entityName}`);
      return null;
    }

    const extractData = await extractResponse.json();

    // Get pageview statistics
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const pageviewsResponse = await fetch(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(entityName)}/daily/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`,
      { headers: { 'User-Agent': 'IstanbulExplorer/1.0' } }
    );

    let pageviews = {};
    if (pageviewsResponse.ok) {
      const pageviewsData = await pageviewsResponse.json();
      pageviews = pageviewsData.items?.reduce((acc: any, item: any) => {
        acc[item.timestamp] = item.views;
        return acc;
      }, {}) || {};
    }

    return {
      extract: extractData.extract,
      pageviews
    };

  } catch (error) {
    console.error('Wikipedia fetch error:', error);
    return null;
  }
}

async function fetchUnsplashImages(supabase: any, query: string, count: number = 5): Promise<UnsplashImage[]> {
  try {
    // Track API usage
    await supabase
      .from('api_usage_tracking')
      .insert({
        api_name: 'unsplash',
        endpoint: 'search',
        cost_per_request: 0,
        monthly_limit: 50 // Free tier limit
      });

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' Istanbul')}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.results || [];

  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return [];
  }
}

async function calculatePopularityScore(supabase: any, entityName: string): Promise<number> {
  let score = 0;

  try {
    // Base score from Wikipedia pageviews (if available)
    const wikipediaData = await fetchWikipediaContent(supabase, entityName);
    if (wikipediaData?.pageviews) {
      const totalViews = Object.values(wikipediaData.pageviews).reduce((sum: number, views: any) => sum + views, 0);
      score += Math.min(totalViews / 1000, 50); // Cap at 50 points
    }

    // Additional scoring factors (free APIs)
    // Google Trends would require a different approach or library
    // Social media mentions could use public APIs

    // Normalize score to 0-100 range
    return Math.min(Math.round(score), 100);

  } catch (error) {
    console.error('Popularity score calculation error:', error);
    return 0;
  }
}

async function updateEntityContent(supabase: any, entityType: string, entityId: number, results: any) {
  try {
    const tableName = `${entityType}s`; // activities, restaurants, hotels, shopping_venues

    // Update main entity with Wikipedia content if available
    if (results.wikipediaContent?.extract) {
      await supabase
        .from(tableName)
        .update({
          full_description: results.wikipediaContent.extract,
          popularity_score: results.popularityScore,
          last_updated: new Date().toISOString()
        })
        .eq('id', entityId);
    }

    // Add images to universal_media table
    for (let i = 0; i < results.images.length; i++) {
      const image = results.images[i];
      await supabase
        .from('universal_media')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          media_type: 'image',
          media_url: image.urls.regular,
          thumbnail_url: image.urls.small,
          alt_text: image.alt_description || `${entityType} in Istanbul`,
          attribution: `Photo by ${image.user.name} on Unsplash`,
          source: 'unsplash',
          is_primary: i === 0,
          sort_order: i,
          quality_score: 85 // Default good quality for Unsplash
        });
    }

    // Store Wikipedia insights
    if (results.wikipediaContent?.pageviews) {
      await supabase
        .from('universal_insights')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          metric_type: 'wikipedia_views',
          metric_value: Object.values(results.wikipediaContent.pageviews).reduce((sum: number, views: any) => sum + views, 0),
          time_period: 'monthly',
          data_source: 'wikipedia',
          raw_data: results.wikipediaContent.pageviews
        });
    }

  } catch (error) {
    console.error('Database update error:', error);
    throw error;
  }
}

async function generateNearbyRecommendations(supabase: any, entityType: string, entityId: number) {
  try {
    // Get current entity details
    const { data: currentEntity } = await supabase
      .from(`${entityType}s`)
      .select('district, name')
      .eq('id', entityId)
      .single();

    if (!currentEntity) return [];

    // Find nearby entities in the same district
    const nearbyQueries = [
      supabase.from('activities').select('id, name, district').eq('district', currentEntity.district).neq('id', entityType === 'activity' ? entityId : 0),
      supabase.from('restaurants').select('id, name, district').eq('district', currentEntity.district).neq('id', entityType === 'restaurant' ? entityId : 0),
      supabase.from('hotels').select('id, name, district').eq('district', currentEntity.district).neq('id', entityType === 'hotel' ? entityId : 0),
      supabase.from('shopping_venues').select('id, name, district').eq('district', currentEntity.district).neq('id', entityType === 'shopping_venue' ? entityId : 0)
    ];

    const nearbyResults = await Promise.all(nearbyQueries);
    const recommendations = [];

    // Process each category
    const categories = ['activity', 'restaurant', 'hotel', 'shopping_venue'];
    for (let i = 0; i < nearbyResults.length; i++) {
      const { data } = nearbyResults[i];
      if (data) {
        for (const item of data.slice(0, 3)) { // Limit to 3 per category
          recommendations.push({
            source_entity_type: entityType,
            source_entity_id: entityId,
            target_entity_type: categories[i],
            target_entity_id: item.id,
            distance_meters: Math.floor(Math.random() * 1000) + 100, // Placeholder
            walking_time_minutes: Math.floor(Math.random() * 15) + 2, // Placeholder
            recommendation_score: Math.floor(Math.random() * 50) + 50,
            recommendation_reason: `Popular ${categories[i]} in ${currentEntity.district}`
          });
        }
      }
    }

    // Insert recommendations
    if (recommendations.length > 0) {
      await supabase
        .from('universal_nearby_recommendations')
        .insert(recommendations);
    }

    return recommendations;

  } catch (error) {
    console.error('Nearby recommendations generation error:', error);
    return [];
  }
}