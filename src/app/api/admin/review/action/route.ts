import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ReviewAction {
  id: number;
  action: 'approve' | 'reject';
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const { id, action }: ReviewAction = await request.json();

    if (!id || !action) {
      return NextResponse.json({
        success: false,
        error: 'Missing id or action'
      }, { status: 400 });
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({
        success: false,
        error: 'Action must be "approve" or "reject"'
      }, { status: 400 });
    }

    // Validate that the staging item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('staging_queue')
      .select('id, title, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json({
        success: false,
        error: 'Staging item not found'
      }, { status: 404 });
    }

    // Update the staging item status
    const { data: updatedItem, error: updateError } = await supabase
      .from('staging_queue')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: `Item "${existingItem.title}" ${action}d successfully`,
      item: updatedItem
    });

  } catch (error) {
    console.error('Review action error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}