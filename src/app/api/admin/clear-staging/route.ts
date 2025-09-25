import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    console.log('=== CLEARING ALL STAGING DATA ===')

    // 1. Clear staging_queue table and reset ID sequence
    console.log('Clearing staging_queue table...')
    const { error: clearStagingError } = await supabase
      .from('staging_queue')
      .delete()
      .neq('id', 0) // Delete all records

    if (clearStagingError) {
      console.error('Error clearing staging_queue:', clearStagingError)
      throw clearStagingError
    }

    // Reset staging_queue ID sequence
    console.log('Resetting staging_queue ID sequence...')
    const { error: resetStagingSeqError } = await supabase.rpc('reset_sequence', {
      table_name: 'staging_queue',
      sequence_name: 'staging_queue_id_seq'
    })

    if (resetStagingSeqError) {
      console.warn('Warning: Could not reset staging_queue sequence:', resetStagingSeqError.message)
      // Continue even if sequence reset fails
    }

    // 2. Clear scraping_jobs table and reset ID sequence
    console.log('Clearing scraping_jobs table...')
    const { error: clearJobsError } = await supabase
      .from('scraping_jobs')
      .delete()
      .neq('id', 0) // Delete all records

    if (clearJobsError) {
      console.error('Error clearing scraping_jobs:', clearJobsError)
      throw clearJobsError
    }

    // Reset scraping_jobs ID sequence
    console.log('Resetting scraping_jobs ID sequence...')
    const { error: resetJobsSeqError } = await supabase.rpc('reset_sequence', {
      table_name: 'scraping_jobs',
      sequence_name: 'scraping_jobs_id_seq'
    })

    if (resetJobsSeqError) {
      console.warn('Warning: Could not reset scraping_jobs sequence:', resetJobsSeqError.message)
      // Continue even if sequence reset fails
    }

    // 3. Verify tables are empty
    console.log('Verifying tables are empty...')

    const { data: stagingCount, error: stagingCountError } = await supabase
      .from('staging_queue')
      .select('id', { count: 'exact', head: true })

    const { data: jobsCount, error: jobsCountError } = await supabase
      .from('scraping_jobs')
      .select('id', { count: 'exact', head: true })

    if (stagingCountError || jobsCountError) {
      console.error('Error verifying empty tables:', { stagingCountError, jobsCountError })
    }

    console.log('=== STAGING DATA CLEARED SUCCESSFULLY ===')
    console.log(`Staging queue records: ${stagingCount?.length || 0}`)
    console.log(`Scraping jobs records: ${jobsCount?.length || 0}`)

    return NextResponse.json({
      success: true,
      message: 'All staging data cleared successfully',
      cleared: {
        staging_queue: true,
        scraping_jobs: true,
        sequences_reset: !resetStagingSeqError && !resetJobsSeqError
      },
      verification: {
        staging_queue_count: stagingCount?.length || 0,
        scraping_jobs_count: jobsCount?.length || 0
      }
    })

  } catch (error) {
    console.error('Error clearing staging data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clear staging data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Alternative method using simple delete
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    console.log('=== CLEARING ALL STAGING DATA ===')

    // Clear staging_queue table
    console.log('Clearing staging_queue table...')
    const { error: clearStagingError } = await supabase
      .from('staging_queue')
      .delete()
      .gte('id', 1) // Delete all records with id >= 1

    if (clearStagingError) {
      console.error('Error clearing staging_queue:', clearStagingError)
      throw clearStagingError
    }

    // Clear scraping_jobs table
    console.log('Clearing scraping_jobs table...')
    const { error: clearJobsError } = await supabase
      .from('scraping_jobs')
      .delete()
      .gte('id', 1) // Delete all records with id >= 1

    if (clearJobsError) {
      console.error('Error clearing scraping_jobs:', clearJobsError)
      throw clearJobsError
    }

    console.log('=== STAGING DATA CLEARED SUCCESSFULLY ===')

    return NextResponse.json({
      success: true,
      message: 'All staging data cleared successfully',
      method: 'simple_delete'
    })

  } catch (error) {
    console.error('Error clearing staging data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clear staging data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}