import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get recent staging items to check their descriptions
    const { data: items, error } = await supabase
      .from('staging_queue')
      .select('id, title, raw_content')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract description information from raw_content
    const descriptionInfo = items?.map(item => ({
      id: item.id,
      title: item.title,
      hasRawContent: !!item.raw_content,
      rawContentKeys: item.raw_content ? Object.keys(item.raw_content) : [],
      description: item.raw_content?.description || null,
      firecrawlEnriched: item.raw_content?.firecrawl_enriched || null,
      hasDescription: !!item.raw_content?.description,
      descriptionLength: item.raw_content?.description?.length || 0
    }))

    return NextResponse.json({
      success: true,
      items: descriptionInfo,
      summary: {
        totalItems: items?.length || 0,
        itemsWithDescriptions: descriptionInfo?.filter(item => item.hasDescription).length || 0,
        itemsWithFirecrawlData: descriptionInfo?.filter(item => item.firecrawlEnriched).length || 0
      }
    })

  } catch (error) {
    console.error('Error checking descriptions:', error)
    return NextResponse.json({ 
      error: 'Failed to check descriptions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
