// Quick test to check Supabase connection and data
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtyspsbaismmjwwqynns.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0eXNwc2JhaXNtbWp3d3F5bm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzIyNTEsImV4cCI6MjA3MzcwODI1MX0.Qa2PzUxxH_2bWAwY4JjOROPNhbzeZMzPV7yk6W8k2zw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')

    // Test basic connection
    const { data: tables, error: tablesError } = await supabase
      .from('activities')
      .select('count', { count: 'exact', head: true })

    if (tablesError) {
      console.error('Table access error:', tablesError)
      return
    }

    console.log('✅ Connection successful')
    console.log('Total activities count:', tables)

    // Fetch actual data
    const { data: activities, error: dataError } = await supabase
      .from('activities')
      .select('id, name, slug')
      .limit(5)

    if (dataError) {
      console.error('Data fetch error:', dataError)
      return
    }

    console.log('✅ Activities data:')
    console.log(activities)

    // Test images table
    const { data: images, error: imageError } = await supabase
      .from('activity_images')
      .select('id, activity_id, image_url, is_primary')
      .limit(5)

    if (imageError) {
      console.error('Images fetch error:', imageError)
    } else {
      console.log('✅ Images data:')
      console.log(images)
    }

  } catch (error) {
    console.error('Connection test failed:', error)
  }
}

testConnection()