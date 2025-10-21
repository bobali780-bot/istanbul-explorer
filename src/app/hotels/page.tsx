'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { CategoryHero } from '@/components/CategoryHero'
import { FilterBar } from '@/components/FilterBar'
import { CategoryTile } from '@/components/CategoryTile'
import { EditorPickTile } from '@/components/EditorPickTile'
import { ChevronDown, ChevronUp, Filter, X, ArrowLeft, ArrowRight } from 'lucide-react'

// ⚡ Performance Optimization: Lazy load ActivitiesMap only when needed
const ActivitiesMap = dynamic(() => import('@/components/ActivitiesMap').then(mod => ({ default: mod.ActivitiesMap })), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading interactive map...</p>
      </div>
    </div>
  )
})

// Types for our data structure (same as activities page)
interface Activity {
  id: string
  title: string
  description: string
  rating: number
  reviewCount: number
  location: string
  neighborhood?: string
  price?: string
  duration?: string
  category: string
  slug: string
  isEditorPick?: boolean
  heroImage?: string
  whyVisit?: string
}

interface CategoryData {
  category: string
  activities: Activity[]
  heroData: {
    title: string
    subheading: string
    heroImage: string
    averageRating: number
    topNeighborhoods: string[]
    isTrending: boolean
    activityCount: number
  } | null
  filters: {
    neighborhoods: Array<{ value: string; label: string; count: number }>
    priceRanges: Array<{ value: string; label: string; count: number }>
    vibes: Array<{ value: string; label: string; count: number }>
    durations: Array<{ value: string; label: string; count: number }>
    amenities: Array<{ value: string; label: string; count: number }>
  } | null
  editorsPicks: Activity[]
  totalCount: number
}

