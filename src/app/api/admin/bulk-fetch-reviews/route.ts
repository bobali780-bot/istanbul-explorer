import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json()

    if (!category || !['shopping', 'hotels', 'restaurants', 'activities'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: shopping, hotels, restaurants, or activities' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      )
    }

    // Fetch all venues from the category
    const { data: venues, error: venuesError } = await supabase
      .from(category)
      .select('id, name, location, google_place_id')
      .eq('is_active', true)

    if (venuesError || !venues) {
      return NextResponse.json(
        { error: 'Failed to fetch venues', details: venuesError },
        { status: 500 }
      )
    }

    const results = {
      total: venues.length,
      processed: 0,
      placeIdsFound: 0,
      reviewsFetched: 0,
      errors: [] as any[]
    }

    // Entity type mapping
    const entityTypeMap: { [key: string]: string } = {
      'activities': 'activity',
      'hotels': 'hotel',
      'shopping': 'shop',
      'restaurants': 'restaurant'
    }
    const entityType = entityTypeMap[category]

    // Process each venue
    for (const venue of venues) {
      results.processed++

      try {
        let placeId = venue.google_place_id

        // If no Place ID, find it
        if (!placeId) {
          const searchQuery = venue.location
            ? `${venue.name}, ${venue.location}, Istanbul, Turkey`
            : `${venue.name}, Istanbul, Turkey`

          const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`

          await delay(100) // Rate limiting
          const searchResponse = await fetch(searchUrl)
          const searchData = await searchResponse.json()

          if (searchData.status === 'OK' && searchData.results && searchData.results.length > 0) {
            placeId = searchData.results[0].place_id

            // Save Place ID to database
            await supabase
              .from(category)
              .update({ google_place_id: placeId })
              .eq('id', venue.id)

            results.placeIdsFound++
          } else {
            results.errors.push({
              venueId: venue.id,
              venueName: venue.name,
              error: 'No Place ID found'
            })
            continue
          }
        }

        // Fetch reviews for this Place ID
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`

        await delay(100) // Rate limiting
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        if (detailsData.status === 'OK' && detailsData.result?.reviews) {
          const reviews = detailsData.result.reviews

          // Delete existing Google reviews
          await supabase
            .from('universal_reviews')
            .delete()
            .eq('entity_id', venue.id)
            .eq('entity_type', entityType)
            .eq('source', 'google')

          // Insert new reviews
          const reviewsToInsert = reviews.map((review: any) => ({
            entity_id: venue.id,
            entity_type: entityType,
            reviewer_name: review.author_name,
            rating: review.rating,
            content: review.text,
            review_date: new Date(review.time * 1000).toISOString().split('T')[0],
            source: 'google',
            source_url: review.author_url || null,
            reviewer_photo_url: review.profile_photo_url || null,
            created_at: new Date().toISOString()
          }))

          await supabase
            .from('universal_reviews')
            .insert(reviewsToInsert)

          results.reviewsFetched += reviews.length
        }

      } catch (error) {
        results.errors.push({
          venueId: venue.id,
          venueName: venue.name,
          error: String(error)
        })
      }
    }

    return NextResponse.json({
      success: true,
      category,
      results
    })

  } catch (error) {
    console.error('Error in bulk fetch reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
