import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Clearing all activities data...');

    // Clear universal_media first (foreign key constraint)
    const { error: mediaError } = await supabase
      .from('universal_media')
      .delete()
      .eq('entity_type', 'activity');

    if (mediaError) {
      console.error('Error clearing universal_media:', mediaError);
      return NextResponse.json({
        success: false,
        error: 'Failed to clear universal_media',
        details: mediaError.message
      }, { status: 500 });
    }

    // Clear universal_reviews for activities
    const { error: reviewsError } = await supabase
      .from('universal_reviews')
      .delete()
      .eq('entity_type', 'activity');

    if (reviewsError) {
      console.error('Error clearing universal_reviews:', reviewsError);
      return NextResponse.json({
        success: false,
        error: 'Failed to clear universal_reviews',
        details: reviewsError.message
      }, { status: 500 });
    }

    // Clear activities table
    const { error: activitiesError } = await supabase
      .from('activities')
      .delete()
      .neq('id', 0); // Delete all records

    if (activitiesError) {
      console.error('Error clearing activities:', activitiesError);
      return NextResponse.json({
        success: false,
        error: 'Failed to clear activities',
        details: activitiesError.message
      }, { status: 500 });
    }

    // Verify counts
    const { count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true });

    const { count: mediaCount } = await supabase
      .from('universal_media')
      .select('*', { count: 'exact', head: true })
      .eq('entity_type', 'activity');

    const { count: reviewsCount } = await supabase
      .from('universal_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('entity_type', 'activity');

    console.log('✅ Activities data cleared successfully');
    console.log(`📊 Remaining counts - Activities: ${activitiesCount}, Media: ${mediaCount}, Reviews: ${reviewsCount}`);

    return NextResponse.json({
      success: true,
      message: 'All activities data cleared successfully',
      cleared: {
        activities: true,
        universal_media: true,
        universal_reviews: true
      },
      verification: {
        activities_count: activitiesCount || 0,
        media_count: mediaCount || 0,
        reviews_count: reviewsCount || 0
      }
    });

  } catch (error) {
    console.error('Error clearing activities data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear activities data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
