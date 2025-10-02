import { supabase, type Activity } from './supabase'

export async function getActivities(): Promise<Activity[]> {
  try {
    // Return empty array during build if environment variables are not set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    // First get activities - optimized with fewer columns for listing
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select(`
        id,
        name,
        slug,
        description,
        short_overview,
        rating,
        review_count,
        price_range,
        price_from,
        duration,
        location,
        district,
        is_featured,
        popularity_score
      `)
      .eq('is_active', true)
      .order('popularity_score', { ascending: false })
      .limit(50)

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

    // Try to find the activity in different tables
    let activity = null
    let activityError = null
    let entityType = 'activity'

    // Check activities table first
    let { data, error } = await supabase
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
        price_from,
        price_to,
        currency,
        duration,
        opening_hours,
        location,
        highlights,
        trip_advisor_url,
        address,
        district,
        coordinates,
        meta_title,
        meta_description,
        is_featured,
        popularity_score,
        why_visit,
        accessibility,
        facilities,
        practical_info,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (!error && data) {
      activity = data
      entityType = 'activity'
    } else {
      // Try hotels table
      const hotelsResult = await supabase
        .from('hotels')
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
          price_from,
          price_to,
          currency,
          price_unit,
          opening_hours,
          location,
          highlights,
          trip_advisor_url,
          address,
          district,
          coordinates,
          meta_title,
          meta_description,
          is_featured,
          popularity_score,
          why_visit,
          accessibility,
          facilities,
          practical_info,
          created_at,
          updated_at
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (!hotelsResult.error && hotelsResult.data) {
        activity = hotelsResult.data
        entityType = 'hotel'
      } else {
        // Try shopping table
        const shoppingResult = await supabase
          .from('shopping')
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
            price_from,
            price_to,
            currency,
            opening_hours,
            location,
            highlights,
            trip_advisor_url,
            address,
            district,
            coordinates,
            meta_title,
            meta_description,
            is_featured,
            popularity_score,
            why_visit,
            accessibility,
            facilities,
            practical_info,
            created_at,
            updated_at
          `)
          .eq('slug', slug)
          .eq('is_active', true)
          .single()

        if (!shoppingResult.error && shoppingResult.data) {
          activity = shoppingResult.data
          entityType = 'shop'
        } else {
          // Try restaurants table
          const restaurantsResult = await supabase
            .from('restaurants')
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
              price_from,
              price_to,
              currency,
              price_unit,
              opening_hours,
              location,
              highlights,
              trip_advisor_url,
              address,
              district,
              coordinates,
              meta_title,
              meta_description,
              is_featured,
              popularity_score,
              why_visit,
              accessibility,
              facilities,
              practical_info,
              created_at,
              updated_at
            `)
            .eq('slug', slug)
            .eq('is_active', true)
            .single()

          if (!restaurantsResult.error && restaurantsResult.data) {
            activity = restaurantsResult.data
            entityType = 'restaurant'
          } else {
            activityError = restaurantsResult.error
          }
        }
      }
    }

    if (activityError || !activity) {
      console.error('Supabase activity fetch error:', activityError)
      return null
    }

    // Get media for this activity
    const { data: media } = await supabase
      .from('universal_media')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', activity.id)
      .order('sort_order', { ascending: true })

    // Get reviews for this activity
    const { data: reviews } = await supabase
      .from('universal_reviews')
      .select('*')
      .eq('entity_type', entityType)
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

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371 // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

// Get nearby venues from any category table
export async function getNearbyVenues(
  lat: number,
  lng: number,
  table: 'activities' | 'hotels' | 'shopping' | 'restaurants',
  excludeId?: number,
  radiusKm: number = 2,
  limit: number = 6
): Promise<any[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return []
    }

    // Fetch all active venues from the table
    const { data, error } = await supabase
      .from(table)
      .select('id, name, slug, description, rating, review_count, price_range, price_from, price_to, currency, price_unit, location, coordinates, district')
      .eq('is_active', true)

    if (error || !data) {
      console.error('Error fetching nearby venues:', error)
      return []
    }

    // Get entity type for media query
    const entityTypeMap: { [key: string]: string } = {
      'activities': 'activity',
      'hotels': 'hotel',
      'shopping': 'shop',
      'restaurants': 'restaurant'
    }
    const entityType = entityTypeMap[table] || 'activity'

    // Fetch only primary images for performance
    const venueIds = data.map(v => v.id)
    const { data: media } = await supabase
      .from('universal_media')
      .select('entity_id, media_url')
      .eq('entity_type', entityType)
      .in('entity_id', venueIds)
      .eq('is_primary', true)
      .limit(venueIds.length)

    // Map images to venues
    const venueImages: { [key: number]: string } = {}
    if (media) {
      media.forEach(m => {
        if (!venueImages[m.entity_id]) {
          venueImages[m.entity_id] = m.media_url
        }
      })
    }

    // Calculate distances and filter
    const venuesWithDistance = data
      .filter(venue => {
        // Exclude current venue
        if (excludeId && venue.id === excludeId) return false

        // Check if venue has valid coordinates
        if (!venue.coordinates || !venue.coordinates.lat || !venue.coordinates.lng) return false

        return true
      })
      .map(venue => {
        const distance = calculateDistance(
          lat,
          lng,
          venue.coordinates.lat,
          venue.coordinates.lng
        )

        return {
          ...venue,
          image_url: venueImages[venue.id] || null,
          distance,
          walkingTime: Math.round(distance * 12) // ~12 minutes per km walking
        }
      })
      .filter(venue => venue.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)

    // If we have fewer than 3 results, try expanding radius to 5km
    if (venuesWithDistance.length < 3 && radiusKm < 5) {
      return getNearbyVenues(lat, lng, table, excludeId, 5, limit)
    }

    return venuesWithDistance
  } catch (error) {
    console.error('Error in getNearbyVenues:', error)
    return []
  }
}