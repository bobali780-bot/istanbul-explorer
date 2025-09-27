import { supabase, type Activity } from './supabase'

export async function getActivities(): Promise<Activity[]> {
  try {
    // Return empty array during build if environment variables are not set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    // First get activities
    const { data: activities, error: activitiesError } = await supabase
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
        address,
        district,
        meta_title,
        meta_description,
        is_featured,
        popularity_score,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .order('popularity_score', { ascending: false })

    if (activitiesError) {
      console.error('Supabase activities fetch error:', activitiesError)
      return []
    }

    if (!activities || activities.length === 0) {
      console.log('No activities found in database')
      return []
    }

    // Get media for all activities
    const { data: media } = await supabase
      .from('universal_media')
      .select('*')
      .eq('entity_type', 'activity')
      .in('entity_id', activities.map(a => a.id))
      .order('sort_order', { ascending: true })

    // Get reviews for all activities
    const { data: reviews } = await supabase
      .from('universal_reviews')
      .select('*')
      .eq('entity_type', 'activity')
      .in('entity_id', activities.map(a => a.id))
      .order('review_date', { ascending: false })

    // Combine data
    const activitiesWithMedia = activities.map(activity => {
      const activityMedia = media?.filter(m => m.entity_id === activity.id) || []
      const activityReviews = reviews?.filter(r => r.entity_id === activity.id) || []

      // Sort media by primary first, then sort_order
      const sortedMedia = activityMedia.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return a.sort_order - b.sort_order
      })

      return {
        ...activity,
        activity_images: sortedMedia.map(m => ({
          id: m.id,
          image_url: m.media_url,
          alt_text: m.alt_text,
          is_primary: m.is_primary,
          sort_order: m.sort_order
        })),
        activity_reviews: activityReviews.map(r => ({
          id: r.id,
          author: r.reviewer_name,
          rating: r.rating,
          comment: r.content,
          review_date: r.review_date
        }))
      }
    })

    console.log(`Fetched ${activitiesWithMedia.length} activities`)
    return activitiesWithMedia as unknown as Activity[]
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

    // First get the activity
    const { data: activity, error: activityError } = await supabase
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
        address,
        district,
        meta_title,
        meta_description,
        is_featured,
        popularity_score,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (activityError || !activity) {
      console.error('Supabase activity fetch error:', activityError)
      return null
    }

    // Get media for this activity
    const { data: media } = await supabase
      .from('universal_media')
      .select('*')
      .eq('entity_type', 'activity')
      .eq('entity_id', activity.id)
      .order('sort_order', { ascending: true })

    // Get reviews for this activity
    const { data: reviews } = await supabase
      .from('universal_reviews')
      .select('*')
      .eq('entity_type', 'activity')
      .eq('entity_id', activity.id)
      .order('review_date', { ascending: false })

    // Sort media by primary first, then sort_order
    const sortedMedia = (media || []).sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return a.sort_order - b.sort_order
    })

    // Combine data
    const activityWithMedia = {
      ...activity,
      activity_images: sortedMedia.map(m => ({
        id: m.id,
        activity_id: m.activity_id,
        image_url: m.media_url,
        alt_text: m.alt_text,
        is_primary: m.is_primary,
        sort_order: m.sort_order,
        created_at: m.created_at
      })),
      activity_reviews: (reviews || []).map(r => ({
        id: r.id.toString(),
        activity_id: r.activity_id,
        name: r.reviewer_name,
        rating: r.rating,
        text: r.content,
        date: r.review_date,
        verified: false,
        created_at: r.created_at
      }))
    }

    return activityWithMedia as Activity
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