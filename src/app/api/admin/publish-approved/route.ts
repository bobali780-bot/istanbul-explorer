import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    console.log('🚀 Starting bulk publish of all approved items...')

    // Get all approved items from staging
    const { data: approvedItems, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('status', 'approved')

    if (fetchError) {
      console.error('❌ Error fetching approved items:', fetchError)
      return Response.json({ error: 'Failed to fetch approved items' }, { status: 500 })
    }

    if (!approvedItems || approvedItems.length === 0) {
      console.log('ℹ️ No approved items found to publish')
      return Response.json({ message: 'No approved items found to publish' })
    }

    console.log(`📋 Found ${approvedItems.length} approved items to publish`)

    let publishedCount = 0
    let errors: string[] = []

    // Process each approved item
    for (const item of approvedItems) {
      try {
        console.log(`📤 Publishing: ${item.title} (${item.category})`)

        // Determine target table
        const targetTable = getTargetTable(item.category)
        
        // Prepare data for main table
        const publishData = preparePublishData(item)
        
        // Insert into main table
        const { data: publishedItem, error: publishError } = await supabase
          .from(targetTable)
          .insert([publishData])
          .select()
          .single()

        if (publishError) {
          console.error(`❌ Failed to publish ${item.title}:`, publishError)
          errors.push(`${item.title}: ${publishError.message}`)
          continue
        }

        // Copy images to universal_media for the published item
        if (item.images && item.images.length > 0) {
          await copyImagesToUniversalMedia(item, publishedItem, targetTable)
        }

        // Update staging item status to 'published'
        await supabase
          .from('staging_queue')
          .update({ status: 'published' })
          .eq('id', item.id)

        publishedCount++
        console.log(`✅ Successfully published: ${item.title}`)

      } catch (error) {
        console.error(`❌ Error publishing ${item.title}:`, error)
        errors.push(`${item.title}: ${error}`)
      }
    }

    console.log(`🎉 Bulk publish complete: ${publishedCount}/${approvedItems.length} items published`)

    return Response.json({
      success: true,
      published: publishedCount,
      total: approvedItems.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully published ${publishedCount} out of ${approvedItems.length} approved items`
    })

  } catch (error) {
    console.error('❌ Unexpected error during bulk publish:', error)
    return Response.json({ error: 'Unexpected error during bulk publish' }, { status: 500 })
  }
}

function getTargetTable(category: string): string {
  const tableMap: { [key: string]: string } = {
    'activities': 'activities',
    'hotels': 'hotels',
    'shopping': 'shopping',
    'restaurants': 'restaurants',
    'food-drink': 'restaurants'
  }
  return tableMap[category] || 'activities'
}

function preparePublishData(item: any) {
  const rawContent = item.raw_content || {}
  
  const baseData = {
    name: item.title, // Map title to name column
    title: item.title,
    slug: item.slug || generateSlug(item.title),
    description: rawContent.description || rawContent.short_overview || 'Discover this amazing place in Istanbul',
    short_overview: rawContent.short_overview || rawContent.description || 'A must-visit destination in Istanbul',
    full_description: rawContent.full_description || rawContent.description || 'Experience the best of Istanbul at this incredible location',
    rating: rawContent.rating || 4.5,
    review_count: rawContent.review_count || 100,
    price_range: rawContent.price_range || rawContent.menu_price_range || '$$',
    opening_hours: rawContent.opening_hours || 'Daily 9:00 AM - 6:00 PM',
    location: rawContent.location || 'Istanbul, Turkey',
    address: rawContent.address || 'Istanbul, Turkey',
    phone: rawContent.phone || '',
    website_url: rawContent.website_url || '',
    google_maps_url: rawContent.google_maps_url || '',
    coordinates: rawContent.coordinates || { lat: 41.0082, lng: 28.9784 },
    is_featured: Math.random() > 0.7, // 30% chance of being featured
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Add category-specific fields
  if (item.category === 'activities') {
    return {
      ...baseData,
      duration: rawContent.duration || '2-3 hours',
      district: rawContent.district || 'Historic Peninsula'
    }
  }

  // For hotels, shopping, restaurants - no duration field
  return baseData
}

async function copyImagesToUniversalMedia(stagingItem: any, publishedItem: any, targetTable: string) {
  try {
    const images = stagingItem.images || []
    
    // Convert table name to correct entity type (must match API expectations)
    const getEntityType = (tableName: string) => {
      const entityMap: { [key: string]: string } = {
        'activities': 'activity',
        'hotels': 'hotel',
        'shopping': 'shop',
        'restaurants': 'restaurant'
      }
      return entityMap[tableName] || 'activity'
    }
    
    const entityType = getEntityType(targetTable)
    
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i]
      
      await supabase.from('universal_media').insert([{
        entity_type: entityType, // Use correct singular entity type
        entity_id: publishedItem.id,
        media_type: 'image',
        media_url: imageUrl,
        media_source: i === 0 ? 'primary' : 'gallery',
        display_order: i + 1,
        alt_text: `${publishedItem.title || publishedItem.name} - Image ${i + 1}`,
        is_primary: i === 0
      }])
    }
    
    console.log(`📸 Copied ${images.length} images for ${publishedItem.title || publishedItem.name}`)
  } catch (error) {
    console.error(`⚠️ Error copying images for ${publishedItem.title || publishedItem.name}:`, error)
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
