import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json({
        success: false,
        error: 'Job ID is required'
      }, { status: 400 });
    }

    // Get job details from scraping_jobs table
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) {
      return NextResponse.json({
        success: false,
        error: `Job not found: ${jobError.message}`
      }, { status: 404 });
    }

    if (!job) {
      return NextResponse.json({
        success: false,
        error: 'Job not found'
      }, { status: 404 });
    }

    // Extract detailed results from error_log if available
    let detailedResults = null;
    if (job.error_log && job.error_log.detailed_results) {
      detailedResults = job.error_log.detailed_results;
    }

    // Format response with job info and detailed per-term results
    const response = {
      success: true,
      job: {
        id: job.id,
        job_type: job.job_type,
        category: job.category,
        status: job.status,
        total_items: job.total_items,
        processed_items: job.processed_items,
        successful_items: job.successful_items,
        failed_items: job.failed_items,
        credits_used: job.credits_used,
        started_at: job.started_at,
        completed_at: job.completed_at,
        input_data: job.input_data,
        staging_ids: job.staging_ids
      },
      results: detailedResults?.results || [],
      summary: detailedResults?.summary || {
        total_terms: job.total_items || 0,
        processed: job.processed_items || 0,
        successful: job.successful_items || 0,
        failed: job.failed_items || 0,
        duplicates: 0,
        credits_used: job.credits_used || 0
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get job details error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}