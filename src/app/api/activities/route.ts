import { NextRequest, NextResponse } from 'next/server'
import { getActivities } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Starting activities fetch...')

    const activities = await getActivities()

    console.log('API Route: Activities fetched:', activities.length)

    return NextResponse.json({
      success: true,
      count: activities.length,
      activities
    })
  } catch (error) {
    console.error('API Route Error:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}