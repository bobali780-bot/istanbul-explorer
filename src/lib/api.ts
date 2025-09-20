import { supabase, type Activity } from './supabase'

export async function getActivities(): Promise<Activity[]> {
  try {
    // Return empty array during build if environment variables are not set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }
    const { data, error } = await supabase
      .from('activities')
      .select(`
        id,
        name,
        slug,
        description,
        short_overview,
        full_description,
        booking_url,
        rating,
        review_count,
        price_range,
        duration,
        opening_hours,
        location,
        highlights,
        trip_advisor_url,
        created_at,
        updated_at,
        activity_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        ),
        activity_reviews (
          id,
          author,
          rating,
          comment,
          review_date
        )
      `)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Supabase fetch error:', error)
      return []
    }

    // Sort images by sort_order and ensure primary image is first
    const activitiesWithSortedImages = data.map(activity => ({
      ...activity,
      activity_images: activity.activity_images
        .sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1
          if (!a.is_primary && b.is_primary) return 1
          return a.sort_order - b.sort_order
        })
    }))

    return activitiesWithSortedImages as Activity[]
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  try {
    // Return null during build if environment variables are not set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }
    const { data, error } = await supabase
      .from('activities')
      .select(`
        id,
        name,
        slug,
        description,
        short_overview,
        full_description,
        booking_url,
        rating,
        review_count,
        price_range,
        duration,
        opening_hours,
        location,
        highlights,
        trip_advisor_url,
        created_at,
        updated_at,
        activity_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        ),
        activity_reviews (
          id,
          author,
          rating,
          comment,
          review_date
        )
      `)
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.error('Supabase fetch error:', error)
      return null
    }

    // Sort images by sort_order and ensure primary image is first
    const activityWithSortedImages = {
      ...data,
      activity_images: data.activity_images
        .sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1
          if (!a.is_primary && b.is_primary) return 1
          return a.sort_order - b.sort_order
        })
    }

    return activityWithSortedImages as Activity
  } catch (error) {
    console.error('Error fetching activity:', error)
    return null
  }
}

export async function getAllActivitySlugs(): Promise<string[]> {
  try {
    // Return empty array during build if environment variables are not set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }
    const { data, error } = await supabase
      .from('activities')
      .select('slug')

    if (error) {
      console.error('Supabase fetch error:', error)
      return []
    }

    return data.map(item => item.slug)
  } catch (error) {
    console.error('Error fetching activity slugs:', error)
    return []
  }
}