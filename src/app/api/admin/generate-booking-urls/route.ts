import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getDefaultBookingUrl } from '@/lib/booking-urls'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST - Auto-generate booking URLs for all venues
export async function POST(request: Request) {
  try {
    const { category } = await request.json()

    // Validate category
    const validCategories = ['activities', 'hotels', 'restaurants', 'shopping']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Fetch all venues in category that don't have booking URLs (null or empty string)
    const { data: venues, error: fetchError } = await supabase
      .from(category)
      .select('id, name, location, booking_url')
      .eq('is_active', true)

    // Filter for venues without URLs (null or empty)
    const venuesWithoutUrls = venues?.filter(v => !v.booking_url || v.booking_url.trim() === '') || []

    if (fetchError) {
      console.error('Error fetching venues:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch venues' },
        { status: 500 }
      )
    }

    if (!venuesWithoutUrls || venuesWithoutUrls.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No venues need booking URLs',
        updated: 0
      })
    }

    // Generate and update URLs for each venue
    const updates = venuesWithoutUrls.map(async (venue) => {
      const bookingUrl = getDefaultBookingUrl(
        venue.name,
        category as 'activities' | 'hotels' | 'restaurants' | 'shopping',
        venue.location || 'Istanbul'
      )

      return supabase
        .from(category)
        .update({ booking_url: bookingUrl })
        .eq('id', venue.id)
    })

    const results = await Promise.all(updates)

    // Check for errors
    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('Some updates failed:', errors)
      return NextResponse.json(
        {
          success: false,
          error: `${errors.length} updates failed`,
          updated: results.length - errors.length
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Generated booking URLs for ${venuesWithoutUrls.length} venues`,
      updated: venuesWithoutUrls.length
    })

  } catch (error) {
    console.error('Error generating booking URLs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate booking URLs' },
      { status: 500 }
    )
  }
}

// GET - Generate URL for all categories
export async function GET() {
  try {
    const categories = ['activities', 'hotels', 'restaurants', 'shopping']
    let totalUpdated = 0

    for (const category of categories) {
      // Fetch venues without booking URLs
      const { data: venues, error: fetchError } = await supabase
        .from(category)
        .select('id, name, location, booking_url')
        .eq('is_active', true)

      if (fetchError) {
        console.error(`Error fetching ${category}:`, fetchError)
        continue
      }

      // Filter for venues without URLs (null or empty)
      const venuesWithoutUrls = venues?.filter(v => !v.booking_url || v.booking_url.trim() === '') || []

      if (!venuesWithoutUrls || venuesWithoutUrls.length === 0) continue

      // Generate and update URLs
      const updates = venuesWithoutUrls.map(async (venue) => {
        const bookingUrl = getDefaultBookingUrl(
          venue.name,
          category as 'activities' | 'hotels' | 'restaurants' | 'shopping',
          venue.location || 'Istanbul'
        )

        return supabase
          .from(category)
          .update({ booking_url: bookingUrl })
          .eq('id', venue.id)
      })

      await Promise.all(updates)
      totalUpdated += venuesWithoutUrls.length
    }

    return NextResponse.json({
      success: true,
      message: `Generated booking URLs for ${totalUpdated} venues across all categories`,
      updated: totalUpdated
    })

  } catch (error) {
    console.error('Error in bulk generation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate booking URLs' },
      { status: 500 }
    )
  }
}
