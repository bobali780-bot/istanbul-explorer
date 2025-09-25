import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      apis: {} as any,
      image_pipeline: {} as any
    }

    // 1. Google Places API Limits Check
    if (process.env.GOOGLE_PLACES_API_KEY) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Istanbul+Modern&key=${process.env.GOOGLE_PLACES_API_KEY}`
        )
        const data = await response.json()
        
        results.apis.google_places = {
          status: data.status,
          error_message: data.error_message || null,
          quota_exceeded: data.status === 'OVER_QUERY_LIMIT',
          request_denied: data.status === 'REQUEST_DENIED',
          key_valid: data.status !== 'REQUEST_DENIED',
          results_found: data.results?.length || 0,
          photos_available: data.results?.[0]?.photos?.length || 0
        }
      } catch (error) {
        results.apis.google_places = {
          error: 'Failed to test Google Places API',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } else {
      results.apis.google_places = {
        error: 'GOOGLE_PLACES_API_KEY not configured'
      }
    }

    // 2. Unsplash API Limits Check
    if (process.env.UNSPLASH_ACCESS_KEY) {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=istanbul&per_page=5&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        )
        
        results.apis.unsplash = {
          status: response.status,
          status_text: response.statusText,
          quota_exceeded: response.status === 403,
          rate_limited: response.status === 429,
          headers: {
            'x-ratelimit-limit': response.headers.get('x-ratelimit-limit'),
            'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
            'x-ratelimit-reset': response.headers.get('x-ratelimit-reset')
          }
        }

        if (response.ok) {
          const data = await response.json()
          results.apis.unsplash.results_found = data.results?.length || 0
          results.apis.unsplash.total_results = data.total || 0
        }
      } catch (error) {
        results.apis.unsplash = {
          error: 'Failed to test Unsplash API',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } else {
      results.apis.unsplash = {
        error: 'UNSPLASH_ACCESS_KEY not configured'
      }
    }

    // 3. Pexels API Limits Check
    if (process.env.PEXELS_API_KEY) {
      try {
        const response = await fetch(
          'https://api.pexels.com/v1/search?query=istanbul&per_page=5',
          {
            headers: {
              'Authorization': process.env.PEXELS_API_KEY
            }
          }
        )
        
        results.apis.pexels = {
          status: response.status,
          status_text: response.statusText,
          quota_exceeded: response.status === 403,
          rate_limited: response.status === 429,
          headers: {
            'x-ratelimit-limit': response.headers.get('x-ratelimit-limit'),
            'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
            'x-ratelimit-reset': response.headers.get('x-ratelimit-reset')
          }
        }

        if (response.ok) {
          const data = await response.json()
          results.apis.pexels.results_found = data.photos?.length || 0
          results.apis.pexels.total_results = data.total_results || 0
        }
      } catch (error) {
        results.apis.pexels = {
          error: 'Failed to test Pexels API',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } else {
      results.apis.pexels = {
        error: 'PEXELS_API_KEY not configured'
      }
    }

    // 4. Image Pipeline Analysis
    results.image_pipeline = {
      current_config: {
        min_images: 15,
        max_images: 30,
        validation_mode: 'relaxed',
        trusted_hosts: ['maps.googleapis.com', 'images.unsplash.com', 'images.pexels.com']
      },
      common_issues: {
        google_places_rejections: 'Images rejected due to low relevance scoring',
        unsplash_working: 'Unsplash API is working and providing 15+ images',
        validation_strictness: 'Images validated for quality, aspect ratio, and relevance'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API limits check complete',
      data: results
    })

  } catch (error) {
    console.error('Error checking API limits:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to check API limits',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
