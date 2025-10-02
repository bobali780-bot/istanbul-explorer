import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    console.log('🧹 Starting complete staging area cleanup...')

    // Clear all staging queue items
    const { error: stagingError } = await supabase
      .from('staging_queue')
      .delete()
      .neq('id', 0) // Delete all records

    if (stagingError) {
      console.error('❌ Error clearing staging_queue:', stagingError)
      return Response.json({ error: 'Failed to clear staging queue' }, { status: 500 })
    }

    // Clear all associated universal_media entries for staging items
    const { error: mediaError } = await supabase
      .from('universal_media')
      .delete()
      .eq('entity_type', 'staging_queue')

    if (mediaError) {
      console.error('❌ Error clearing universal_media:', mediaError)
      return Response.json({ error: 'Failed to clear staging media' }, { status: 500 })
    }

    // Clear any staging-related reviews
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .eq('entity_type', 'staging_queue')

    if (reviewsError) {
      console.error('⚠️ Warning clearing reviews:', reviewsError)
      // Don't fail if reviews table doesn't exist or has issues
    }

    console.log('✅ Staging area completely cleared!')

    return Response.json({ 
      success: true, 
      message: 'Staging area completely cleared - ready for fresh affiliate content collection!' 
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return Response.json({ error: 'Unexpected error during cleanup' }, { status: 500 })
  }
}