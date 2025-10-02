import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { placeId, entityId, entityType } = await request.json()

    if (!placeId || !entityId || !entityType) {
      return NextResponse.json(
        { error: 'Missing required fields: placeId, entityId, entityType' },
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

    // Fetch place details with reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: `Google API error: ${data.status}`, details: data.error_message },
        { status: 500 }
      )
    }

    const reviews = data.result?.reviews || []

    if (reviews.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No reviews found for this place',
        count: 0
      })
    }

    // Delete existing Google reviews for this entity
    await supabase
      .from('universal_reviews')
      .delete()
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .eq('source', 'google')

    // Insert new reviews
    const reviewsToInsert = reviews.map((review: any) => ({
      entity_id: entityId,
      entity_type: entityType,
      reviewer_name: review.author_name,
      rating: review.rating,
      content: review.text,
      review_date: new Date(review.time * 1000).toISOString().split('T')[0], // Convert Unix timestamp to date
      source: 'google',
      source_url: review.author_url || null,
      reviewer_photo_url: review.profile_photo_url || null,
      created_at: new Date().toISOString()
    }))

    const { data: insertedReviews, error: insertError } = await supabase
      .from('universal_reviews')
      .insert(reviewsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting reviews:', insertError)
      return NextResponse.json(
        { error: 'Failed to save reviews to database', details: insertError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully fetched and saved ${reviews.length} reviews`,
      count: reviews.length,
      reviews: insertedReviews
    })

  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
