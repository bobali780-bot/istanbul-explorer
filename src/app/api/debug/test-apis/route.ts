import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test Unsplash API
    if (process.env.UNSPLASH_ACCESS_KEY) {
      try {
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=istanbul&per_page=5&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
          {
            headers: {
              'User-Agent': 'Istanbul Explorer Bot 1.0'
            }
          }
        );
        
        if (unsplashResponse.ok) {
          const data = await unsplashResponse.json();
          results.tests.unsplash = {
            status: 'success',
            images_found: data.results?.length || 0,
            sample_url: data.results?.[0]?.urls?.regular || 'none'
          };
        } else {
          results.tests.unsplash = {
            status: 'failed',
            error: `HTTP ${unsplashResponse.status}: ${unsplashResponse.statusText}`
          };
        }
      } catch (error) {
        results.tests.unsplash = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } else {
      results.tests.unsplash = {
        status: 'skipped',
        reason: 'API key not configured'
      };
    }

    // Test Pexels API
    if (process.env.PEXELS_API_KEY) {
      try {
        const pexelsResponse = await fetch(
          'https://api.pexels.com/v1/search?query=istanbul&per_page=5',
          {
            headers: {
              'Authorization': process.env.PEXELS_API_KEY,
              'User-Agent': 'Istanbul Explorer Bot 1.0'
            }
          }
        );
        
        if (pexelsResponse.ok) {
          const data = await pexelsResponse.json();
          results.tests.pexels = {
            status: 'success',
            images_found: data.photos?.length || 0,
            sample_url: data.photos?.[0]?.src?.medium || 'none'
          };
        } else {
          results.tests.pexels = {
            status: 'failed',
            error: `HTTP ${pexelsResponse.status}: ${pexelsResponse.statusText}`
          };
        }
      } catch (error) {
        results.tests.pexels = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } else {
      results.tests.pexels = {
        status: 'skipped',
        reason: 'API key not configured'
      };
    }

    // Test Google Places API (basic test)
    if (process.env.GOOGLE_PLACES_API_KEY) {
      try {
        const placesResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=istanbul&key=${process.env.GOOGLE_PLACES_API_KEY}`
        );
        
        if (placesResponse.ok) {
          const data = await placesResponse.json();
          results.tests.google_places = {
            status: 'success',
            places_found: data.results?.length || 0,
            api_status: data.status
          };
        } else {
          results.tests.google_places = {
            status: 'failed',
            error: `HTTP ${placesResponse.status}: ${placesResponse.statusText}`
          };
        }
      } catch (error) {
        results.tests.google_places = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } else {
      results.tests.google_places = {
        status: 'skipped',
        reason: 'API key not configured'
      };
    }

    console.log('🧪 API Test Results:', results);

    return NextResponse.json({
      success: true,
      message: 'API tests completed',
      data: results
    });

  } catch (error) {
    console.error('❌ API test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test APIs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
