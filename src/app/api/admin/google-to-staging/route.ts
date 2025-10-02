import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface GooglePlaceData {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  price_level?: number
  types: string[]
  photos?: Array<{
    photo_reference: string
    html_attributions: string[]
  }>
  opening_hours?: {
    open_now: boolean
    weekday_text?: string[]
  }
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface AddToStagingRequest {
  places: GooglePlaceData[]
}

export async function POST(request: NextRequest) {
  try {
    const { places }: AddToStagingRequest = await request.json()

    if (!places || !Array.isArray(places) || places.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No places provided' 
      }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Places API key not configured' 
      }, { status: 500 })
    }

    const supabase = getSupabase()
    const processedPlaces = []

    for (const place of places) {
      try {
        console.log(`🔍 Processing place: ${place.name}`)

        // Get detailed place information using Place Details API
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,price_level,rating,user_ratings_total,reviews,photos,types,geometry,vicinity&key=${apiKey}`
        )

        if (!detailsResponse.ok) {
          console.error(`Failed to get details for ${place.name}`)
          continue
        }

        const detailsData = await detailsResponse.json()
        
        if (detailsData.status !== 'OK') {
          console.error(`Google Places Details API error for ${place.name}:`, detailsData.status)
          continue
        }

        const placeDetails = detailsData.result

        // Determine category based on place types
        const category = determineCategoryFromTypes(placeDetails.types || [])
        
        // Generate a unique slug
        const slug = generateSlug(placeDetails.name)

        // Match the existing scraping system's minimal staging_queue schema
        const primaryImage = placeDetails.photos?.[0] ? 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${placeDetails.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}` : 
          'https://koqqkpitepqwlfjymcje.supabase.co/storage/v1/object/public/brand-assets/placeholder.jpg'
        
        // Get up to 10 images from Google Places (increased from 5 for premium quality)
        const googleImages = placeDetails.photos?.slice(0, 10).map(photo => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        ) || []
        
        // Start with Google Places images, mark as loading for Unsplash enhancement
        const images = [...googleImages]

        // Prepare data exactly like the existing scraping system
        const stagingData = {
          title: placeDetails.name,
          category: category,
          primary_image: primaryImage,
          images: images, // JSONB array of strings
          confidence_score: 85, // Good confidence for Google Places data
          status: 'pending',
          raw_content: {
            // Core content fields - match existing scraping structure
            title: placeDetails.name,
            description: await generateDescription(placeDetails),
            short_overview: await generateShortOverview(placeDetails),
            full_description: await generateFullDescription(placeDetails),
            rating: placeDetails.rating || 0,
            review_count: placeDetails.user_ratings_total || 0,
            price_range: convertPriceLevel(placeDetails.price_level),
            opening_hours: formatOpeningHours(placeDetails.opening_hours),
            address: placeDetails.formatted_address,
            phone: placeDetails.formatted_phone_number || null,
            website_url: placeDetails.website || null,
            highlights: extractHighlights(placeDetails),
            
            // Google Places specific data
            google_place_id: place.place_id,
            google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            coordinates: placeDetails.geometry?.location ? 
              `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}` : null,
            vicinity: placeDetails.vicinity,
            place_types: placeDetails.types,
            
            // Metadata for tracking
            source: 'google_places_api',
            scraped_at: new Date().toISOString(),
            image_count: images.length,
            google_images_count: googleImages.length,
            target_image_count: 15, // Target: 10 Google + 5 Unsplash
            images_loading: true, // Will be set to false after Unsplash enhancement
            unsplash_images_pending: true,
            has_description: true,
            has_price: Boolean(placeDetails.price_level),
            has_location: Boolean(placeDetails.formatted_address),
            has_rating: Boolean(placeDetails.rating)
          }
        }

        // Insert into staging queue
        const { data: insertedPlace, error: insertError } = await supabase
          .from('staging_queue')
          .insert([stagingData])
          .select()
          .single()

        if (insertError) {
          console.error(`Failed to insert ${place.name} into staging:`, insertError)
          continue
        }

        console.log(`✅ Added ${place.name} to staging queue`)

        // Process Google Places photos (up to 10)
        if (placeDetails.photos && placeDetails.photos.length > 0) {
          await processPlacePhotos(insertedPlace.id, placeDetails.photos, apiKey, supabase)
        }

        // Enhance with Unsplash images asynchronously (don't wait for completion)
        enhanceWithUnsplashImages(insertedPlace.id, placeDetails.name, category, supabase).catch(error => {
          console.error(`⚠️ Unsplash enhancement failed for ${placeDetails.name}:`, error)
        })

        // Process reviews if available
        if (placeDetails.reviews && placeDetails.reviews.length > 0) {
          await processPlaceReviews(insertedPlace.id, placeDetails.reviews, supabase)
        }

        processedPlaces.push({
          id: insertedPlace.id,
          name: place.name,
          category: category,
          status: 'added_to_staging'
        })

      } catch (error) {
        console.error(`Error processing place ${place.name}:`, error)
        continue
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${processedPlaces.length} places to staging`,
      processed_places: processedPlaces,
      total_requested: places.length,
      total_processed: processedPlaces.length
    })

  } catch (error) {
    console.error('Google to staging API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process places' 
    }, { status: 500 })
  }
}

// Helper functions

function determineCategoryFromTypes(types: string[]): string {
  const categoryMap: Record<string, string> = {
    'tourist_attraction': 'activities',
    'museum': 'activities',
    'park': 'activities',
    'church': 'activities',
    'mosque': 'activities',
    'restaurant': 'restaurants',
    'food': 'restaurants',
    'meal_takeaway': 'restaurants',
    'cafe': 'restaurants',
    'lodging': 'hotels',
    'shopping_mall': 'shopping',
    'store': 'shopping',
    'clothing_store': 'shopping',
    'jewelry_store': 'shopping'
  }

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type]
    }
  }

  // Default fallback logic
  if (types.some(t => t.includes('food') || t.includes('restaurant') || t.includes('meal'))) {
    return 'restaurants'
  }
  if (types.some(t => t.includes('shop') || t.includes('store'))) {
    return 'shopping'
  }
  if (types.some(t => t.includes('lodging') || t.includes('hotel'))) {
    return 'hotels'
  }
  
  return 'activities' // Default category
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function generateDescription(placeDetails: any): Promise<string> {
  // Create a compelling description from available data
  const parts = []
  
  if (placeDetails.name) {
    parts.push(`${placeDetails.name} is`)
  }
  
  if (placeDetails.types) {
    const friendlyTypes = placeDetails.types
      .filter((type: string) => !type.includes('establishment') && !type.includes('point_of_interest'))
      .map((type: string) => type.replace(/_/g, ' '))
      .slice(0, 2)
    
    if (friendlyTypes.length > 0) {
      parts.push(`a renowned ${friendlyTypes.join(' and ')}`)
    }
  }
  
  if (placeDetails.vicinity || placeDetails.formatted_address) {
    parts.push(`located in ${placeDetails.vicinity || placeDetails.formatted_address}`)
  }
  
  if (placeDetails.rating && placeDetails.user_ratings_total) {
    parts.push(`Highly rated with ${placeDetails.rating} stars from ${placeDetails.user_ratings_total} reviews`)
  }
  
  return parts.join(' ') + '.'
}

async function generateShortOverview(placeDetails: any): Promise<string> {
  const overview = []
  
  if (placeDetails.rating) {
    overview.push(`★ ${placeDetails.rating} rating`)
  }
  
  if (placeDetails.price_level) {
    overview.push(`${convertPriceLevel(placeDetails.price_level)} price range`)
  }
  
  const topTypes = placeDetails.types
    ?.filter((type: string) => !type.includes('establishment') && !type.includes('point_of_interest'))
    ?.slice(0, 2)
    ?.map((type: string) => type.replace(/_/g, ' '))
  
  if (topTypes?.length > 0) {
    overview.push(topTypes.join(', '))
  }
  
  return overview.join(' • ')
}

async function generateFullDescription(placeDetails: any): Promise<string> {
  // Create a comprehensive description
  let description = await generateDescription(placeDetails)
  
  if (placeDetails.opening_hours?.weekday_text) {
    description += ` Open ${placeDetails.opening_hours.weekday_text[0] || 'daily'}.`
  }
  
  if (placeDetails.website) {
    description += ' Visit their website for more information.'
  }
  
  return description
}

function convertPriceLevel(priceLevel?: number): string {
  if (!priceLevel) return ''
  
  const levels: Record<number, string> = {
    1: 'Budget-friendly',
    2: 'Moderate',
    3: 'Expensive',
    4: 'Very Expensive'
  }
  
  return levels[priceLevel] || ''
}

function formatOpeningHours(openingHours?: any): string {
  if (!openingHours?.weekday_text) return ''
  
  return openingHours.weekday_text.join('\n')
}

function extractHighlights(placeDetails: any): string[] {
  const highlights = []
  
  if (placeDetails.rating && placeDetails.rating >= 4.5) {
    highlights.push('Highly Rated')
  }
  
  if (placeDetails.user_ratings_total && placeDetails.user_ratings_total > 1000) {
    highlights.push('Popular Destination')
  }
  
  if (placeDetails.price_level === 1) {
    highlights.push('Budget-Friendly')
  }
  
  if (placeDetails.types?.includes('tourist_attraction')) {
    highlights.push('Tourist Attraction')
  }
  
  return highlights
}

async function processPlacePhotos(placeId: number, photos: any[], apiKey: string, supabase: any) {
  // Process up to 10 photos (increased from 5 for premium quality)
  const photosToProcess = photos.slice(0, 10)
  
  for (let i = 0; i < photosToProcess.length; i++) {
    const photo = photosToProcess[i]
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`
    
    // Add to universal_media table
    await supabase
      .from('universal_media')
      .insert([{
        entity_type: 'staging_item',
        entity_id: placeId,
        media_url: photoUrl,
        media_type: 'image',
        is_primary: i === 0,
        sort_order: i,
        source: 'google_places',
        created_at: new Date().toISOString()
      }])
  }
  
  console.log(`📸 Added ${photosToProcess.length} photos for place ID ${placeId}`)
}

