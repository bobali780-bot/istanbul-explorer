import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { tileId, imageUrl } = await request.json()

    if (!tileId || !imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Missing tileId or imageUrl'
      }, { status: 400 })
    }

    console.log(`🗑️ Removing image from tile ${tileId}:`, imageUrl)

    // Get the current tile data
    const { data: currentTile, error: fetchError } = await supabase
      .from('staging_queue')
      .select('*')
      .eq('id', tileId)
      .single()

    if (fetchError || !currentTile) {
      console.error('Error fetching tile:', fetchError)
      return NextResponse.json({
        success: false,
        error: 'Tile not found'
      }, { status: 404 })
    }

    const currentImages = currentTile.images || []
    const updatedImages = currentImages.filter((img: string) => img !== imageUrl)

    if (updatedImages.length === currentImages.length) {
      return NextResponse.json({
        success: false,
        error: 'Image not found in tile'
      }, { status: 404 })
    }

    // Update the tile with the new images array
    const { error: updateError } = await supabase
      .from('staging_queue')
      .update({
        images: updatedImages,
        updated_at: new Date().toISOString()
      })
      .eq('id', tileId)

    if (updateError) {
      console.error('Error updating tile:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update tile'
      }, { status: 500 })
    }

    console.log(`✅ Successfully removed image from tile ${tileId}. Images: ${currentImages.length} → ${updatedImages.length}`)

    return NextResponse.json({
      success: true,
      message: 'Image removed successfully',
      data: {
        tileId,
        imagesRemaining: updatedImages.length,
        imageRemoved: imageUrl
      }
    })

  } catch (error) {
    console.error('Error removing image:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to remove image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
