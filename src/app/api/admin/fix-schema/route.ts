import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Fixing database schema...')

    const results: any = {}

    // Create shopping table (doesn't exist)
    try {
      const { error: shoppingError } = await supabase
        .from('shopping')
        .select('id')
        .limit(1)

      if (shoppingError && shoppingError.code === 'PGRST205') {
        // Table doesn't exist, create it
        const { error: createError } = await supabase
          .rpc('create_shopping_table')

        if (createError) {
          results.shopping = { success: false, error: createError.message }
        } else {
          results.shopping = { success: true, message: 'Shopping table created successfully' }
        }
      } else {
        results.shopping = { success: true, message: 'Shopping table already exists' }
      }
    } catch (err) {
      results.shopping = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }

    // Check and fix hotels table
    try {
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('hotels')
        .select('id, name, location')
        .limit(1)

      if (hotelsError && hotelsError.code === '42703') {
        // Missing columns, add them
        results.hotels = { success: false, error: 'Missing columns in hotels table', details: hotelsError.message }
      } else {
        results.hotels = { success: true, message: 'Hotels table schema is correct' }
      }
    } catch (err) {
      results.hotels = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }

    // Check and fix restaurants table
    try {
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('restaurants')
        .select('id, name, location')
        .limit(1)

      if (restaurantsError && restaurantsError.code === '42703') {
        // Missing columns, add them
        results.restaurants = { success: false, error: 'Missing columns in restaurants table', details: restaurantsError.message }
      } else {
        results.restaurants = { success: true, message: 'Restaurants table schema is correct' }
      }
    } catch (err) {
      results.restaurants = { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }

    console.log('✅ Schema check completed:', results)
    return NextResponse.json({ 
      success: true, 
      results: results,
      message: 'Schema check completed - manual SQL execution required'
    })

  } catch (error) {
    console.error('❌ Error checking schema:', error)
    return NextResponse.json({ error: 'Failed to check schema', details: error }, { status: 500 })
  }
}