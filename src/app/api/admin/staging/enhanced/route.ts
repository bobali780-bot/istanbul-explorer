import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    
    // Always get ALL staging items first for stats calculation
    const { data: allStagingItems, error: stagingError } = await supabase
      .from('staging_queue')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply status filter to staging items AFTER getting all items
    let stagingItems = allStagingItems;
    if (statusFilter && statusFilter !== 'all') {
      stagingItems = allStagingItems?.filter(item => (item.status || 'pending') === statusFilter) || [];
    }

    // Get recent scraping jobs to find failed items
    const { data: recentJobs, error: jobsError } = await supabase
      .from('scraping_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20) // Get last 20 jobs

    if (jobsError) {
      console.error('Error fetching scraping jobs:', jobsError)
      // Continue without failed items data
    }

    // Parse failed items from job error logs
    const failedItems: any[] = []
    if (recentJobs && Array.isArray(recentJobs)) {
      for (const job of recentJobs) {
        try {
          // Check if error_log exists and has detailed_results
          if (job.error_log &&
              typeof job.error_log === 'object' &&
              job.error_log.detailed_results &&
              Array.isArray(job.error_log.detailed_results)) {

            for (const result of job.error_log.detailed_results) {
              if (result &&
                  typeof result === 'object' &&
                  result.status === 'failed' &&
                  result.error) {

                failedItems.push({
                  id: `failed_${job.id}_${result.term || 'unknown'}`,
                  title: result.title || result.term || 'Unknown Item',
                  term: result.term || 'Unknown Term',
                  category: result.detectedCategory || 'unknown',
                  status: 'failed',
                  created_at: job.created_at,
                  scraping_job_id: job.id,
                  error_details: result.error,
                  failure_type: result.error.step === 'validation' ? 'Content Validation' :
                               result.error.step === 'staging' ? 'Database Save' :
                               'Processing Error',
                  validation_errors: result.error.details?.validationChecks,
                  database_error: result.error.details?.supabaseError
                })
              }
            }
          }
        } catch (parseError) {
          console.warn(`Error parsing job ${job.id} error log:`, parseError)
          // Continue with other jobs
          continue
        }
      }
    }

    // Enhance staging items with placeholder information
    const enhancedStagingItems = stagingItems?.map(item => ({
      ...item,
      item_type: 'success',
      failure_type: null,
      placeholder_info: item.raw_content?.placeholder_info || null
    })) || []

    // Mark failed items
    const enhancedFailedItems = failedItems.map(item => ({
      ...item,
      item_type: 'failed',
      uses_placeholder: false,
      placeholder_info: null
    }))

    // Calculate enhanced stats from ALL items (not filtered)
    const stats = {
      total: ((allStagingItems?.length || 0) + enhancedFailedItems.length),
      successful: allStagingItems?.length || 0,
      failed: enhancedFailedItems.length,
      pending: allStagingItems?.filter(item => (item.status || 'pending') === 'pending').length || 0,
      approved: allStagingItems?.filter(item => item.status === 'approved').length || 0,
      rejected: allStagingItems?.filter(item => item.status === 'rejected').length || 0,
      published: allStagingItems?.filter(item => item.status === 'published').length || 0,
      using_placeholders: allStagingItems?.filter(item => item.uses_placeholder).length || 0,
      validation_failures: enhancedFailedItems.filter(item => item.failure_type === 'Content Validation').length,
      database_failures: enhancedFailedItems.filter(item => item.failure_type === 'Database Save').length
    }

    // Apply status filter to items AFTER calculating stats
    let filteredItems = [...enhancedStagingItems, ...enhancedFailedItems]
    
    if (statusFilter && statusFilter !== 'all') {
      filteredItems = filteredItems.filter(item => 
        item.item_type === 'success' ? (item.status || 'pending') === statusFilter : false
      )
    }
    
    // Sort filtered items
    const allItems = filteredItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({
      success: true,
      items: allItems,
      stats
    })

  } catch (error) {
    console.error('Error in enhanced staging endpoint:', error)
    return NextResponse.json({
      success: false,
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}