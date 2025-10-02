import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { activityId, activityName, location } = await request.json();

    if (!activityId || !activityName) {
      return NextResponse.json({ success: false, error: 'Activity ID and name are required' }, { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    console.log('Google API Key found:', googleApiKey ? 'Yes' : 'No');
    if (!googleApiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY is not set');
    }

    // Search for the place using Google Places API
    // Try multiple search strategies for better results
    const searchQueries = [
      `${activityName}, Istanbul, Turkey`,
      `${activityName}, Turkey`,
      activityName
    ];
    
    // Try each search query until we find a result
    let findPlaceData = null;
    let successfulQuery = null;
    
    for (const query of searchQueries) {
      console.log('Trying search query:', query);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address,types&key=${googleApiKey}`
      );
      
      const data = await response.json();
      console.log('Google Places response for query:', query, data);
      
      if (data.status === 'OK' && data.candidates.length > 0) {
        findPlaceData = data;
        successfulQuery = query;
        break;
      }
    }

    if (!findPlaceData || findPlaceData.candidates.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Place not found in Google Places. Try a more specific search term.',
        status: 'not_found'
      });
    }

    const place = findPlaceData.candidates[0];
    
    // Get detailed information about the place
    const detailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,types,url&key=${googleApiKey}`
    );
    
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK') {
      return NextResponse.json({
        success: false,
        error: 'Failed to get place details',
        status: 'error'
      });
    }

    const placeDetails = detailsData.result;

    // Generate potential booking URLs using known patterns
    const bookingSuggestions = generateBookingSuggestions(placeDetails.name, placeDetails.place_id);

    return NextResponse.json({
      success: true,
      data: {
        google_place_id: placeDetails.place_id,
        official_website: placeDetails.website || null,
        formatted_address: placeDetails.formatted_address,
        types: placeDetails.types || [],
        google_url: placeDetails.url,
        booking_suggestions: bookingSuggestions,
        status: 'found'
      }
    });

  } catch (error) {
    console.error('Booking discovery error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate realistic booking search URLs
function generateBookingSuggestions(placeName: string, placeId: string) {
  const suggestions = [];
  
  // Clean place name for search
  const searchName = encodeURIComponent(placeName);

  // Expedia search
  suggestions.push({
    platform: 'expedia',
    url: `https://www.expedia.com/things-to-do/search?location=Istanbul&q=${searchName}`,
    description: 'Search on Expedia'
  });

  // Viator search
  suggestions.push({
    platform: 'viator',
    url: `https://www.viator.com/Istanbul/d585-ttd/search?q=${searchName}`,
    description: 'Search on Viator'
  });

  // GetYourGuide search
  suggestions.push({
    platform: 'getyourguide',
    url: `https://www.getyourguide.com/istanbul-l56/search?q=${searchName}`,
    description: 'Search on GetYourGuide'
  });

  // Tiqets search
  suggestions.push({
    platform: 'tiqets',
    url: `https://www.tiqets.com/en/istanbul-attractions-c71561/search?q=${searchName}`,
    description: 'Search on Tiqets'
  });

  return suggestions;
}
