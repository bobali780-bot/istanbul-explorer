import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import FirecrawlService from '@/lib/firecrawl';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { searchTerms, jobType = 'single_search' } = await request.json();

    if (!searchTerms || (!Array.isArray(searchTerms) && typeof searchTerms !== 'string')) {
      return NextResponse.json({
        success: false,
        error: 'Search terms are required'
      }, { status: 400 });
    }

    // Convert single string to array
    const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];

    // Create scraping job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        job_type: jobType,
        input_data: { search_terms: terms },
        status: 'running',
        total_items: terms.length,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    const firecrawl = new FirecrawlService();
    const results = [];
    const errors = [];

    let processedCount = 0;
    let successCount = 0;

    for (const term of terms) {
      try {
        console.log(`Scraping: ${term}`);
        const activities = await firecrawl.searchActivity(term);

        for (const activity of activities) {
          // Insert into staging table
          const { data: stagingActivity, error: stagingError } = await supabase
            .from('staging_activities')
            .insert({
              name: activity.name,
              slug: activity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
              description: activity.description,
              short_overview: activity.short_overview,
              full_description: activity.full_description,
              address: activity.address,
              district: activity.district,
              location: activity.location,
              duration: activity.duration,
              price_range: activity.price_range,
              opening_hours: activity.opening_hours,
              rating: activity.rating,
              review_count: activity.review_count,
              highlights: activity.highlights,
              scraped_from: activity.scraped_from,
              confidence_score: activity.confidence_score,
              approval_status: 'pending',
              category_name: 'Activities',
              data_sources: ['firecrawl']
            })
            .select()
            .single();

          if (stagingError) {
            errors.push(`Failed to save ${activity.name}: ${stagingError.message}`);
            continue;
          }

          // Insert images
          for (let i = 0; i < activity.images.length; i++) {
            const imageUrl = activity.images[i];
            await supabase
              .from('staging_media')
              .insert({
                staging_activity_id: stagingActivity.id,
                media_type: 'image',
                media_url: imageUrl,
                alt_text: `${activity.name} - Image ${i + 1}`,
                caption: `${activity.name} in Istanbul`,
                attribution: 'Scraped from web',
                source: 'firecrawl',
                is_primary: i === 0,
                sort_order: i + 1,
                approval_status: 'pending'
              });
          }

          // Insert reviews
          for (const review of activity.reviews) {
            await supabase
              .from('staging_reviews')
              .insert({
                staging_activity_id: stagingActivity.id,
                source: review.source,
                reviewer_name: review.reviewer_name,
                rating: review.rating,
                review_content: review.review_content,
                approval_status: 'pending'
              });
          }

          results.push({
            name: activity.name,
            confidence_score: activity.confidence_score,
            images_count: activity.images.length,
            reviews_count: activity.reviews.length
          });

          successCount++;
        }

        processedCount++;

        // Update job progress
        await supabase
          .from('scraping_jobs')
          .update({
            processed_items: processedCount,
            successful_items: successCount,
            progress: Math.round((processedCount / terms.length) * 100)
          })
          .eq('id', job.id);

      } catch (error) {
        console.error(`Error scraping ${term}:`, error);
        errors.push(`Failed to scrape ${term}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        processedCount++;
      }
    }

    // Complete the job
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_items: processedCount,
        successful_items: successCount,
        failed_items: processedCount - successCount,
        error_log: errors.length > 0 ? { errors } : null
      })
      .eq('id', job.id);

    return NextResponse.json({
      success: true,
      job_id: job.id,
      results,
      summary: {
        total_terms: terms.length,
        processed: processedCount,
        successful: successCount,
        failed: processedCount - successCount,
        errors: errors
      }
    });

  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}