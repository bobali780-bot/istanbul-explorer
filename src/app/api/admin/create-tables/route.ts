import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Creating missing database tables...')

    // Create shopping table
    const shoppingTable = `
      CREATE TABLE IF NOT EXISTS shopping (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL,
        slug text UNIQUE NOT NULL,
        description text,
        short_overview text,
        full_description text,
        booking_url text,
        rating numeric(2,1),
        review_count integer,
        price_range text,
        opening_hours text,
        location text,
        highlights text[],
        trip_advisor_url text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `

    // Create hotels table
    const hotelsTable = `
      CREATE TABLE IF NOT EXISTS hotels (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL,
        slug text UNIQUE NOT NULL,
        description text,
        short_overview text,
        full_description text,
        booking_url text,
        rating numeric(2,1),
        review_count integer,
        price_range text,
        opening_hours text,
        location text,
        highlights text[],
        trip_advisor_url text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `

    // Create restaurants table
    const restaurantsTable = `
      CREATE TABLE IF NOT EXISTS restaurants (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL,
        slug text UNIQUE NOT NULL,
        description text,
        short_overview text,
        full_description text,
        booking_url text,
        rating numeric(2,1),
        review_count integer,
        price_range text,
        opening_hours text,
        location text,
        highlights text[],
        trip_advisor_url text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      )
    `

    // Create indexes
    const indexes = `
      CREATE INDEX IF NOT EXISTS idx_shopping_rating ON shopping (rating DESC, review_count DESC);
      CREATE INDEX IF NOT EXISTS idx_hotels_rating ON hotels (rating DESC, review_count DESC);
      CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants (rating DESC, review_count DESC);
    `

    // Enable RLS and create policies
    const policies = `
      ALTER TABLE shopping ENABLE ROW LEVEL SECURITY;
      ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
      ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Allow public read access on shopping" ON shopping FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Allow public read access on hotels" ON hotels FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Allow public read access on restaurants" ON restaurants FOR SELECT USING (true);
    `

    // Execute all SQL commands
    const { error: shoppingError } = await supabase.rpc('exec_sql', { sql: shoppingTable })
    if (shoppingError) {
      console.error('❌ Error creating shopping table:', shoppingError)
      return NextResponse.json({ error: 'Failed to create shopping table', details: shoppingError }, { status: 500 })
    }

    const { error: hotelsError } = await supabase.rpc('exec_sql', { sql: hotelsTable })
    if (hotelsError) {
      console.error('❌ Error creating hotels table:', hotelsError)
      return NextResponse.json({ error: 'Failed to create hotels table', details: hotelsError }, { status: 500 })
    }

    const { error: restaurantsError } = await supabase.rpc('exec_sql', { sql: restaurantsTable })
    if (restaurantsError) {
      console.error('❌ Error creating restaurants table:', restaurantsError)
      return NextResponse.json({ error: 'Failed to create restaurants table', details: restaurantsError }, { status: 500 })
    }

    const { error: indexesError } = await supabase.rpc('exec_sql', { sql: indexes })
    if (indexesError) {
      console.error('❌ Error creating indexes:', indexesError)
      return NextResponse.json({ error: 'Failed to create indexes', details: indexesError }, { status: 500 })
    }

    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: policies })
    if (policiesError) {
      console.error('❌ Error creating policies:', policiesError)
      return NextResponse.json({ error: 'Failed to create policies', details: policiesError }, { status: 500 })
    }

    console.log('✅ Successfully created all missing tables!')
    return NextResponse.json({ 
      success: true, 
      message: 'All missing tables created successfully',
      tables: ['shopping', 'hotels', 'restaurants']
    })

  } catch (error) {
    console.error('❌ Error creating tables:', error)
    return NextResponse.json({ error: 'Failed to create tables', details: error }, { status: 500 })
  }
}

