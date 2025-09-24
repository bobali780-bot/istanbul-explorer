import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // First clear all existing media
    await supabase.from('universal_media').delete().eq('entity_type', 'activity');

    // Get all activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('id, name, slug')
      .order('popularity_score', { ascending: false });

    if (activitiesError) {
      throw activitiesError;
    }

    if (!activities) {
      return NextResponse.json({ success: false, error: 'No activities found' });
    }

    // Define unique images for each activity type
    const imageMap: { [key: string]: string[] } = {
      'hagia-sophia-grand-mosque': [
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1605553910095-d3ddb6c99ad8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'blue-mosque-sultan-ahmed': [
        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1570939274-30914ee6e44f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1514649923863-ceaf75b7ec40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'bosphorus-cruise': [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'grand-bazaar-kapalicarsi': [
        'https://images.unsplash.com/photo-1572425248736-d7bb2c921dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'basilica-cistern-yerebatan': [
        'https://images.unsplash.com/photo-1588392382834-a891154bca4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1564622052879-2e7bb6adda0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'suleymaniye-mosque': [
        'https://images.unsplash.com/photo-1599461428079-35a5a1eb9739?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1607970579778-d5978b33a9fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1568849676085-51415703900f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'dolmabahce-palace': [
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1612309606926-c2d13f6d7c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'topkapi-palace-museum': [
        'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1599501792086-634fe5fccc4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1577975882846-431adc8c4f14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'spice-bazaar-egyptian-bazaar': [
        'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571116219-0e90e8a1b5a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      'galata-tower': [
        'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1570198081926-c8b32e6c9e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1534330756036-d4c67e6de6c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ]
    };

    let insertedCount = 0;

    // Add unique images for each activity
    for (const activity of activities) {
      const images = imageMap[activity.slug] || imageMap['hagia-sophia-grand-mosque']; // fallback

      for (let i = 0; i < images.length; i++) {
        const { error: insertError } = await supabase
          .from('universal_media')
          .insert({
            entity_type: 'activity',
            entity_id: activity.id,
            media_type: 'image',
            media_url: images[i],
            alt_text: `${activity.name} - ${i === 0 ? 'Main view' : i === 1 ? 'Architectural detail' : 'Interior view'}`,
            caption: `${activity.name} in Istanbul`,
            attribution: 'Photo by Unsplash',
            source: 'unsplash',
            is_primary: i === 0,
            sort_order: i + 1
          });

        if (!insertError) {
          insertedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added ${insertedCount} unique images to ${activities.length} activities`,
      activities_processed: activities.length,
      images_inserted: insertedCount
    });

  } catch (error) {
    console.error('Error fixing unique images:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}