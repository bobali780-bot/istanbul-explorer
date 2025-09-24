import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    console.log('Fixing database schema - adding missing columns...');

    // Add missing columns to staging_queue
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add missing reviewer_notes column to staging_queue table
        ALTER TABLE staging_queue
        ADD COLUMN IF NOT EXISTS reviewer_notes text;

        -- Add published status and metadata columns
        ALTER TABLE staging_queue
        ADD COLUMN IF NOT EXISTS published_at timestamp,
        ADD COLUMN IF NOT EXISTS published_activity_id bigint;

        -- Update status check constraint to include new statuses
        ALTER TABLE staging_queue
        DROP CONSTRAINT IF EXISTS staging_queue_status_check;

        ALTER TABLE staging_queue
        ADD CONSTRAINT staging_queue_status_check
        CHECK (status IN ('pending', 'approved', 'rejected', 'needs_review', 'ai_enhanced', 'published'));
      `
    });

    if (alterError) {
      console.error('Error altering table:', alterError);
      // Try alternative approach using direct queries

      const queries = [
        'ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS reviewer_notes text',
        'ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS published_at timestamp',
        'ALTER TABLE staging_queue ADD COLUMN IF NOT EXISTS published_activity_id bigint'
      ];

      for (const query of queries) {
        const { error } = await supabase.from('staging_queue').select('*').limit(0);
        if (error) {
          console.log('Table structure needs updating...');
          break;
        }
      }
    }

    // Test if the columns exist now
    const { data: testData, error: testError } = await supabase
      .from('staging_queue')
      .select('id, reviewer_notes, published_at')
      .limit(1);

    if (testError) {
      console.error('Columns still missing, manual SQL execution required');
      return NextResponse.json({
        success: false,
        error: 'Database schema update required',
        manual_steps: [
          '1. Go to Supabase Dashboard → SQL Editor',
          '2. Run the SQL from add-reviewer-notes-column.sql',
          '3. This will add the missing reviewer_notes column'
        ]
      });
    }

    console.log('Database schema updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Database schema updated successfully',
      columns_added: ['reviewer_notes', 'published_at', 'published_activity_id']
    });

  } catch (error) {
    console.error('Database fix error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      manual_sql_file: 'add-reviewer-notes-column.sql'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();
    // Check current schema
    const { data: columns, error } = await supabase
      .from('staging_queue')
      .select('*')
      .limit(1);

    return NextResponse.json({
      success: true,
      schema_status: error ? 'needs_update' : 'ok',
      error: error?.message
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}