import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch all venues from all categories
export async function GET() {
  try {
    // Fetch from all tables in parallel
    const [activitiesRes, hotelsRes, restaurantsRes, shoppingRes] = await Promise.all([
      supabase
        .from('activities')
        .select('id, name, location, booking_url')
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('hotels')
        .select('id, name, location, booking_url')
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('restaurants')
        .select('id, name, location, booking_url')
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('shopping')
        .select('id, name, location, booking_url')
        .eq('is_active', true)
        .order('name')
    ])

    // Check for errors
    if (activitiesRes.error) throw activitiesRes.error
    if (hotelsRes.error) throw hotelsRes.error
    if (restaurantsRes.error) throw restaurantsRes.error
    if (shoppingRes.error) throw shoppingRes.error

    return NextResponse.json({
      success: true,
      data: {
        activities: activitiesRes.data || [],
        hotels: hotelsRes.data || [],
        restaurants: restaurantsRes.data || [],
        shopping: shoppingRes.data || []
      }
    })
  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch venues' },
      { status: 500 }
    )
  }
}

// POST - Update booking URL for a venue
export async function POST(request: Request) {
  try {
    const { category, venueId, bookingUrl } = await request.json()

    // Validate inputs
    if (!category || !venueId) {
      return NextResponse.json(
        { success: false, error: 'Category and venue ID are required' },
        { status: 400 }
      )
    }

    // Map category to table name
    const tableMap: { [key: string]: string } = {
      activities: 'activities',
      hotels: 'hotels',
      restaurants: 'restaurants',
      shopping: 'shopping'
    }

    const tableName = tableMap[category]
    if (!tableName) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Update the booking URL
    const { error } = await supabase
      .from(tableName)
      .update({ booking_url: bookingUrl || null })
      .eq('id', venueId)

    if (error) {
      console.error('Error updating booking URL:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update booking URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Booking URL updated successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/admin/booking-links:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking URL' },
      { status: 500 }
    )
  }
}
