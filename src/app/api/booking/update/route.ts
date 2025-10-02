import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function POST(request: Request) {
  try {
    const { 
      activityId, 
      bookingUrl, 
      bookingPlatform, 
      bookingStatus, 
      googlePlaceId, 
      officialWebsite, 
      bookingNotes 
    } = await request.json();

    if (!activityId) {
      return NextResponse.json({ success: false, error: 'Activity ID is required' }, { status: 400 });
    }

    // Update the activity with booking information
    const updateData: any = {
      booking_status: bookingStatus || 'pending'
    };

    if (bookingUrl) updateData.booking_url = bookingUrl;
    if (bookingPlatform) updateData.booking_platform = bookingPlatform;
    if (googlePlaceId) updateData.google_place_id = googlePlaceId;
    if (officialWebsite) updateData.official_website = officialWebsite;
    if (bookingNotes) updateData.booking_notes = bookingNotes;

    const { data, error } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', activityId)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ success: false, error: `Database update failed: ${error.message}` }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: `Activity with ID ${activityId} not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking information updated successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');

    let query = supabase
      .from('activities')
      .select('id, name, location, booking_url, booking_platform, booking_status, google_place_id, official_website, booking_notes')
      .eq('is_active', true);

    if (status) {
      query = query.eq('booking_status', status);
    }

    if (platform) {
      query = query.eq('booking_platform', platform);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ success: false, error: `Database query failed: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Booking query error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
