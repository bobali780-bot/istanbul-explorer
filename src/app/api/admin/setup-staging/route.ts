import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Move supabase client creation into the function
const getSupabase = () => createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Read and execute staging schema
    const stagingSchema = `
      -- Staging activities table
      CREATE TABLE IF NOT EXISTS staging_activities (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL,
        slug text,
        description text,
        short_overview text,
        full_description text,
        address text,
        district text,
        metro_station text,
        location text,
        latitude numeric,
        longitude numeric,
        google_maps_url text,
        website_url text,
        duration text,
        price_range text,
        is_free boolean DEFAULT false,
        booking_required boolean DEFAULT false,
        opening_hours text,
        best_time_to_visit text,
        dress_code text,
        entry_requirements text,
        accessibility_info text,
        historical_context text,
        cultural_significance text,
        highlights text[],
        languages_spoken text[],
        meta_title text,
        meta_description text,
        seo_keywords text[],
        seo_schema jsonb,
        rating numeric(3,2),
        review_count integer DEFAULT 0,
        popularity_score integer DEFAULT 0,
        category_id bigint,
        category_name text,
        approval_status text DEFAULT 'pending',
        admin_notes text,
        scraped_from text,
        confidence_score integer DEFAULT 0,
        data_sources text[],
        scrape_quality jsonb,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now(),
        approved_at timestamp,
        published_at timestamp,
        approved_by text,
        rejected_reason text
      );

      -- Staging media table
      CREATE TABLE IF NOT EXISTS staging_media (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        staging_activity_id bigint,
        media_type text NOT NULL DEFAULT 'image',
        media_url text NOT NULL,
        thumbnail_url text,
        alt_text text,
        caption text,
        attribution text,
        source text,
        is_primary boolean DEFAULT false,
        is_featured boolean DEFAULT false,
        sort_order integer DEFAULT 0,
        quality_score integer DEFAULT 0,
        width integer,
        height integer,
        file_size integer,
        format text,
        approval_status text DEFAULT 'pending',
        admin_notes text,
        created_at timestamp DEFAULT now()
      );

      -- Staging reviews table
      CREATE TABLE IF NOT EXISTS staging_reviews (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        staging_activity_id bigint,
        source text NOT NULL,
        source_url text,
        reviewer_name text,
        rating integer,
        review_title text,
        review_content text,
        review_date date,
        helpful_votes integer DEFAULT 0,
        verified_booking boolean DEFAULT false,
        language text DEFAULT 'en',
        approval_status text DEFAULT 'pending',
        admin_notes text,
        created_at timestamp DEFAULT now()
      );

      -- Scraping jobs table
      CREATE TABLE IF NOT EXISTS scraping_jobs (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        job_type text NOT NULL,
        input_data jsonb,
        status text DEFAULT 'queued',
        progress integer DEFAULT 0,
        total_items integer DEFAULT 0,
        processed_items integer DEFAULT 0,
        successful_items integer DEFAULT 0,
        failed_items integer DEFAULT 0,
        error_log jsonb,
        warnings jsonb,
        started_at timestamp,
        completed_at timestamp,
        estimated_duration interval,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      -- Admin activity log
      CREATE TABLE IF NOT EXISTS admin_activity_log (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        action_type text NOT NULL,
        entity_type text NOT NULL,
        entity_id bigint,
        old_values jsonb,
        new_values jsonb,
        admin_notes text,
        ip_address inet,
        user_agent text,
        created_at timestamp DEFAULT now()
      );
    `;

    // Execute schema creation
    const { error } = await supabase.rpc('exec_sql', { sql: stagingSchema });

    if (error) {
      console.error('Schema creation error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Staging database schema created successfully'
    });

  } catch (error) {
    console.error('Setup staging error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}