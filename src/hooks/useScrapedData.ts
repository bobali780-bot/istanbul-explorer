"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'

interface ScrapedItem {
  name: string
  description: string
  url: string
  coordinates?: [number, number]
  price?: string
  rating?: number
}

interface FeaturedItem {
  id?: string
  name: string
  description_short?: string
  description?: string
  booking_link?: string
  url?: string
  media?: Array<{ url: string; caption?: string }>
  price?: string
  rating?: number
  type?: string
}

interface ScrapedData {
  hotels: ScrapedItem[]
  restaurants: ScrapedItem[]
  activities: ScrapedItem[]
  shopping: ScrapedItem[]
}

interface UseScrapedDataReturn {
  data: ScrapedData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useScrapedData(): UseScrapedDataReturn {
  const [data, setData] = useState<ScrapedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching scraped data from all APIs...')

      const [hotelsRes, restaurantsRes, activitiesRes, shoppingRes] = await Promise.all([
        fetch('/api/scrape-hotels').then(res => res.json()),
        fetch('/api/scrape-restaurants').then(res => res.json()),
        fetch('/api/scrape-activities').then(res => res.json()),
        fetch('/api/scrape-shopping').then(res => res.json())
      ])

      if (!hotelsRes.success || !restaurantsRes.success || !activitiesRes.success || !shoppingRes.success) {
        throw new Error('Failed to fetch some scraped data')
      }

      const scrapedData: ScrapedData = {
        hotels: hotelsRes.data || [],
        restaurants: restaurantsRes.data || [],
        activities: activitiesRes.data || [],
        shopping: shoppingRes.data || []
      }

      setData(scrapedData)
      console.log('✅ All scraped data loaded successfully')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Error fetching scraped data:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch data on client side, not during build
    if (typeof window !== 'undefined') {
      fetchData()
    }
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

// Individual hooks for each category
export function useHotels() {
  const [hotels, setHotels] = useState<ScrapedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/scrape-hotels')
        const result = await response.json()

        if (!result.success) {
          throw new Error('Failed to fetch hotels')
        }

        setHotels(result.data || [])
      } catch (err) {
        console.error('❌ Error fetching hotels:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch hotels')
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      fetchHotels()
    }
  }, [])

  return { hotels, loading, error }
}

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<ScrapedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/scrape-restaurants')
        const result = await response.json()

        if (!result.success) {
          throw new Error('Failed to fetch restaurants')
        }

        setRestaurants(result.data || [])
      } catch (err) {
        console.error('❌ Error fetching restaurants:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurants')
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      fetchRestaurants()
    }
  }, [])

  return { restaurants, loading, error }
}

export function useActivities() {
  const [activities, setActivities] = useState<ScrapedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/scrape-activities')
        const result = await response.json()

        if (!result.success) {
          throw new Error('Failed to fetch activities')
        }

        setActivities(result.data || [])
      } catch (err) {
        console.error('❌ Error fetching activities:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch activities')
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      fetchActivities()
    }
  }, [])

  return { activities, loading, error }
}

export function useShopping() {
  const [shopping, setShopping] = useState<ScrapedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShopping = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/scrape-shopping')
        const result = await response.json()

        if (!result.success) {
          throw new Error('Failed to fetch shopping')
        }

        setShopping(result.data || [])
      } catch (err) {
        console.error('❌ Error fetching shopping:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch shopping')
      } finally {
        setLoading(false)
      }
    }

    if (typeof window !== 'undefined') {
      fetchShopping()
    }
  }, [])

  return { shopping, loading, error }
}

// Hook to get random featured items for homepage
interface FeaturedItems {
  hotels: FeaturedItem | null
  restaurants: FeaturedItem | null
  activities: FeaturedItem | null
  shopping: FeaturedItem | null
}

