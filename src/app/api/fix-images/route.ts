import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const supabase = getSupabase();
    // Get all activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('id, name, slug');

    if (activitiesError) {
      throw activitiesError;
    }

    if (!activities) {
      return NextResponse.json({ success: false, error: 'No activities found' });
    }

    let insertedCount = 0;

    // Add images for each activity
    for (const activity of activities) {
      const images = [
        {
          entity_type: 'activity',
          entity_id: activity.id,
          media_type: 'image',
          media_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt_text: `Beautiful view of ${activity.name} in Istanbul`,
          caption: `Experience the magnificent ${activity.name}`,
          attribution: 'Photo by Unsplash',
          source: 'unsplash',
          is_primary: true,
          sort_order: 1
        },
        {
          entity_type: 'activity',
          entity_id: activity.id,
          media_type: 'image',
          media_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt_text: `Detailed architectural view of ${activity.name}`,
          caption: `Architectural details of ${activity.name}`,
          attribution: 'Photo by Unsplash',
          source: 'unsplash',
          is_primary: false,
          sort_order: 2
        },
        {
          entity_type: 'activity',
          entity_id: activity.id,
          media_type: 'image',
          media_url: 'https://images.unsplash.com/photo-1605553910095-d3ddb6c99ad8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          alt_text: `Interior view of ${activity.name}`,
          caption: `Inside the magnificent ${activity.name}`,
          attribution: 'Photo by Unsplash',
          source: 'unsplash',
          is_primary: false,
          sort_order: 3
        }
      ];

      for (const image of images) {
        const { error: insertError } = await supabase
          .from('universal_media')
          .insert(image);

        if (!insertError) {
          insertedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added ${insertedCount} images to ${activities.length} activities`,
      activities_processed: activities.length,
      images_inserted: insertedCount
    });

  } catch (error) {
    console.error('Error fixing images:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}