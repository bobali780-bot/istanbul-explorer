import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testUrl = searchParams.get('url') || 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=test&key=test'
    const searchTerm = searchParams.get('term') || 'Istanbul Modern'
    const category = searchParams.get('category') || 'activities'

    // Simulate the relevance validation logic
    const urlLower = testUrl.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    const searchWords = searchLower.split(' ').filter(word => word.length > 2)

    const urlPath = urlLower.replace(/https?:\/\/[^\/]+/, '').toLowerCase()

    let relevanceScore = 0
    let reasons: string[] = []

    // Check for venue name in URL
    const venueWords = searchWords
    let venueMatches = 0
    for (const word of venueWords) {
      if (urlPath.includes(word) || urlPath.includes(word.replace(/[^\w]/g, ''))) {
        venueMatches++
        relevanceScore += 30
      }
    }

    if (venueMatches > 0) {
      reasons.push(`Venue match: ${venueMatches}/${venueWords.length} words`)
    }

    // Source reputation
    if (urlLower.includes('googleusercontent.com') || urlLower.includes('maps.gstatic.com') || urlLower.includes('maps.googleapis.com')) {
      relevanceScore += 40
      reasons.push('Google Places official photo')
    } else if (urlLower.includes('wikimedia.org') || urlLower.includes('wikipedia.org')) {
      relevanceScore += 35
      reasons.push('Wikimedia Commons source')
    } else if (urlLower.includes('unsplash.com')) {
      relevanceScore += 25
      reasons.push('Unsplash curated photo')
    } else if (urlLower.includes('pexels.com')) {
      relevanceScore += 20
      reasons.push('Pexels stock photo')
    }

    // Calculate confidence and determine relevance
    const confidence = Math.max(0, Math.min(100, relevanceScore))
    
    // Much more lenient threshold for trusted sources
    const isRelevant = confidence >= (urlLower.includes('googleusercontent.com') || urlLower.includes('maps.gstatic.com') || urlLower.includes('maps.googleapis.com') ? 20 : 25)

    return NextResponse.json({
      success: true,
      data: {
        test_url: testUrl,
        search_term: searchTerm,
        category: category,
        analysis: {
          url_path: urlPath,
          search_words: searchWords,
          venue_matches: venueMatches,
          relevance_score: relevanceScore,
          confidence: confidence,
          is_relevant: isRelevant,
          reasons: reasons,
          threshold_used: urlLower.includes('googleusercontent.com') || urlLower.includes('maps.gstatic.com') || urlLower.includes('maps.googleapis.com') ? 20 : 25
        }
      }
    })

  } catch (error) {
    console.error('Error testing relevance:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to test relevance',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
