import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tileId = searchParams.get('tileId')

    if (!tileId) {
      return NextResponse.json({
        success: false,
        message: 'Tile ID is required'
      }, { status: 400 })
    }

    // Get all versions for this tile
    const { data: versions, error } = await supabase
      .from('tile_versions')
      .select('*')
      .eq('tile_id', tileId)
      .order('version_number', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      versions: versions || []
    })

  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch versions'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tileId, versionData, changesSummary } = await request.json()

    if (!tileId || !versionData) {
      return NextResponse.json({
        success: false,
        message: 'Tile ID and version data are required'
      }, { status: 400 })
    }

    // Get the latest version number
    const { data: latestVersion } = await supabase
      .from('tile_versions')
      .select('version_number')
      .eq('tile_id', tileId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    const nextVersionNumber = (latestVersion?.version_number || 0) + 1

    // Create new version
    const { data: newVersion, error } = await supabase
      .from('tile_versions')
      .insert({
        tile_id: tileId,
        version_number: nextVersionNumber,
        changes_summary: changesSummary || 'Updated via rescrape',
        images: versionData.images || [],
        description: versionData.description || '',
        metadata: versionData.metadata || {},
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      version: newVersion
    })

  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create version'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { versionId, status } = await request.json()

    if (!versionId || !status) {
      return NextResponse.json({
        success: false,
        message: 'Version ID and status are required'
      }, { status: 400 })
    }

    // Update version status
    const { data: updatedVersion, error } = await supabase
      .from('tile_versions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', versionId)
      .select()
      .single()

    if (error) {
      throw error
    }

    // If approved, update the main tile with this version's data
    if (status === 'approved') {
      const { error: tileError } = await supabase
        .from('staging_queue')
        .update({
          images: updatedVersion.images,
          description: updatedVersion.description,
          metadata: updatedVersion.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedVersion.tile_id)

      if (tileError) {
        console.error('Error updating main tile:', tileError)
      }
    }

    return NextResponse.json({
      success: true,
      version: updatedVersion
    })

  } catch (error) {
    console.error('Error updating version:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update version'
    }, { status: 500 })
  }
}
