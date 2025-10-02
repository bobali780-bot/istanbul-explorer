import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { venueName, location } = await request.json()

    if (!venueName) {
      return NextResponse.json(
        { error: 'Missing required field: venueName' },
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

    // Search for the place using Text Search
    const query = location ? `${venueName}, ${location}, Istanbul, Turkey` : `${venueName}, Istanbul, Turkey`
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: `Google API error: ${data.status}`, details: data.error_message },
        { status: 500 }
      )
    }

    if (data.status === 'ZERO_RESULTS' || !data.results || data.results.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No place found matching this name',
        placeId: null
      })
    }

    // Return the first (most relevant) result
    const place = data.results[0]

    return NextResponse.json({
      success: true,
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      location: place.geometry?.location
    })

  } catch (error) {
    console.error('Error finding place ID:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
