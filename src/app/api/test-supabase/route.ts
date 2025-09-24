import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        envVars: {
          url: !!supabaseUrl,
          key: !!supabaseKey
        }
      }, { status: 500 })
    }

    // Move supabase client creation into the function
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('activities')
      .select('id, name, slug')
      .limit(3)

    if (error) {
      return NextResponse.json({
        error: 'Supabase error',
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      envVars: {
        url: supabaseUrl?.substring(0, 30) + '...',
        keyLength: supabaseKey?.length
      }
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}