import { NextRequest, NextResponse } from 'next/server'
import { getActivities } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '100')

    console.log('API Route: Starting activities fetch...', { category, limit })

    let activities = await getActivities()

    // Filter by category if specified
    if (category) {
      activities = activities.filter(activity => {
        // Map category names to match our schema
        const categoryMap: Record<string, string> = {
          'activities': 'activities',
          'hotels': 'hotels', 
          'shopping': 'shopping',
          'food-drink': 'food-drink'
        }
        return activity.category === categoryMap[category] || activity.category === category
      })
    }

    // Apply limit
    if (limit && limit > 0) {
      activities = activities.slice(0, limit)
    }

    console.log('API Route: Activities fetched:', activities.length)

    return NextResponse.json({
      success: true,
      count: activities.length,
      data: activities
    })
  } catch (error) {
    console.error('API Route Error:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}