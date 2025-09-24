import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Check universal_media table
    const { data: media, error: mediaError } = await supabase
      .from('universal_media')
      .select('*')
      .eq('entity_type', 'activity')
      .limit(5);

    if (mediaError) {
      throw mediaError;
    }

    // Check activities table
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('id, name')
      .limit(5);

    if (activitiesError) {
      throw activitiesError;
    }

    return NextResponse.json({
      success: true,
      media_count: media?.length || 0,
      activities_count: activities?.length || 0,
      sample_media: media?.slice(0, 3),
      sample_activities: activities?.slice(0, 3)
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}