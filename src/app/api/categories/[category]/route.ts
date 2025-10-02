import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Cache for 60 seconds, revalidate in background
export const revalidate = 60

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params

    // Determine the correct table based on category
    const getTableName = (category: string) => {
      const tableMap: Record<string, string> = {
        'activities': 'activities',
        'hotels': 'hotels', 
        'shopping': 'shopping',
        'food-drink': 'restaurants'
      }
      return tableMap[category] || 'activities'
    }

    const tableName = getTableName(category)
    

    // Fetch data from the appropriate table with flexible column selection
    let selectColumns = `
      id,
      name,
      description,
      rating,
      review_count,
      location,
      district,
      price_range,
      price_from,
      price_to,
      currency,
      price_unit,
      duration,
      slug,
      is_featured,
      coordinates,
      created_at
    `

    // For tables that might not have all columns, use a more basic selection
    if (tableName === 'hotels' || tableName === 'shopping' || tableName === 'restaurants') {
      selectColumns = `
        id,
        name,
        description,
        rating,
        review_count,
        location,
        price_range,
        price_from,
        price_to,
        currency,
        price_unit,
        slug,
        is_featured,
        coordinates,
        created_at
      `
    }
    
    // Optimize query with limit for faster response
    const { data: activities, error } = await supabase
      .from(tableName)
      .select(selectColumns)
      .order('rating', { ascending: false })
      .limit(50) // Limit results for faster loading

    if (error) {
      console.error('Error fetching category data:', error)
      
      // If table doesn't exist or column doesn't exist, return empty results instead of error
      if (error.message.includes('Could not find the table') || 
          error.message.includes('relation') || 
          error.message.includes('does not exist') ||
          error.message.includes('column') ||
          error.code === '42703' ||
          error.code === 'PGRST205') {
        console.log(`Table ${tableName} doesn't exist or has schema issues, returning empty results`)
        const heroData = generateHeroData(category, [])
        return NextResponse.json({
          category,
          activities: [],
          heroData,
          filters: getDefaultFilters(),
          editorsPicks: [],
          totalCount: 0
        })
      }
      
      return NextResponse.json({ error: 'Failed to fetch category data', details: error.message }, { status: 500 })
    }

    console.log('Fetched activities:', activities?.length || 0)

    if (!activities || activities.length === 0) {
      // Generate hero data even when no activities exist
      const heroData = generateHeroData(category, [])
      
      return NextResponse.json({
        category,
        activities: [],
        heroData,
        filters: getDefaultFilters(),
        editorsPicks: [],
        totalCount: 0
      })
    }

    // Determine the correct entity type for media (must match actual database storage)
    const getEntityType = (category: string) => {
      const entityMap: Record<string, string> = {
        'activities': 'activity',
        'hotels': 'hotel',
        'shopping': 'shop', 
        'food-drink': 'restaurant'
      }
      return entityMap[category] || 'activity'
    }

    const entityType = getEntityType(category)

    // Optimize media fetch - get primary images first, then any images if no primary exists
    const activityIds = activities.map((a: any) => a.id)
    const { data: mediaData, error: mediaError } = await supabase
      .from('universal_media')
      .select('entity_id, media_url, is_primary, sort_order')
      .eq('entity_type', entityType)
      .in('entity_id', activityIds)
      // Remove the is_primary filter to get ALL images, we'll handle primary selection in code
      .order('sort_order', { ascending: true })

    if (mediaError) {
      console.error('Error fetching media:', mediaError)
    }

    // Attach images to activities
    const activitiesWithImages = activities.map(activity => ({
      ...activity,
      activity_images: mediaData?.filter(media => media.entity_id === activity.id) || []
    }))

    // Generate hero data
    const heroData = generateHeroData(category, activitiesWithImages)
    
    // Generate filters
    const filters = generateFilters(activitiesWithImages)
    
    // Get editor's picks (top 4 rated/featured)
    const editorsPicks = activitiesWithImages
      .filter(activity => activity.is_featured || activity.rating >= 4.5)
      .slice(0, 4)
      .map(activity => formatActivityForTile(activity, true)) // Pass true for isEditorPick
    
    // Format ALL activities for tiles (including editor's picks)
    const formattedActivities = activitiesWithImages
      .map(activity => {
        // Check if this activity is an editor's pick
        const isEditorPick = activity.is_featured || activity.rating >= 4.5
        return formatActivityForTile(activity, isEditorPick)
      })

    return NextResponse.json({
      category,
      activities: formattedActivities,
      heroData,
      filters,
      editorsPicks,
      totalCount: activities.length
    })

  } catch (error) {
    console.error('Category API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateHeroData(category: string, activities: any[]) {
  // Get highest rated activity for hero image
  const topActivity = activities[0]
  
  // Calculate average rating
  const avgRating = activities.length > 0 
    ? activities.reduce((sum, activity) => sum + (activity.rating || 0), 0) / activities.length
    : 0
  
  // Get top neighborhoods from district field
  const neighborhoods = [...new Set(activities
    .map(activity => activity.district)
    .filter(Boolean)
  )].slice(0, 3)
  
  // Check if trending (recently created activities)
  const recentCount = activities.filter(activity => {
    const createdDate = new Date(activity.created_at)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return createdDate > weekAgo
  }).length
  
  const isTrending = recentCount >= 3

  // Get hero image based on category
  const getHeroImage = (category: string, topActivity: any) => {
  const heroImages: Record<string, string> = {
    'activities': '/Hero - Activites.jpg',
    'shopping': '/Hero - shopping.jpg', 
    'hotels': '/Hero - Hotel.jpg',
    'food-drink': '/Hero - Food & Drink.jpg'
  }
    
    return heroImages[category] || '/istanbul-hero.jpg' // Default fallback
  }

  return {
    title: getCategoryTitle(category),
    subheading: getCategorySubheading(category, activities),
    heroImage: getHeroImage(category, topActivity),
    averageRating: Math.round(avgRating * 10) / 10,
    topNeighborhoods: neighborhoods,
    isTrending,
    activityCount: activities.length
  }
}

function generateFilters(activities: any[]) {
  // Extract unique neighborhoods from district field
  const neighborhoods = [...new Set(activities
    .map(activity => activity.district)
    .filter(Boolean)
  )].map(district => ({
    value: district.toLowerCase().replace(/\s+/g, '-'),
    label: district,
    count: activities.filter(a => a.district === district).length
  }))

  // Price ranges
  const priceRanges = [
    { value: 'free', label: 'Free', count: activities.filter(a => !a.price_range || a.price_range === 'Free').length },
    { value: 'budget', label: '₺ - ₺₺', count: activities.filter(a => a.price_range === 'Budget' || a.price_range === '₺').length },
    { value: 'mid', label: '₺₺₺', count: activities.filter(a => a.price_range === 'Mid-range' || a.price_range === '₺₺₺').length },
    { value: 'luxury', label: '₺₺₺₺', count: activities.filter(a => a.price_range === 'Luxury' || a.price_range === '₺₺₺₺').length }
  ].filter(range => range.count > 0)

  // Vibes (extracted from why_visit)
  const vibes = [
    { value: 'classic', label: 'Classic', count: 0 },
    { value: 'contemporary', label: 'Contemporary', count: 0 },
    { value: 'hidden-gem', label: 'Hidden Gem', count: 0 },
    { value: 'scenic-views', label: 'Scenic Views', count: 0 }
  ]

  // Durations
  const durations = [
    { value: '1-2-hours', label: '1-2 hours', count: activities.filter(a => a.duration && a.duration.includes('1-2')).length },
    { value: 'half-day', label: 'Half day', count: activities.filter(a => a.duration && a.duration.includes('Half')).length },
    { value: 'full-day', label: 'Full day', count: activities.filter(a => a.duration && a.duration.includes('Full')).length },
    { value: 'multi-day', label: 'Multi-day', count: activities.filter(a => a.duration && a.duration.includes('Multi')).length }
  ].filter(duration => duration.count > 0)

  // Amenities
  const amenities = [
    { value: 'wifi', label: 'WiFi', count: 0 },
    { value: 'parking', label: 'Parking', count: 0 },
    { value: 'accessibility', label: 'Accessible', count: activities.filter(a => a.accessibility?.wheelchair_accessible).length },
    { value: 'family-friendly', label: 'Family Friendly', count: activities.filter(a => a.accessibility?.family_friendly).length }
  ].filter(amenity => amenity.count > 0)

  return {
    neighborhoods,
    priceRanges,
    vibes,
    durations,
    amenities
  }
}

function formatActivityForTile(activity: any, isEditorPick: boolean = true) {
  // Get the primary image from activity_images, or first image if no primary
  const getActivityImage = (activity: any) => {
    if (activity.activity_images && activity.activity_images.length > 0) {
      // Find primary image first
      const primaryImage = activity.activity_images.find((img: any) => img.is_primary)
      if (primaryImage) {
        return primaryImage.media_url
      }
      // Fallback to first image (this will now work with our redistributed images)
      return activity.activity_images[0].media_url
    }
    // Fallback to hardcoded images if no database images
    const nameLower = (activity.name || activity.title || '').toLowerCase()
    if (nameLower.includes('hagia') || nameLower.includes('sophia')) {
      return '/Hagia Sophia.jpg'
    } else if (nameLower.includes('blue') || nameLower.includes('mosque')) {
      return '/Blue Mosque.jpg'
    } else if (nameLower.includes('grand') || nameLower.includes('bazaar')) {
      return '/Grand Bazaar.jpg'
    } else if (nameLower.includes('galata') || nameLower.includes('tower')) {
      return '/Galata Tower.jpg'
    } else if (nameLower.includes('topkapi') || nameLower.includes('palace')) {
      return '/Topkapi Palace.jpg'
    }
    return '/istanbul-hero.jpg' // Default fallback
  }

  return {
    id: activity.id,
    title: activity.name,
    description: activity.description,
    heroImage: getActivityImage(activity),
    rating: activity.rating,
    reviewCount: activity.review_count,
    location: activity.location,
    neighborhood: activity.district,
    price_range: activity.price_range || 'Free',
    price_from: activity.price_from,
    price_to: activity.price_to,
    currency: activity.currency,
    price_unit: activity.price_unit,
    duration: activity.duration || '2-3 hours',
    category: 'activities', // Default category since we don't have this field yet
    slug: activity.slug,
    coordinates: activity.coordinates,
    isEditorPick: isEditorPick
  }
}

function getCategoryTitle(category: string): string {
  const titles: Record<string, string> = {
    'activities': 'Activities in Istanbul',
    'hotels': 'Hotels in Istanbul',
    'food-drink': 'Food & Drink in Istanbul',
    'shopping': 'Shopping in Istanbul',
    'hammams': 'Hammams in Istanbul',
    'rooftops': 'Rooftops in Istanbul'
  }
  return titles[category] || `${category.charAt(0).toUpperCase() + category.slice(1)} in Istanbul`
}

function getCategorySubheading(category: string, activities: any[]): string {
  // Try to get from why_visit of top activities
  const topActivity = activities.find(a => a.why_visit)
  if (topActivity?.why_visit) {
    return topActivity.why_visit
  }

  // Fallback subheadings
  const fallbacks: Record<string, string> = {
    'activities': 'Discover Istanbul\'s most captivating experiences, from historic landmarks to hidden gems.',
    'hotels': 'Luxurious stays with Bosphorus views, boutique retreats, and historic palaces.',
    'food-drink': 'From traditional meze to modern fusion, Istanbul\'s culinary scene awaits.',
    'shopping': 'Explore centuries-old bazaars, contemporary boutiques, and artisanal treasures.',
    'hammams': 'Centuries-old sanctuaries of steam and marble, where tradition meets tranquility.',
    'rooftops': 'Golden-hour terraces and skyline views from Beyoğlu to Bebek.'
  }
  
  return fallbacks[category] || 'Experience the best of Istanbul\'s vibrant culture and heritage.'
}

function getDefaultFilters() {
  return {
    neighborhoods: [],
    priceRanges: [],
    vibes: [],
    durations: [],
    amenities: []
  }
}
