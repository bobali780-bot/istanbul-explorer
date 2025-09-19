import { NextRequest, NextResponse } from 'next/server'
import { scrapeAllData } from '@/lib/firecrawl'

export async function GET(request: NextRequest) {
  try {
    console.log('🌐 API Route: Starting data scraping...')
    
    // Check if Firecrawl API key is available
    if (!process.env.FIRECRAWL_API_KEY) {
      console.error('❌ FIRECRAWL_API_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'Firecrawl API key not configured' },
        { status: 500 }
      )
    }

    // Scrape all data
    const scrapedData = await scrapeAllData()

    console.log('✅ API Route: Data scraping completed successfully')
    
    return NextResponse.json({
      success: true,
      data: scrapedData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ API Route: Error scraping data:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to scrape data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Optional: Add caching headers
export async function POST(request: NextRequest) {
  // Handle POST requests if needed for triggering scraping
  return GET(request)
}
