import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking database schema...')

    const tables = ['activities', 'hotels', 'shopping', 'restaurants']
    const schemaInfo: any = {}

    for (const table of tables) {
      try {
        // Try to get one record to see what columns exist
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`❌ Error checking ${table}:`, error.message)
          schemaInfo[table] = { 
            exists: false, 
            error: error.message,
            columns: []
          }
        } else {
          // Get column names from the sample data
          const columns = data && data.length > 0 ? Object.keys(data[0]) : []
          schemaInfo[table] = { 
            exists: true, 
            columns: columns,
            sampleData: data?.[0] || {},
            recordCount: data?.length || 0
          }
        }
      } catch (err) {
        schemaInfo[table] = { 
          exists: false, 
          error: err instanceof Error ? err.message : 'Unknown error',
          columns: []
        }
      }
    }

    console.log('📊 Schema inspection complete:', schemaInfo)
    return NextResponse.json({ 
      success: true, 
      schema: schemaInfo,
      message: 'Schema inspection completed'
    })

  } catch (error) {
    console.error('❌ Error checking schema:', error)
    return NextResponse.json({ error: 'Failed to check schema', details: error }, { status: 500 })
  }
}