'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Star, Clock, ExternalLink, Loader2 } from 'lucide-react'

interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  price_level?: number
  types: string[]
  photos?: Array<{
    photo_reference: string
    html_attributions: string[]
  }>
  opening_hours?: {
    open_now: boolean
  }
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface GoogleLiveSearchProps {
  onPlaceSelect?: (place: PlaceResult) => void
  placeholder?: string
  location?: string
  radius?: number
  types?: string[]
  className?: string
}

export function GoogleLiveSearch({
  onPlaceSelect,
  placeholder = "Search for places in Istanbul...",
  location = "41.0082,28.9784", // Istanbul coordinates
  radius = 50000, // 50km radius
  types = ['tourist_attraction', 'restaurant', 'lodging', 'shopping_mall'],
  className = ""
}: GoogleLiveSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Search function using Google Places API
  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/google-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          location,
          radius,
          types
        })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
      setIsOpen(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Google Places search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchPlaces(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handlePlaceSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handlePlaceSelect = (place: PlaceResult) => {
    setQuery(place.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    onPlaceSelect?.(place)
  }

  const getPlaceTypeDisplay = (types: string[]) => {
    const typeMap: Record<string, string> = {
      'tourist_attraction': '🏛️ Attraction',
      'restaurant': '🍽️ Restaurant', 
      'lodging': '🏨 Hotel',
      'shopping_mall': '🛍️ Shopping',
      'museum': '🏛️ Museum',
      'park': '🌳 Park',
      'church': '⛪ Religious',
      'mosque': '🕌 Mosque'
    }
    
    for (const type of types) {
      if (typeMap[type]) return typeMap[type]
    }
    return '📍 Place'
  }

  const getPriceLevel = (level?: number) => {
    if (!level) return ''
    return '💰'.repeat(level)
  }

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.length === 0 && !isLoading && query.length >= 2 && (
            <div className="px-4 py-6 text-center text-slate-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p>No places found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for restaurants, hotels, or attractions in Istanbul</p>
            </div>
          )}

          {results.map((place, index) => (
            <div
              key={place.place_id}
              onClick={() => handlePlaceSelect(place)}
              className={`px-4 py-3 cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Place Name & Type */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 truncate">{place.name}</h3>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600 flex-shrink-0">
                      {getPlaceTypeDisplay(place.types)}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{place.formatted_address}</span>
                  </div>

                  {/* Rating & Details */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {place.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{place.rating}</span>
                      </div>
                    )}
                    
                    {place.price_level && (
                      <span>{getPriceLevel(place.price_level)}</span>
                    )}
                    
                    {place.opening_hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className={place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}>
                          {place.opening_hours.open_now ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Select Indicator */}
                <div className="ml-2 flex-shrink-0">
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