export function useFeaturedItems() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItems>({
    hotels: null,
    restaurants: null,
    activities: null,
    shopping: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback data in case API fails
  const fallbackItems: FeaturedItems = useMemo(() => ({
    hotels: {
      name: "Four Seasons Hotel Istanbul at Sultanahmet",
      description_short: "Luxury hotel in historic Sultanahmet with stunning Hagia Sophia views",
      booking_link: "https://www.booking.com/hotel/tr/four-seasons-sultanahmet.html",
      media: [{ url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" }],
      price: "$$$$",
      rating: 4.7,
      type: "hotels"
    },
    restaurants: {
      name: "Balıkçı Sabahattin",
      description_short: "Famous seafood restaurant serving fresh fish and traditional Turkish meze",
      booking_link: "https://www.tripadvisor.com/Restaurant_Review-g293974-d696542-Reviews-Balikci_Sabahattin-Istanbul.html",
      media: [{ url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d" }],
      price: "$$$",
      rating: 4.5,
      type: "restaurants"
    },
    activities: {
      name: "Hagia Sophia Skip-the-Line Entry",
      description_short: "Skip the queues and explore this architectural masterpiece with audio guide",
      booking_link: "https://www.viator.com/tours/Istanbul/Skip-the-Line-Hagia-Sophia-Entry-Ticket-with-Audio-Guide/d585-5502HSTOUR",
      media: [{ url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200" }],
      price: "$$",
      rating: 4.5,
      type: "activities"
    },
    shopping: {
      name: "Grand Bazaar (Kapalıçarşı)",
      description_short: "One of the world's oldest covered markets with 4,000+ shops",
      booking_link: "https://www.tripadvisor.com/Attraction_Review-g293974-d294792-Reviews-Grand_Bazaar-Istanbul.html",
      media: [{ url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96" }],
      price: "$$",
      rating: 4.3,
      type: "shopping"
    }
  }), [])

  const getRandomItem = (array: any[]): any | null => {
    if (!array || array.length === 0) return null
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  }

  const fetchFeaturedItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🎲 Fetching random featured items for homepage...')

      const [hotelsRes, restaurantsRes, activitiesRes, shoppingRes] = await Promise.allSettled([
        fetch('/api/scrape-hotels').then(res => res.json()),
        fetch('/api/scrape-restaurants').then(res => res.json()),
        fetch('/api/scrape-activities').then(res => res.json()),
        fetch('/api/scrape-shopping').then(res => res.json())
      ])

      const featured: FeaturedItems = {
        hotels: null,
        restaurants: null,
        activities: null,
        shopping: null
      }

      // Process hotels
      if (hotelsRes.status === 'fulfilled' && hotelsRes.value.success) {
        const randomHotel = getRandomItem(hotelsRes.value.data)
        if (randomHotel) {
          featured.hotels = {
            ...randomHotel,
            type: 'hotels'
          }
        }
      }

      // Process restaurants
      if (restaurantsRes.status === 'fulfilled' && restaurantsRes.value.success) {
        const randomRestaurant = getRandomItem(restaurantsRes.value.data)
        if (randomRestaurant) {
          featured.restaurants = {
            ...randomRestaurant,
            type: 'restaurants'
          }
        }
      }

      // Process activities
      if (activitiesRes.status === 'fulfilled' && activitiesRes.value.success) {
        const randomActivity = getRandomItem(activitiesRes.value.data)
        if (randomActivity) {
          featured.activities = {
            ...randomActivity,
            type: 'activities'
          }
        }
      }

      // Process shopping
      if (shoppingRes.status === 'fulfilled' && shoppingRes.value.success) {
        const randomShopping = getRandomItem(shoppingRes.value.data)
        if (randomShopping) {
          featured.shopping = {
            ...randomShopping,
            type: 'shopping'
          }
        }
      }

      // Use fallback for any failed categories
      Object.keys(featured).forEach((key) => {
        const categoryKey = key as keyof FeaturedItems
        if (!featured[categoryKey]) {
          featured[categoryKey] = fallbackItems[categoryKey]
          console.log(`📦 Using fallback data for ${categoryKey}`)
        }
      })

      setFeaturedItems(featured)
      console.log('✅ Featured items loaded successfully')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Error fetching featured items:', errorMessage)
      setError(errorMessage)
      // Use all fallback data on error
      setFeaturedItems(fallbackItems)
    } finally {
      setLoading(false)
    }
  }, [fallbackItems])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchFeaturedItems()
    }
  }, [fetchFeaturedItems])

  return {
    featuredItems,
    loading,
    error,
    refetch: fetchFeaturedItems
  }
}
