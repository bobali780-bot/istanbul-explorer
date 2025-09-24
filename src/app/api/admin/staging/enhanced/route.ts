import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get successful staging items
    const { data: stagingItems, error: stagingError } = await supabase
      .from('staging_queue')
      .select('*')
      .order('created_at', { ascending: false })

    if (stagingError) {
      console.error('Error fetching staging items:', stagingError)
      return NextResponse.json({
        success: false,
        error: `Database error: ${stagingError.message}`
      }, { status: 500 })
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

    // Combine and sort all items
    const allItems = [...enhancedStagingItems, ...enhancedFailedItems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Calculate enhanced stats
    const stats = {
      total: allItems.length,
      successful: enhancedStagingItems.length,
      failed: enhancedFailedItems.length,
      pending: enhancedStagingItems.filter(item => item.status === 'pending').length,
      approved: enhancedStagingItems.filter(item => item.status === 'approved').length,
      rejected: enhancedStagingItems.filter(item => item.status === 'rejected').length,
      published: enhancedStagingItems.filter(item => item.status === 'published').length,
      using_placeholders: enhancedStagingItems.filter(item => item.uses_placeholder).length,
      validation_failures: enhancedFailedItems.filter(item => item.failure_type === 'Content Validation').length,
      database_failures: enhancedFailedItems.filter(item => item.failure_type === 'Database Save').length
    }

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