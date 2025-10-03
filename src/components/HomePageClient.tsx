'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Hero } from '@/components/Hero'
import { EditorPicks } from '@/components/EditorPicks'
import { CategoryGrid } from '@/components/CategoryGrid'
import { GoogleAdsSection } from '@/components/GoogleAdsSection'

// Lazy load heavy components - loads after page is interactive
const AIChatbot = dynamic(() => import('@/components/AIChatbot').then(mod => ({ default: mod.AIChatbot })), {
  ssr: false,
  loading: () => null
})

const IstanbulMap = dynamic(() => import('@/components/IstanbulMap').then(mod => ({ default: mod.IstanbulMap })), {
  ssr: false,
  loading: () => <div className="h-96 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center"><span className="text-slate-500">Loading map...</span></div>
})

interface MapItem {
  id: string
  name: string
  category: 'activities' | 'hotels' | 'shopping' | 'food-drink'
  coordinates: {
    lat: number
    lng: number
  }
  rating?: number
  neighborhood?: string
  slug: string
}

export function HomePageClient() {
  const [mapItems, setMapItems] = useState<MapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMapData() {
      try {
        const response = await fetch('/api/map-data')
        if (!response.ok) {
          throw new Error('Failed to fetch map data')
        }
        
        const data = await response.json()
        if (data.success) {
          setMapItems(data.places)
          console.log(`Loaded ${data.places.length} places for map`)
        } else {
          throw new Error(data.error || 'Failed to load map data')
        }
      } catch (err) {
        console.error('Error fetching map data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map data')
        
        // Fallback to empty array if API fails
        setMapItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchMapData()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <div className="pt-[100svh]">
        <EditorPicks />
        <CategoryGrid />
        
        {/* Map section */}
        <div className="mt-16">
          {loading ? (
            <div className="mx-auto max-w-7xl px-5 py-16">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Explore Istanbul
                </h2>
                <p className="mt-2 text-lg text-slate-600">Loading interactive map...</p>
              </div>
              <div className="h-[500px] rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">⏳</div>
                  <p className="text-lg font-medium text-slate-700 mb-2">Loading Map...</p>
                  <p className="text-sm text-slate-500">Please wait while we load your places</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-7xl px-5 py-16">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Explore Istanbul
                </h2>
                <p className="mt-2 text-lg text-slate-600">Interactive map with real places</p>
              </div>
              <div className="h-[500px] rounded-3xl bg-gradient-to-br from-red-100 to-red-200 shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">⚠️</div>
                  <p className="text-lg font-medium text-red-700 mb-2">Map Loading Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <IstanbulMap items={mapItems} />
          )}
        </div>
        
        {/* Google Ads section */}
        <GoogleAdsSection />
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </main>
  )
}
