import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const categories = ['activities', 'hotels', 'restaurants', 'shopping']
    const results: any = {}

    for (const category of categories) {
      // Get all venues (just get everything to see structure)
      const { data: allVenues, error } = await supabase
        .from(category)
        .select('*')
        .limit(3)

      if (error) {
        results[category] = { error: error.message }
        continue
      }

      // Get total count
      const { count: totalCount } = await supabase
        .from(category)
        .select('*', { count: 'exact', head: true })

      // Get count with booking URLs
      const { count: withUrlCount } = await supabase
        .from(category)
        .select('*', { count: 'exact', head: true })
        .not('booking_url', 'is', null)

      // Get count without booking URLs (null or empty)
      const { data: allForCheck } = await supabase
        .from(category)
        .select('booking_url')

      const withoutUrlCount = allForCheck?.filter(v => !v.booking_url || v.booking_url.trim() === '').length || 0

      results[category] = {
        total: totalCount,
        withBookingUrls: withUrlCount,
        withoutBookingUrls: withoutUrlCount,
        sampleVenues: allVenues,
        columnNames: allVenues?.[0] ? Object.keys(allVenues[0]) : []
      }
    }

    return NextResponse.json({
      success: true,
      data: results
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
