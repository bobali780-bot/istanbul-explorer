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
    // Try to insert a single test image
    const { data, error } = await supabase
      .from('universal_media')
      .insert({
        entity_type: 'activity',
        entity_id: 1,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        alt_text: 'Test image for debugging',
        caption: 'Test image for debugging',
        attribution: 'Photo by Unsplash',
        source: 'unsplash',
        is_primary: true,
        sort_order: 1
      })
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error.details,
        hint: error.hint
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test image inserted successfully',
      data
    });

  } catch (error) {
    console.error('Test insert error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}