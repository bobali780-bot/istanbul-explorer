import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    console.log('🔄 Starting image backfill from staging...');

    const results = {
      activities: await backfillCategory('activities', 'activity'),
      hotels: await backfillCategory('hotels', 'hotel'),
      shopping: await backfillCategory('shopping', 'shop'),
      restaurants: await backfillCategory('restaurants', 'restaurant')
    };

    return NextResponse.json({
      success: true,
      message: 'Image backfill completed',
      results
    });

  } catch (error) {
    console.error('Backfill error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function backfillCategory(table: string, entityType: string) {
  const updated: string[] = [];
  const errors: string[] = [];

  // Get all published items from this table
  const { data: items, error: itemsError } = await supabase
    .from(table)
    .select('id, name');

  if (itemsError) throw itemsError;

  for (const item of items || []) {
    try {
      // Check current image count
      const { count: currentCount } = await supabase
        .from('universal_media')
        .select('*', { count: 'exact', head: true })
        .eq('entity_type', entityType)
        .eq('entity_id', item.id);

      console.log(`📸 ${item.name}: ${currentCount} images currently`);

      // Only backfill if we have fewer than 10 images
      if ((currentCount || 0) >= 10) {
        console.log(`✅ ${item.name}: Already has enough images`);
        continue;
      }

      // Find matching staging item by name - try multiple matching strategies
      // Strategy 1: Exact match (check ALL statuses, not just published)
      let { data: stagingItems } = await supabase
        .from('staging_queue')
        .select('id, title, images, category, status')
        .ilike('title', item.name)
        .limit(1);

      // Strategy 2: Try removing special characters and extra words
      if (!stagingItems || stagingItems.length === 0) {
        const cleanName = item.name
          .replace(/Alışveriş Merkezi/i, '')
          .replace(/Shopping Mall/i, '')
          .replace(/AVM/i, '')
          .trim();

        const { data: altItems } = await supabase
          .from('staging_queue')
          .select('id, title, images, category, status')
          .ilike('title', `%${cleanName}%`)
          .limit(1);

        stagingItems = altItems;
      }

      // Strategy 3: Try first word match for shopping centers
      if (!stagingItems || stagingItems.length === 0) {
        const firstWord = item.name.split(' ')[0];
        if (firstWord.length > 3) {
          const { data: partialItems } = await supabase
            .from('staging_queue')
            .select('id, title, images, category, status')
            .ilike('title', `${firstWord}%`)
            .limit(1);

          stagingItems = partialItems;
        }
      }

      if (!stagingItems || stagingItems.length === 0) {
        console.log(`⚠️ ${item.name}: No matching staging item found after trying all strategies`);
        continue;
      }

      const stagingItem = stagingItems[0];

      console.log(`🔗 ${item.name} matched with "${stagingItem.title}" (status: ${stagingItem.status})`);

      if (!stagingItem.images || stagingItem.images.length === 0) {
        console.log(`⚠️ ${item.name}: Staging item has no images`);
        continue;
      }

      console.log(`📥 ${item.name}: Found ${stagingItem.images.length} images in staging`);

      // Delete existing images first
      await supabase
        .from('universal_media')
        .delete()
        .eq('entity_type', entityType)
        .eq('entity_id', item.id);

      // Insert all images from staging
      const mediaRecords = stagingItem.images.map((imageUrl: string, index: number) => ({
        entity_type: entityType,
        entity_id: item.id,
        media_url: imageUrl,
        media_type: 'image',
        alt_text: `${item.name} image ${index + 1}`,
        is_primary: index === 0,
        sort_order: index + 1
      }));

      const { error: mediaError } = await supabase
        .from('universal_media')
        .insert(mediaRecords);

      if (mediaError) {
        console.error(`❌ ${item.name}: Failed to insert images:`, mediaError);
        errors.push(`${item.name}: ${mediaError.message}`);
        continue;
      }

      console.log(`✅ ${item.name}: Added ${stagingItem.images.length} images`);
      updated.push(`${item.name} (${stagingItem.images.length} images)`);

    } catch (error) {
      console.error(`❌ Error processing ${item.name}:`, error);
      errors.push(`${item.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    table,
    total: items?.length || 0,
    updated: updated.length,
    items_updated: updated,
    errors
  };
}
