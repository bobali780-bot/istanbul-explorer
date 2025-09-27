import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

// Type definitions for our database schema
export interface Activity {
  id: number
  name: string
  slug: string
  description?: string
  short_overview?: string
  full_description?: string
  seo_hook?: string
  booking_url?: string
  rating?: number
  review_count?: number
  price_range?: string
  duration?: string
  opening_hours?: string
  location?: string
  highlights?: string[]
  trip_advisor_url?: string
  why_visit?: string[]
  accessibility?: Record<string, any>
  facilities?: Record<string, any>
  practical_info?: Record<string, any>
  coordinates?: { lat: number; lng: number }
  category?: string
  created_at: string
  updated_at: string
  activity_images: ActivityImage[]
  activity_reviews?: ActivityReview[]
}

export interface ActivityImage {
  id: number
  activity_id: number
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface ActivityReview {
  id: string
  activity_id: number
  name: string
  rating: number
  text: string
  date: string
  verified?: boolean
  created_at: string
}