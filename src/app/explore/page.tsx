'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Filter, X } from "lucide-react"
import { CategoryTile } from "@/components/CategoryTile"
import { AIChatbot } from "@/components/AIChatbot"

interface Venue {
  id: number
  name: string
  slug: string
  category: string
  location: string
  district: string
  rating: number
  review_count: number
  price_range?: string
  image_url?: string
  short_overview?: string
}

export default function ExplorePage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [minRating, setMinRating] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'activities', label: 'Activities', color: 'bg-blue-500' },
    { id: 'shopping', label: 'Shopping', color: 'bg-purple-500' },
    { id: 'food-drink', label: 'Food & Drink', color: 'bg-orange-500' },
    { id: 'hotels', label: 'Hotels', color: 'bg-green-500' }
  ]

  const districts = ['Sultanahmet', 'Beyoğlu', 'Beşiktaş', 'Kadıköy', 'Üsküdar', 'Fatih', 'Sarıyer']

  useEffect(() => {
    // Fetch all venues from API
    fetchAllVenues()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = venues

    if (searchQuery) {
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(v => v.category === selectedCategory)
    }

    if (selectedDistrict) {
      filtered = filtered.filter(v =>
        v.district?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
        v.location?.toLowerCase().includes(selectedDistrict.toLowerCase())
      )
    }

    if (minRating > 0) {
      filtered = filtered.filter(v => (v.rating || 0) >= minRating)
    }

    setFilteredVenues(filtered)
  }, [searchQuery, selectedCategory, selectedDistrict, minRating, venues])

  async function fetchAllVenues() {
    setLoading(true)
    try {
      const response = await fetch('/api/explore/all-venues')
      const data = await response.json()
      setVenues(data.venues || [])
      setFilteredVenues(data.venues || [])
    } catch (error) {
      console.error('Failed to fetch venues:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedDistrict(null)
    setMinRating(0)
  }

  const activeFiltersCount = [selectedCategory, selectedDistrict, minRating > 0].filter(Boolean).length

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section
          className="relative text-white py-16 pt-24 bg-cover bg-center"
          style={{
            backgroundImage: `url(/Explore.jpg?v=${Date.now()})`
          }}
        >
        <div className="container mx-auto px-8 max-w-6xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Istanbul
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover the perfect places for your Istanbul adventure
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for places, neighborhoods, or experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-8 max-w-6xl py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Filters:</span>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={selectedCategory === cat.id ? cat.color : ''}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* District Filter */}
            <select
              value={selectedDistrict || ''}
              onChange={(e) => setSelectedDistrict(e.target.value || null)}
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              <option value="">All Districts</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600"
              >
                <X className="w-4 h-4 mr-1" />
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-8 max-w-6xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredVenues.length} {filteredVenues.length === 1 ? 'Place' : 'Places'} Found
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Sorted by popularity</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading venues...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No venues found matching your filters</p>
            <Button onClick={clearFilters} className="mt-4">Clear Filters</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue, index) => (
              <CategoryTile
                key={`${venue.category}-${venue.id}-${index}`}
                id={venue.id.toString()}
                title={venue.name}
                description={venue.short_overview || `Explore ${venue.name} in ${venue.district || venue.location}`}
                rating={venue.rating || 4.5}
                reviewCount={venue.review_count || 0}
                location={venue.location}
                neighborhood={venue.district}
                price={venue.price_range}
                category={venue.category}
                slug={venue.slug}
                heroImage={venue.image_url || undefined}
              />
            ))}
          </div>
        )}
      </section>
      </div>

      {/* AI Chatbot - Outside main container for proper fixed positioning */}
      <AIChatbot />
    </>
  )
}
