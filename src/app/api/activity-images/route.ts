import { NextResponse } from 'next/server'
import FirecrawlService from '@/lib/firecrawl'

export async function GET() {
  try {
    console.log('🖼️ API: Starting activity images fetch...')

    const firecrawl = new FirecrawlService()
    const activityImages = await firecrawl.searchActivity('Istanbul attractions')

    console.log(`✅ API: Successfully compiled ${activityImages.length} activity image collections`)

    return NextResponse.json({
      success: true,
      count: activityImages.length,
      data: activityImages,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ API Error fetching activity images:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch activity images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}