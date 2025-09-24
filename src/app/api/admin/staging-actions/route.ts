import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface StagingAction {
  action: 'approve' | 'reject' | 'bulk_approve' | 'bulk_reject' | 'publish' | 'override_thumbnail'
  item_ids?: string[]
  items?: string[]
  notes?: string
  thumbnailData?: {
    thumbnailUrl: string
    thumbnailIndex: number
    thumbnailReason: string
  }
}

export async function POST(request: Request) {
  try {
    const { action, item_ids, items, notes, thumbnailData }: StagingAction = await request.json();

    // Support both item_ids and items field names for compatibility
    const itemIds = item_ids || items;

    if (!itemIds || itemIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No items specified'
      }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    let updateData: any = {};

    switch (action) {
      case 'approve':
      case 'bulk_approve':
        updateData.status = 'approved';
        break;

      case 'reject':
      case 'bulk_reject':
        updateData.status = 'rejected';
        break;

      case 'publish':
        // Handle publishing approved items to main database
        return await handlePublishToMain(itemIds);

      case 'override_thumbnail':
        if (!thumbnailData) {
          return NextResponse.json({
            success: false,
            error: 'Thumbnail data is required for thumbnail override'
          }, { status: 400 });
        }

        updateData = {
          primary_image: thumbnailData.thumbnailUrl,
          thumbnail_index: thumbnailData.thumbnailIndex,
          thumbnail_reason: thumbnailData.thumbnailReason,
          updated_at: timestamp
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }

    // Update all specified items
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('staging_queue')
      .update(updateData)
      .in('id', itemIds)
      .select();

    if (error) {
      throw error;
    }

    // Log the action (optional - skip if table doesn't exist)
    try {
      await supabase
        .from('ai_enhancement_log')
        .insert({
          staging_item_id: item_ids?.[0] || null, // For bulk actions, log against first item
          enhancement_type: action,
          original_content: { action: action, item_count: item_ids?.length || 0 },
          enhanced_content: { affected_items: data?.length || 0 },
          model_used: 'manual_review',
          created_at: timestamp
        });
    } catch (logError) {
      console.log('Logging skipped - table structure may need updating');
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${item_ids?.length || 0} item(s)`,
      affected_items: data?.length || 0
    });

  } catch (error) {
    console.error(`Staging action error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle publishing approved items to the main activities table
async function handlePublishToMain(item_ids: string[]) {
  try {
    const supabase = getSupabase();
    // Get approved staging items
    const { data: stagingItems, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .in('id', item_ids)
      .eq('status', 'approved');

    if (fetchError) throw fetchError;

    if (!stagingItems || stagingItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No approved items found to publish'
      });
    }

    const publishedItems = [];
    const errors = [];

    for (const item of stagingItems) {
      try {
        // Transform staging item to activities format
        const activityData = {
          title: item.title,
          slug: generateSlug(item.title),
          description: item.raw_content.description || '',
          category: item.category,
          subcategory: extractSubcategory(item.raw_content.content),
          primary_image: item.primary_image,
          images: item.images,
          image_count: item.image_count,
          price_range: item.raw_content.price_range || '',
          duration: item.raw_content.duration || '',
          rating: item.raw_content.rating || 0,
          review_count: item.raw_content.review_count || 0,
          highlights: item.raw_content.highlights || [],
          location: 'Istanbul, Turkey', // Default for Istanbul Explorer
          website_url: item.source_urls[0] || '',
          booking_url: '', // Can be enhanced later
          metadata: {
            confidence_score: item.confidence_score,
            original_staging_id: item.id,
            scraping_job_id: item.scraping_job_id,
            source_urls: item.source_urls,
            published_at: new Date().toISOString(),
            raw_content: item.raw_content
          },
          status: 'published',
          featured: item.confidence_score >= 85, // High confidence items are featured
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Insert into activities table
        const { data: publishedActivity, error: publishError } = await supabase
          .from('activities')
          .insert(activityData)
          .select()
          .single();

        if (publishError) {
          errors.push(`Failed to publish "${item.title}": ${publishError.message}`);
          continue;
        }

        // Update staging item status
        await supabase
          .from('staging_queue')
          .update({
            status: 'published'
          })
          .eq('id', item.id);

        publishedItems.push({
          staging_id: item.id,
          activity_id: publishedActivity.id,
          title: item.title
        });

      } catch (itemError) {
        errors.push(`Failed to publish "${item.title}": ${itemError instanceof Error ? itemError.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Published ${publishedItems.length} of ${stagingItems.length} items`,
      published_items: publishedItems,
      errors: errors.length > 0 ? errors : null
    });

  } catch (error) {
    console.error('Publish to main error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to extract subcategory from content
function extractSubcategory(content: string): string {
  const subcategories = {
    'museum': ['museum', 'gallery', 'exhibition'],
    'historic_site': ['palace', 'mosque', 'church', 'historic', 'ancient'],
    'entertainment': ['show', 'performance', 'entertainment', 'theater'],
    'outdoor': ['park', 'garden', 'outdoor', 'walking', 'tour'],
    'shopping': ['bazaar', 'market', 'shopping', 'shop'],
    'transport': ['cruise', 'boat', 'ferry', 'transport']
  };

  const contentLower = content.toLowerCase();

  for (const [category, keywords] of Object.entries(subcategories)) {
    if (keywords.some(keyword => contentLower.includes(keyword))) {
      return category;
    }
  }

  return 'general';
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'stats') {
      // Get staging statistics
      const supabase = getSupabase();
      const { data: items, error } = await supabase
        .from('staging_queue')
        .select('status, confidence_score, category, created_at');

      if (error) throw error;

      const stats = {
        total: items.length,
        by_status: {
          pending: items.filter(i => i.status === 'pending').length,
          approved: items.filter(i => i.status === 'approved').length,
          rejected: items.filter(i => i.status === 'rejected').length,
          published: items.filter(i => i.status === 'published').length
        },
        by_category: items.reduce((acc: any, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {}),
        avg_confidence: items.length > 0
          ? Math.round(items.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / items.length)
          : 0,
        recent_activity: items
          .filter(i => new Date(i.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
          .length
      };

      return NextResponse.json({ success: true, stats });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action specified'
    }, { status: 400 });

  } catch (error) {
    console.error('Staging stats error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}