'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { CategoryHero } from '@/components/CategoryHero'
import { FilterBar } from '@/components/FilterBar'
import { CategoryTile } from '@/components/CategoryTile'
import { EditorPicksRow } from '@/components/EditorPicksRow'
import { EditorPickTile } from '@/components/EditorPickTile'
import { ChevronDown, ChevronUp, Filter, X, ArrowLeft, ArrowRight } from 'lucide-react'

// ⚡ Performance Optimization: Lazy load ActivitiesMap only when needed
// Map loads only when user clicks "Open Map", reducing initial bundle size
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

// Types for our data structure
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
  coordinates?: {
    lat: number
    lng: number
  }
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
    heroImage?: string
    averageRating: number
    topNeighborhoods: string[]
    isTrending: boolean
    activityCount: number
  }
  filters: {
    neighborhoods: Array<{ value: string; label: string; count: number }>
    priceRanges: Array<{ value: string; label: string; count: number }>
    vibes: Array<{ value: string; label: string; count: number }>
    durations: Array<{ value: string; label: string; count: number }>
    amenities: Array<{ value: string; label: string; count: number }>
  }
  editorsPicks: Activity[]
  totalCount: number
}

export default function ActivitiesPage() {
  const [data, setData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/categories/activities')
        
        if (!response.ok) {
          throw new Error(`Failed to load activities: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities')
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
        const section = document.getElementById('all-activities-section')
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
      setShowScrollHint(false)
    }
  }

  const toggleMap = () => {
    setMapExpanded(!mapExpanded)
  }

  // Optimized Intersection Observer for scroll animations
  useEffect(() => {
    if (!data) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target)
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Trigger earlier for smoother experience
      }
    )

    // Debounce element observation
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-animate')
      elements.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [data])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
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
              <p className="text-slate-600">Handpicked highlights that capture the soul of Istanbul</p>
            </div>
          </div>

          {/* Horizontal scroller with hover arrows */}
          <div ref={scrollRef} className="no-scrollbar group mx-auto max-w-[100vw] overflow-x-auto px-5 pt-2 pb-8" style={{ backgroundColor: 'white', overflowY: 'visible' }}>
            <div className="flex snap-x snap-mandatory py-2" style={{ backgroundColor: 'white' }}>
              {data.editorsPicks.map((activity, index) => {
                // Cycle through colors: blue, green, red, yellow
                const colors = ['blue', 'green', 'red', 'yellow'] as const
                const colorVariant = colors[index % colors.length]
                
                return (
                  <div key={activity.id} className="flex-shrink-0 snap-start" style={{ paddingRight: index === data.editorsPicks.length - 1 ? '0' : '24px', backgroundColor: 'white' }}>
                    <EditorPickTile
                      {...activity}
                      isFavorite={favorites.has(activity.id)}
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

      {/* All Activities Section - Luxury Magazine Grid */}
      <section id="all-activities-section" className="scroll-animate py-24 px-6 bg-gradient-to-b from-white to-slate-50 opacity-0 translate-y-8 transition-all duration-1000 ease-out">
        <div className={`mx-auto transition-all duration-700 ease-out ${isExpanded ? 'max-w-full' : 'max-w-7xl'}`}>
          <div className={`relative bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/30 transition-all duration-700 ease-out ${isExpanded ? 'p-12' : 'p-12'}`}>
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-[2rem]"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  All Activities
                </h2>
                <p className="text-lg font-medium text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Discover {data.totalCount || 0} carefully curated experiences across Istanbul
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
                            {data.filters?.neighborhoods.slice(0, 5).map((neighborhood) => (
                              <label key={neighborhood.value} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span>{neighborhood.label}</span>
                                <span className="text-slate-500">({neighborhood.count})</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Price Range */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Price Range</h4>
                          <div className="space-y-2">
                            {data.filters?.priceRanges.slice(0, 4).map((price) => (
                              <label key={price.value} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span>{price.label}</span>
                                <span className="text-slate-500">({price.count})</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Duration */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Duration</h4>
                          <div className="space-y-2">
                            {data.filters?.durations.slice(0, 4).map((duration) => (
                              <label key={duration.value} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span>{duration.label}</span>
                                <span className="text-slate-500">({duration.count})</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activities Grid - Smoothly shifts right when filters are shown */}
                <div className={`flex-1 transition-all duration-700 ease-out ${showFilters && isExpanded ? 'translate-x-8' : 'translate-x-0'}`}>
                  {data.activities && data.activities.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-12 transition-all duration-300 min-h-[600px]`}>
                      {/* Optimized Grid Layout - Show activities based on expansion state */}
                      {data.activities.slice(0, isExpanded ? data.activities.length : 6).map((activity, index) => {
                        return (
                          <div
                            key={activity.id}
                            className="group gpu-accelerate hover:scale-[1.02] transition-transform duration-300 ease-out hover:-translate-y-1"
                            style={{
                              animationDelay: `${index * 50}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
                              <CategoryTile
                                {...activity}
                                isFavorite={favorites.has(activity.id)}
                                onToggleFavorite={handleFavoriteToggle}
                              />
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Empty placeholder tiles to maintain 6-tile grid layout */}
                      {!isExpanded && data.activities.length < 6 && 
                        Array.from({ length: 6 - data.activities.length }).map((_, index) => (
                          <div
                            key={`placeholder-${index}`}
                            className="invisible"
                            style={{
                              animationDelay: `${(data.activities.length + index) * 50}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="h-[500px] rounded-2xl bg-transparent"></div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-24">
                      <div className="text-8xl mb-6 opacity-50">🏛️</div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-4">
                        No activities found
                      </h3>
                      <p className="text-slate-600 text-lg">
                        We&apos;re working on adding more amazing experiences to Istanbul.
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
                        
                        <span className="relative z-10">{isExpanded ? 'Show Less' : 'See All Experiences'}</span>
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

      {/* Explore on Map Section - Premium Hero Map */}
      <section className="scroll-animate py-24 px-6 bg-gradient-to-b from-slate-50 to-white opacity-0 translate-y-8 transition-all duration-1000 ease-out">
        <div className="mx-auto max-w-7xl">
          {/* Map Preview/Trigger */}
          {!mapExpanded && (
            <div 
              onClick={toggleMap}
              className="relative bg-white/70 backdrop-blur-2xl rounded-[2rem] p-12 shadow-2xl border border-white/30 cursor-pointer group hover:shadow-3xl transition-all duration-700 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-[2rem]"></div>
              
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6">🗺️</div>
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Explore on Map
                </h2>
                <p className="text-lg font-medium text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                  Discover all activities across Istanbul in an interactive map experience
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                  Open Map
                </button>
              </div>
              
              {/* Hover Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 pointer-events-none"></div>
            </div>
          )}

          {/* Expanded Map */}
          {mapExpanded && (
            <div className={`relative bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/30 overflow-hidden transition-all duration-1000 ease-out ${mapExpanded ? 'h-[80vh]' : 'h-40'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-[2rem]"></div>
              
              {/* Map Title Overlay */}
              <div className="absolute top-8 left-8 z-20">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/50 shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900">
                    Explore Activities on the Map
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={toggleMap}
                className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              >
                <X className="w-6 h-6 text-slate-700" />
              </button>

              {/* Activities Map */}
              <ActivitiesMap 
                activities={data.activities || []}
                favorites={favorites}
                onToggleFavorite={handleFavoriteToggle}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}