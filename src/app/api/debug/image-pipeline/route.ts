import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const term = searchParams.get('term') || 'Istanbul Modern'
    const targetImages = parseInt(searchParams.get('images') || '15')

    console.log(`🔍 Analyzing image pipeline for "${term}" (target: ${targetImages} images)`)

    // Test the actual image pipeline
    const pipelineResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/admin/scrape-hybrid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchTerms: [term],
        category: 'activities',
        imagesPerItem: targetImages,
        isReScrape: false
      })
    })

    const pipelineData = await pipelineResponse.json()
    
    // Analyze the results
    const analysis = {
      timestamp: new Date().toISOString(),
      search_term: term,
      target_images: targetImages,
      pipeline_results: {
        success: pipelineData.success,
        images_returned: pipelineData.item?.images?.length || 0,
        confidence_score: pipelineData.item?.confidence_score || 0,
        sources_used: {} as any,
        validation_stats: {},
        issues_found: []
      },
      api_status: {
        google_places: 'Unknown',
        unsplash: 'Unknown', 
        pexels: 'Unknown'
      },
      recommendations: [] as string[]
    }

    // Extract source information from logs (this would need to be enhanced)
    if (pipelineData.success && pipelineData.item) {
      const images = pipelineData.item.images || []
      
      // Analyze image sources
      const googleImages = images.filter((url: string) => url.includes('maps.googleapis.com')).length
      const unsplashImages = images.filter((url: string) => url.includes('images.unsplash.com')).length
      const pexelsImages = images.filter((url: string) => url.includes('images.pexels.com')).length
      const otherImages = images.length - googleImages - unsplashImages - pexelsImages

      analysis.pipeline_results.sources_used = {
        google_places: googleImages,
        unsplash: unsplashImages,
        pexels: pexelsImages,
        other: otherImages,
        total: images.length
      }

      // Generate recommendations
      if (images.length < targetImages) {
        analysis.recommendations.push(`⚠️ Only got ${images.length}/${targetImages} images - consider checking API limits`)
      }
      
      if (googleImages === 0) {
        analysis.recommendations.push('🔍 Google Places images not found - check API key and billing')
      }
      
      if (unsplashImages === 0) {
        analysis.recommendations.push('🎨 Unsplash images not found - check API key')
      }

      if (images.length >= targetImages) {
        analysis.recommendations.push('✅ Image pipeline working correctly')
      }
    }

    // Check individual API status
    try {
      // Google Places check
      if (process.env.GOOGLE_PLACES_API_KEY) {
        const gpResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(term)}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        )
        const gpData = await gpResponse.json()
        analysis.api_status.google_places = gpData.status === 'OK' ? 'Working' : `Error: ${gpData.status}`
      } else {
        analysis.api_status.google_places = 'API key not configured'
      }
    } catch (error) {
      analysis.api_status.google_places = 'Failed to test'
    }

    try {
      // Unsplash check
      if (process.env.UNSPLASH_ACCESS_KEY) {
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=5&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        )
        analysis.api_status.unsplash = unsplashResponse.ok ? 'Working' : `Error: ${unsplashResponse.status}`
      } else {
        analysis.api_status.unsplash = 'API key not configured'
      }
    } catch (error) {
      analysis.api_status.unsplash = 'Failed to test'
    }

    try {
      // Pexels check
      if (process.env.PEXELS_API_KEY) {
        const pexelsResponse = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=5`,
          {
            headers: {
              'Authorization': process.env.PEXELS_API_KEY
            }
          }
        )
        analysis.api_status.pexels = pexelsResponse.ok ? 'Working' : `Error: ${pexelsResponse.status}`
      } else {
        analysis.api_status.pexels = 'API key not configured'
      }
    } catch (error) {
      analysis.api_status.pexels = 'Failed to test'
    }

    return NextResponse.json({
      success: true,
      message: 'Image pipeline analysis complete',
      data: analysis
    })

  } catch (error) {
    console.error('Error analyzing image pipeline:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to analyze image pipeline',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
