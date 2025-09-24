import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ensure not edge

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { action, items } = await request.json();

    if (!action || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request. Action and items array are required.'
      }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject".'
      }, { status: 400 });
    }

    console.log(`📝 Processing ${action} action for ${items.length} items:`, items);

    // Update the status of all specified items
    const { data, error } = await supabase
      .from('staging_queue')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .in('id', items)
      .select('id, title, status');

    if (error) {
      console.error(`❌ Error updating staging items:`, error);
      return NextResponse.json({
        success: false,
        message: `Database error: ${error.message}`,
        details: error
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No items were updated. Check that the item IDs exist in staging_queue.'
      }, { status: 404 });
    }

    console.log(`✅ Successfully ${action}d ${data.length} items:`, data.map(item => `${item.id}: ${item.title}`));

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${data.length} item${data.length > 1 ? 's' : ''}`,
      updated_items: data,
      action: action,
      count: data.length
    });

  } catch (error) {
    console.error('❌ Error in staging action endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}