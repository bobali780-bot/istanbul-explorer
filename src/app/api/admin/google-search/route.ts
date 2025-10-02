import { NextRequest, NextResponse } from 'next/server'

interface SearchRequest {
  query: string
  location?: string
  radius?: number
  types?: string[]
}

interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  rating: number
  price_level?: number
  types: string[]
  photos?: any[]
  opening_hours?: any
  geometry: any
}

export async function POST(request: NextRequest) {
  try {
    const { query, location = "41.0082,28.9784", radius = 50000, types = [] }: SearchRequest = await request.json()

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query must be at least 2 characters' 
      }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Places API key not configured' 
      }, { status: 500 })
    }

    // Enhanced search strategy - Use Nearby Search for hotels, Text Search for others
    const isHotelSearch = query.toLowerCase().includes('hotel') || query.toLowerCase().includes('lodging') || query.toLowerCase().includes('accommodation')
    
    let searchUrl: string
    let params: URLSearchParams
    
    if (isHotelSearch) {
      // Use Nearby Search API for hotels - much better results!
      searchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
      params = new URLSearchParams({
        location,
        radius: '50000', // 50km radius covers all of Istanbul
        type: 'lodging',
        key: apiKey,
        fields: 'place_id,name,formatted_address,rating,price_level,types,photos,opening_hours,geometry'
      })
      
      // Add keyword if it's a specific hotel search
      if (query !== 'hotel' && query !== 'hotels') {
        params.append('keyword', query.replace(/\s*hotel\s*/gi, '').trim())
      }
    } else {
      // Use Text Search for non-hotel searches
      searchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
      params = new URLSearchParams({
        query: `${query} in Istanbul`,
        location,
        radius: radius.toString(),
        key: apiKey,
        fields: 'place_id,name,formatted_address,rating,price_level,types,photos,opening_hours,geometry'
      })

      // Add types filter if specified
      if (types.length > 0) {
        params.append('type', types.join('|'))
      }
    }

    console.log('🔍 Google Places Search:', {
      api: isHotelSearch ? 'Nearby Search' : 'Text Search',
      query: isHotelSearch ? `lodging near ${location}` : `${query} in Istanbul`,
      location,
      radius: isHotelSearch ? '50000' : radius,
      types: isHotelSearch ? ['lodging'] : types
    })

    const response = await fetch(`${searchUrl}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message)
      return NextResponse.json({ 
        success: false, 
        error: `Google Places API error: ${data.status}` 
      }, { status: 500 })
    }

    // Filter, enhance, and sort results by rating (highest first)
    const filteredResults: PlaceResult[] = (data.results || [])
      .map((place: any): PlaceResult => ({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        rating: place.rating || 0, // Default to 0 if no rating
        price_level: place.price_level,
        types: place.types || [],
        photos: place.photos ? place.photos.slice(0, 3) : [], // Limit photos
        opening_hours: place.opening_hours,
        geometry: place.geometry
      }))
      .sort((a: PlaceResult, b: PlaceResult) => {
        // Sort by rating (highest first), then by name if ratings are equal
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return a.name.localeCompare(b.name)
      })
      .slice(0, 10) // Take top 10 after sorting

    // Log results with rating info
    const ratingInfo = filteredResults.length > 0 
      ? `(★${filteredResults[0].rating} to ★${filteredResults[filteredResults.length - 1].rating})`
      : ''
    console.log(`✅ Found ${filteredResults.length} places for "${query}" ${ratingInfo}`)

    return NextResponse.json({
      success: true,
      results: filteredResults,
      total_results: data.results?.length || 0
    })

  } catch (error) {
    console.error('Google search API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to search places' 
    }, { status: 500 })
  }
}