export default function HotelsPage() {
  const [data, setData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/categories/hotels')

        if (!response.ok) {
          throw new Error(`Failed to load hotels: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hotels')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFavoriteToggle = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const handleFilterChange = (filterType: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: values
    }))
  }

  const handleHandpickedToggle = (enabled: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      handpicked: enabled ? ['only'] : []
    }))
  }

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    
    // Show/hide filters simultaneously with expansion
    if (newExpanded) {
      setShowFilters(true) // Show immediately for simultaneous animation
    } else {
      setShowFilters(false)
      // Auto-scroll to the section when collapsing
      setTimeout(() => {
        const section = document.getElementById('all-hotels-section')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hotels...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
  return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              Unable to load hotels
            </h3>
            <p className="text-slate-600">
              {error || 'Something went wrong while loading the hotels.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Category Hero */}
      {data.heroData && (
        <CategoryHero
          title={data.heroData.title}
          subheading={data.heroData.subheading}
          heroImage={data.heroData.heroImage}
          averageRating={data.heroData.averageRating}
          topNeighborhoods={data.heroData.topNeighborhoods}
          isTrending={data.heroData.isTrending}
          activityCount={data.heroData.activityCount}
        />
      )}

      {/* Filter Bar */}
      {data.filters && (
        <FilterBar
          filters={data.filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          showHandpickedOnly={true}
          onHandpickedToggle={handleHandpickedToggle}
        />
      )}

      {/* Editor's Picks Section - Homepage Style */}
      {data.editorsPicks && data.editorsPicks.length > 0 && (
        <section aria-labelledby="editors-picks" className="relative mx-auto max-w-[100vw] py-16 overflow-visible" style={{ backgroundColor: 'white' }}>
          <div className="mx-auto max-w-6xl px-5" style={{ backgroundColor: 'white' }}>
            {/* Centered header */}
            <div className="mb-6 text-center">
              <h2 id="editors-picks" className="text-2xl font-extrabold tracking-tight sm:text-3xl">Editor&apos;s Picks</h2>
              <p className="text-slate-600">Handpicked highlights for the perfect Istanbul stay</p>
            </div>
          </div>

          {/* Horizontal scroller with hover arrows */}
          <div ref={scrollRef} className="no-scrollbar group mx-auto max-w-[100vw] overflow-x-auto px-5 pt-2 pb-8" style={{ backgroundColor: 'white', overflowY: 'visible' }}>
            <div className="flex snap-x snap-mandatory py-2" style={{ backgroundColor: 'white' }}>
              {data.editorsPicks.map((hotel, index) => {
                // Cycle through colors: blue, green, red, yellow
                const colors = ['blue', 'green', 'red', 'yellow'] as const
                const colorVariant = colors[index % colors.length]
                
                return (
                  <div key={hotel.id} className="flex-shrink-0 snap-start" style={{ paddingRight: index === data.editorsPicks.length - 1 ? '0' : '24px', backgroundColor: 'white' }}>
                    <EditorPickTile
                      {...hotel}
                      isFavorite={favorites.has(hotel.id)}
                      onToggleFavorite={handleFavoriteToggle}
                      colorVariant={colorVariant}
                    />
                  </div>
                )
              })}
            </div>
            
            {/* Clickable arrows */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 focus:outline-none"
              aria-label="Scroll left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white transition-colors">
                <ArrowLeft className="h-6 w-6 text-slate-700" />
              </div>
            </button>
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 focus:outline-none"
              aria-label="Scroll right"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white transition-colors">
                <ArrowRight className="h-6 w-6 text-slate-700" />
              </div>
            </button>
          </div>
        </section>
      )}

      {/* All Hotels Section - Frosted Glass Container */}
      <section id="all-hotels-section" className="py-16 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/8 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Section Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 mb-4">
                  All Hotels
                </h2>
                <p className="text-base font-medium text-slate-600 max-w-2xl mx-auto">
                  Discover {data.totalCount || 0} carefully curated accommodations in Istanbul
                </p>
                  </div>

              {/* Main Container with Filter Sidebar */}
              <div className="relative flex gap-8">
                {/* Filter Sidebar - Slides in from left */}
                <div className={`transition-all duration-700 ease-out ${showFilters && isExpanded ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full overflow-hidden'}`}>
                  {showFilters && isExpanded && (
                    <div className="sticky top-6 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 h-fit">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Filter className="w-5 h-5" />
                          Filters
                        </h3>
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Filter Content */}
                      <div className="space-y-6">
                        {/* Neighborhoods */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Neighborhoods</h4>
                          <div className="space-y-2">
                            {data.filters?.neighborhoods.slice(0, 5).map((neighborhood, idx) => (
                              <label key={idx} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span>{neighborhood.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Price Range */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Price Range</h4>
                          <div className="space-y-2">
                            {data.filters?.priceRanges.slice(0, 4).map((price, idx) => (
                              <label key={idx} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span>{price.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Amenities */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Amenities</h4>
                          <div className="space-y-2">
                            {data.filters?.amenities.slice(0, 4).map((amenity, idx) => (
                              <label key={idx} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span>{amenity.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hotels Grid - Smoothly shifts right when filters are shown */}
                <div className={`flex-1 transition-all duration-700 ease-out ${showFilters && isExpanded ? 'translate-x-8' : 'translate-x-0'}`}>
                  {data.activities && data.activities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 min-h-[600px]">
                      {/* Show hotels based on expansion state */}
                      {data.activities.slice(0, isExpanded ? data.activities.length : 6).map((hotel, index) => (
                        <div
                          key={hotel.id}
                          className="animate-fade-up"
                          style={{
                            animationDelay: `${index * 120}ms`,
                            animationFillMode: 'both'
                          }}
                        >
                          <CategoryTile
                            {...hotel}
                            isFavorite={favorites.has(hotel.id)}
                            onToggleFavorite={handleFavoriteToggle}
                          />
                        </div>
                      ))}
                      
                      {/* Empty placeholder tiles to maintain 6-tile grid layout */}
                      {!isExpanded && data.activities.length < 6 && 
                        Array.from({ length: 6 - data.activities.length }).map((_, index) => (
                          <div
                            key={`placeholder-${index}`}
                            className="invisible animate-fade-up"
                            style={{
                              animationDelay: `${(data.activities.length + index) * 120}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="h-[500px] rounded-2xl bg-transparent"></div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🏨</div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                      No hotels found
                    </h3>
                    <p className="text-slate-600">
                      We&apos;re working on adding more amazing accommodations to Istanbul.
                    </p>
                  </div>
                )}

                  {/* Toggle Button */}
                  {data.activities && data.activities.length > 6 && (
                    <div className="text-center">
                      <button 
                        onClick={handleToggleExpanded}
                        className="group px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 mx-auto hover:bg-gradient-to-r relative overflow-hidden"
                      >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                        
                        <span className="relative z-10">{isExpanded ? 'Show Less' : 'See All Hotels'}</span>
                        <div className={`relative z-10 transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore on Map Section - Frosted Glass Container */}
      <section className="py-16 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/8 rounded-3xl"></div>
            
            {/* Map Title Overlay */}
            <div className="absolute top-6 left-6 z-20">
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
                <h3 className="text-lg font-semibold text-slate-900">
                  Explore Hotels on the Map
                </h3>
              </div>
            </div>

            {/* Hotels Map */}
            <ActivitiesMap 
              activities={data.activities || []}
              favorites={favorites}
              onToggleFavorite={handleFavoriteToggle}
            />
          </div>
        </div>
      </section>
    </div>
  )
}