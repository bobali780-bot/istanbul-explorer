import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface StagingAction {
  action: 'approve' | 'reject' | 'bulk_approve' | 'bulk_reject' | 'publish' | 'override_thumbnail' | 'publish_all_approved'
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
      // Allow publish_all_approved to work without item_ids
      if (action !== 'publish_all_approved') {
        return NextResponse.json({
          success: false,
          error: 'No items specified'
        }, { status: 400 });
      }
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
        if (!itemIds) {
          return NextResponse.json({ 
            success: false, 
            error: 'No items specified for publishing' 
          }, { status: 400 });
        }
        return await handlePublishToMain(itemIds);
        
      case 'publish_all_approved':
        // Publish all approved items
        return await handlePublishAllApproved();

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

    // Update all specified items (only for actions that require item_ids)
    if (!itemIds) {
      return NextResponse.json({ 
        success: false, 
        error: 'No items specified' 
      }, { status: 400 });
    }

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
    console.log('🔍 handlePublishToMain called with item_ids:', item_ids);
    const supabase = getSupabase();
    // Get approved staging items
    const { data: stagingItems, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .in('id', item_ids)
      .eq('status', 'approved');
    
    console.log('📊 Staging items query result:', { stagingItems, fetchError });

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
        const baseData = {
          name: item.title, // Map title to name field
          slug: generateSlug(item.title),
          description: item.raw_content.description || '',
          short_overview: item.raw_content.description || '', // Use description as overview
          full_description: item.raw_content.description || '',
          booking_url: '', // Can be enhanced later
          rating: item.raw_content.rating || 0,
          review_count: item.raw_content.review_count || 0,
          price_range: item.raw_content.price_range || '',
          opening_hours: Array.isArray(item.raw_content.opening_hours) 
            ? item.raw_content.opening_hours.join(', ') 
            : item.raw_content.opening_hours || '',
          location: 'Istanbul, Turkey', // Default for Istanbul Explorer
          highlights: item.raw_content.highlights || [],
          trip_advisor_url: item.source_urls?.[0] || '',
          address: item.raw_content.address || 'Istanbul, Turkey',
          district: extractDistrict(item.raw_content.address),
          is_featured: item.confidence_score >= 85, // High confidence items are featured
          is_active: true, // Make it visible on the site
          popularity_score: Math.floor(item.confidence_score || 50), // Use confidence as popularity
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Add duration only for activities category
        const activityData = item.category === 'activities' 
          ? { ...baseData, duration: item.raw_content.duration || '' }
          : baseData;

        // Determine target table based on category
        const targetTable = getTargetTable(item.category);
        
        // Insert into appropriate table based on category
        const { data: publishedActivity, error: publishError } = await supabase
          .from(targetTable)
          .insert(activityData)
          .select()
          .single();

        if (publishError) {
          errors.push(`Failed to publish "${item.title}": ${publishError.message}`);
          continue;
        }

        // Add images to universal_media table
        if (item.images && item.images.length > 0) {
          const entityType = getEntityType(item.category);
          const mediaRecords = item.images.map((imageUrl: string, index: number) => ({
            entity_type: entityType,
            entity_id: publishedActivity.id,
            media_url: imageUrl,
            media_type: 'image',
            alt_text: `${item.title} image ${index + 1}`,
            is_primary: index === 0, // First image is primary
            sort_order: index + 1
          }));

          const { error: mediaError } = await supabase
            .from('universal_media')
            .insert(mediaRecords);

          if (mediaError) {
            console.error(`Failed to insert media for "${item.title}":`, mediaError);
            // Don't fail the whole operation for media errors
          }
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

// Helper function to extract district from address
function extractDistrict(address: string): string {
  if (!address) return 'Istanbul';
  
  const districts = [
    'Sultanahmet', 'Beyoğlu', 'Kadıköy', 'Beşiktaş', 'Şişli', 'Fatih', 
    'Üsküdar', 'Bakırköy', 'Maltepe', 'Pendik', 'Tuzla', 'Sarıyer'
  ];

  const addressLower = address.toLowerCase();
  
  for (const district of districts) {
    if (addressLower.includes(district.toLowerCase())) {
      return district;
    }
  }

  return 'Istanbul';
}

// Helper function to determine target table based on category
function getTargetTable(category: string): string {
  const categoryMap: Record<string, string> = {
    'activities': 'activities',
    'hotels': 'hotels',
    'shopping': 'shopping',
    'food-drink': 'restaurants',
    'restaurants': 'restaurants'
  };
  
  return categoryMap[category] || 'activities'; // Default to activities
}

// Helper function to determine entity type for media
function getEntityType(category: string): string {
  const entityMap: Record<string, string> = {
    'activities': 'activity',
    'hotels': 'hotel',
    'shopping': 'shop',
    'food-drink': 'restaurant',
    'restaurants': 'restaurant'
  };
  
  return entityMap[category] || 'activity'; // Default to activity
}

// Handle publishing all approved items
async function handlePublishAllApproved() {
  try {
    console.log('🔍 handlePublishAllApproved called');
    const supabase = getSupabase();
    
    // Get all approved staging items
    const { data: stagingItems, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('status', 'approved');
    
    console.log('📊 Found approved items:', stagingItems?.length || 0);
    
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
        console.log(`🔄 Publishing item: ${item.title} (ID: ${item.id})`);
        
        // Transform staging item to activities format
        const baseData = {
          name: item.title,
          slug: generateSlug(item.title),
          description: item.raw_content?.description || '',
          short_overview: item.raw_content?.description || '',
          full_description: item.raw_content?.description || '',
          booking_url: '',
          rating: item.raw_content?.rating || 0,
          review_count: item.raw_content?.review_count || 0,
          price_range: item.raw_content?.price_range || '',
          opening_hours: Array.isArray(item.raw_content?.opening_hours) 
            ? item.raw_content.opening_hours.join(', ') 
            : item.raw_content?.opening_hours || '',
          location: 'Istanbul, Turkey',
          highlights: item.raw_content?.highlights || [],
          trip_advisor_url: item.source_urls?.[0] || '',
          address: item.raw_content?.address || 'Istanbul, Turkey',
          district: extractDistrict(item.raw_content?.address),
          is_featured: item.confidence_score >= 85,
          is_active: true,
          popularity_score: Math.floor(item.confidence_score || 50),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Add duration only for activities category
        const activityData = item.category === 'activities' 
          ? { ...baseData, duration: item.raw_content?.duration || '' }
          : baseData;

        // Determine target table based on category
        const targetTable = getTargetTable(item.category);
        
        // Insert into appropriate table based on category
        const { data: publishedActivity, error: publishError } = await supabase
          .from(targetTable)
          .insert(activityData)
          .select()
          .single();

        if (publishError) {
          console.error(`❌ Failed to publish "${item.title}":`, publishError);
          errors.push(`Failed to publish "${item.title}": ${publishError.message}`);
          continue;
        }

        console.log(`✅ Successfully published "${item.title}" to ${targetTable}`);

        // Add images to universal_media table
        if (item.images && item.images.length > 0) {
          const entityType = getEntityType(item.category);
          const mediaRecords = item.images.map((imageUrl: string, index: number) => ({
            entity_type: entityType,
            entity_id: publishedActivity.id,
            media_url: imageUrl,
            media_type: 'image',
            alt_text: `${item.title} image ${index + 1}`,
            is_primary: index === 0,
            sort_order: index + 1
          }));

          const { error: mediaError } = await supabase
            .from('universal_media')
            .insert(mediaRecords);

          if (mediaError) {
            console.error(`⚠️ Failed to insert media for "${item.title}":`, mediaError);
          }
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
        console.error(`❌ Error publishing "${item.title}":`, itemError);
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
    console.error('❌ handlePublishAllApproved error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
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