async function processPlaceReviews(placeId: number, reviews: any[], supabase: any) {
  // Process up to 3 most helpful reviews
  const reviewsToProcess = reviews
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
  
  for (const review of reviewsToProcess) {
    await supabase
      .from('universal_reviews')
      .insert([{
        entity_type: 'staging_item',
        entity_id: placeId,
        reviewer_name: review.author_name || 'Google User',
        rating: review.rating,
        review_text: review.text,
        source: 'google_places',
        created_at: new Date().toISOString()
      }])
  }
  
  console.log(`⭐ Added ${reviewsToProcess.length} reviews for place ID ${placeId}`)
}

async function enhanceWithUnsplashImages(placeId: number, placeName: string, category: string, supabase: any) {
  try {
    console.log(`🎨 Starting Unsplash enhancement for: ${placeName}`)
    
    // Create search query based on place name and category
    const searchQuery = `${placeName} ${category} Istanbul`
    
    // Fetch 5 additional images from Unsplash
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape&order_by=relevant`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    )

    if (!unsplashResponse.ok) {
      console.error(`❌ Unsplash API error for ${placeName}:`, unsplashResponse.status)
      return
    }

    const unsplashData = await unsplashResponse.json()
    const unsplashImages = unsplashData.results?.map((photo: any) => photo.urls.regular) || []

    if (unsplashImages.length === 0) {
      console.log(`📷 No Unsplash images found for: ${placeName}`)
      return
    }

    // Get current staging queue item
    const { data: currentItem, error: fetchError } = await supabase
      .from('staging_queue')
      .select('images, raw_content')
      .eq('id', placeId)
      .single()

    if (fetchError || !currentItem) {
      console.error(`❌ Failed to fetch staging item ${placeId}:`, fetchError)
      return
    }

    // Combine Google Places images with Unsplash images
    const currentImages = currentItem.images || []
    const enhancedImages = [...currentImages, ...unsplashImages]

    // Update raw_content to mark Unsplash enhancement as complete
    const updatedRawContent = {
      ...currentItem.raw_content,
      image_count: enhancedImages.length,
      unsplash_images_count: unsplashImages.length,
      images_loading: false,
      unsplash_images_pending: false,
      unsplash_enhanced_at: new Date().toISOString()
    }

    // Update the staging queue item
    const { error: updateError } = await supabase
      .from('staging_queue')
      .update({
        images: enhancedImages,
        raw_content: updatedRawContent
      })
      .eq('id', placeId)

    if (updateError) {
      console.error(`❌ Failed to update staging item ${placeId} with Unsplash images:`, updateError)
      return
    }

    // Add Unsplash images to universal_media table
    for (let i = 0; i < unsplashImages.length; i++) {
      const imageUrl = unsplashImages[i]
      
      await supabase.from('universal_media').insert([{
        entity_type: 'staging_queue',
        entity_id: placeId,
        media_type: 'image',
        media_url: imageUrl,
        media_source: 'unsplash',
        display_order: currentImages.length + i + 1, // Continue from Google Places images
        alt_text: `${placeName} - Image ${currentImages.length + i + 1}`,
        is_primary: false
      }])
    }

    console.log(`✨ Enhanced ${placeName} with ${unsplashImages.length} Unsplash images (Total: ${enhancedImages.length})`)

  } catch (error) {
    console.error(`⚠️ Unsplash enhancement error for ${placeName}:`, error)
  }
}
