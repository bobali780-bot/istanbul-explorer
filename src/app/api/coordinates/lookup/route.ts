import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, location, category } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Place name is required' },
        { status: 400 }
      );
    }

    // Get Google Places API key from environment
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // Create search query - combine name and location for better results
    const query = `${name} ${location}`.trim();
    
    // Use Google Places Text Search API
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data);
      return NextResponse.json(
        { success: false, error: `Google Places API error: ${data.status}` },
        { status: 500 }
      );
    }

    if (data.results && data.results.length > 0) {
      // Get the first (most relevant) result
      const place = data.results[0];
      
      return NextResponse.json({
        success: true,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        placeId: place.place_id,
        formattedAddress: place.formatted_address,
        name: place.name
      });
    } else {
      // Try a more specific search with just the name
      const fallbackQuery = name;
      const fallbackUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(fallbackQuery)}&key=${apiKey}`;
      
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json();

      if (fallbackData.results && fallbackData.results.length > 0) {
        const place = fallbackData.results[0];
        
        return NextResponse.json({
          success: true,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          placeId: place.place_id,
          formattedAddress: place.formatted_address,
          name: place.name
        });
      }

      return NextResponse.json(
        { success: false, error: 'No coordinates found for this place' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Coordinate lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while looking up coordinates' },
      { status: 500 }
    );
  }
}
