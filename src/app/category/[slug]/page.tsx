'use client'

import { useEffect, useState } from 'react'
import { CategoryHero } from '@/components/CategoryHero'
import { FilterBar } from '@/components/FilterBar'
import { CategoryTile } from '@/components/CategoryTile'
import { EditorPicksRow } from '@/components/EditorPicksRow'

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

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState<string>('')
  const [data, setData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!slug) return

    async function fetchData() {
      try {
        const response = await fetch(`/api/categories/${slug}`)
        
        if (!response.ok) {
          throw new Error(`Failed to load ${slug}: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to load ${slug}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {slug}...</p>
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

      {/* Editor's Picks Row */}
      {data.editorsPicks && data.editorsPicks.length > 0 && (
        <EditorPicksRow
          title="Editor's Picks"
          subtitle="Handpicked highlights around Istanbul"
          items={data.editorsPicks}
          favorites={favorites}
          onToggleFavorite={handleFavoriteToggle}
        />
      )}

      {/* Activities Grid */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 mb-4">
              All {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </h2>
            <p className="text-base font-medium text-slate-600 max-w-2xl mx-auto">
              Discover {data.totalCount || 0} carefully curated experiences in Istanbul
            </p>
          </div>

          {/* Grid */}
          {data.activities && data.activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data.activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="animate-fade-up"
                  style={{
                    animationDelay: `${index * 120}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <CategoryTile
                    {...activity}
                    isFavorite={favorites.has(activity.id)}
                    onToggleFavorite={handleFavoriteToggle}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                No {slug} found
              </h3>
              <p className="text-slate-600">
                We&apos;re working on adding more amazing experiences to Istanbul.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Map Toggle Section (for future implementation) */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="mx-auto max-w-6xl text-center">
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            Explore on Map
          </h3>
          <p className="text-slate-600 mb-6">
            Interactive map view coming soon
          </p>
          <button 
            disabled
            className="px-6 py-3 bg-slate-200 text-slate-500 rounded-full font-semibold cursor-not-allowed"
          >
            Map View (Coming Soon)
          </button>
        </div>
      </section>
    </div>
  )
}
