import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    console.log('Setting up admin dashboard schema...');

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Create tables using direct SQL execution
    const statements = [
      // staging_queue table
      `CREATE TABLE IF NOT EXISTS staging_queue (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title text NOT NULL,
        slug text,
        category text NOT NULL CHECK (category IN ('activities', 'restaurants', 'hotels', 'shopping', 'food_drink')),
        status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_review', 'ai_enhanced')),
        primary_image text,
        images text[],
        image_count integer DEFAULT 0,
        raw_content jsonb NOT NULL,
        processed_content jsonb,
        ai_enhanced_content jsonb,
        confidence_score integer DEFAULT 0,
        source_urls text[],
        scraping_job_id bigint,
        has_description boolean DEFAULT false,
        has_price boolean DEFAULT false,
        has_location boolean DEFAULT false,
        has_rating boolean DEFAULT false,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now(),
        reviewed_at timestamp,
        enhanced_at timestamp
      )`,

      // duplicate_detection table
      `CREATE TABLE IF NOT EXISTS duplicate_detection (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        content_hash text UNIQUE NOT NULL,
        title_slug text NOT NULL,
        category text NOT NULL,
        source_table text,
        source_id bigint,
        created_at timestamp DEFAULT now()
      )`,

      // content_sources table
      `CREATE TABLE IF NOT EXISTS content_sources (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        category text NOT NULL,
        domain text NOT NULL,
        base_url text,
        source_type text NOT NULL,
        is_active boolean DEFAULT true,
        quality_score integer DEFAULT 100,
        rate_limit_per_hour integer DEFAULT 50,
        firecrawl_config jsonb,
        created_at timestamp DEFAULT now()
      )`,

      // scraping_jobs table
      `CREATE TABLE IF NOT EXISTS scraping_jobs (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        job_type text NOT NULL,
        category text NOT NULL,
        input_data jsonb NOT NULL,
        status text DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
        total_items integer DEFAULT 0,
        processed_items integer DEFAULT 0,
        successful_items integer DEFAULT 0,
        failed_items integer DEFAULT 0,
        duplicate_items integer DEFAULT 0,
        credits_used integer DEFAULT 0,
        credits_remaining integer,
        staging_ids bigint[],
        error_log jsonb,
        performance_metrics jsonb,
        started_at timestamp,
        completed_at timestamp,
        created_at timestamp DEFAULT now()
      )`,

      // ai_enhancement_log table
      `CREATE TABLE IF NOT EXISTS ai_enhancement_log (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        staging_item_id bigint,
        original_content jsonb,
        enhanced_content jsonb,
        enhancement_type text,
        model_used text,
        prompt_template text,
        word_count_before integer,
        word_count_after integer,
        created_at timestamp DEFAULT now()
      )`
    ];

    // Execute each statement using raw SQL
    for (let i = 0; i < statements.length; i++) {
      try {
        console.log(`Creating table ${i + 1}/${statements.length}`);

        const { error } = await supabase
          .rpc('exec_sql', { sql: statements[i] });

        if (error) {
          // Try alternative method
          const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql: statements[i] })
          });

          if (!response.ok) {
            throw new Error(`Table ${i + 1} creation failed`);
          }
        }

        results.push({
          statement: i + 1,
          success: true,
          sql: `Table ${i + 1} created successfully`
        });
        successCount++;

      } catch (err) {
        console.error(`Table ${i + 1} error:`, err);
        results.push({
          statement: i + 1,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          sql: `Table ${i + 1} creation failed`
        });
        errorCount++;
      }
    }

    // Test the setup by inserting a dummy record
    const testData = {
      title: 'Test Activity - Blue Mosque',
      category: 'activities',
      primary_image: 'https://example.com/blue-mosque.jpg',
      images: ['https://example.com/blue-mosque.jpg', 'https://example.com/blue-mosque-2.jpg'],
      image_count: 2,
      raw_content: {
        description: 'Historic mosque in Istanbul',
        location: 'Sultanahmet, Istanbul',
        rating: 4.5,
        source: 'test'
      },
      confidence_score: 85,
      source_urls: ['https://example.com/source'],
      has_description: true,
      has_location: true,
      has_rating: true
    };

    const { data: testInsert, error: testError } = await supabase
      .from('staging_queue')
      .insert(testData)
      .select()
      .single();

    if (testError) {
      console.error('Test insert failed:', testError);
      return NextResponse.json({
        success: false,
        error: 'Schema created but test insert failed: ' + testError.message,
        details: results
      });
    }

    // Clean up test data
    await supabase
      .from('staging_queue')
      .delete()
      .eq('id', testInsert.id);

    console.log('Admin dashboard schema setup completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Admin dashboard schema created and tested successfully',
      summary: {
        total_statements: statements.length,
        successful: successCount,
        failed: errorCount
      },
      test_insert: 'Success - dummy data inserted and removed',
      details: results
    });

  } catch (error) {
    console.error('Setup dashboard error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}