'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Star, ExternalLink, Plus, Check, Loader2 } from 'lucide-react'

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

export default function GoogleSearchDemoPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [addedPlaces, setAddedPlaces] = useState<PlaceResult[]>([])
  const debounceRef = useRef<NodeJS.Timeout>()

  // Search function using Google Places API
  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
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
          location: "41.0082,28.9784", // Istanbul coordinates
          radius: 50000,
          types: ['tourist_attraction', 'restaurant', 'lodging', 'shopping_mall']
        })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
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

  const handlePlaceSelect = (place: PlaceResult) => {
    setSelectedPlace(place)
  }

  const addToQueue = (place: PlaceResult) => {
    if (!addedPlaces.find(p => p.place_id === place.place_id)) {
      setAddedPlaces(prev => [...prev, place])
    }
  }

  const isPlaceAdded = (placeId: string) => {
    return addedPlaces.some(p => p.place_id === placeId)
  }

  const sendToStaging = async () => {
    if (addedPlaces.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/google-to-staging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          places: addedPlaces
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Successfully added ${data.total_processed} places to staging! Check your admin staging area.`)
        setAddedPlaces([]) // Clear the queue
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending to staging:', error)
      alert('❌ Failed to send places to staging')
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Google Places Live Search Demo</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Search for places in Istanbul using Google Places API - Working Version!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="space-y-6">
            {/* Search Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Live Search
              </h2>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for restaurants, hotels, attractions in Istanbul..."
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                />
              </div>

              {/* Search Results */}
              {query.length >= 2 && (
                <div className="mt-4 max-h-64 overflow-y-auto">
                  {results.length === 0 && !isLoading ? (
                    <div className="text-center py-4 text-slate-500">
                      No places found for "{query}"
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {results.map((place) => (
                        <div
                          key={place.place_id}
                          onClick={() => handlePlaceSelect(place)}
                          className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-slate-900 truncate">{place.name}</h3>
                              <p className="text-sm text-slate-600 truncate">{place.formatted_address}</p>
                              {place.rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{place.rating}</span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs bg-white px-2 py-1 rounded-full text-slate-600 ml-2">
                              {getPlaceTypeDisplay(place.types)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 mt-4">
                <p className="font-medium mb-1">💡 Search Tips:</p>
                <ul className="space-y-1">
                  <li>• Try: "Blue Mosque", "Galata Tower", "Turkish restaurant"</li>
                  <li>• Results are filtered for Istanbul area (50km radius)</li>
                  <li>• Click on a result to see details</li>
                </ul>
              </div>
            </div>

            {/* Added Places Queue */}
            {addedPlaces.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Search Queue ({addedPlaces.length})
                </h3>
                
                <div className="space-y-2">
                  {addedPlaces.map((place) => (
                    <div key={place.place_id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-sm font-medium text-slate-900">{place.name}</span>
                      <button
                        onClick={() => setAddedPlaces(prev => prev.filter(p => p.place_id !== place.place_id))}
                        className="text-red-500 hover:bg-red-100 rounded px-2 py-1 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={sendToStaging}
                  disabled={isLoading}
                  className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      🚀 Add {addedPlaces.length} Places to Staging
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Selected Place Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Place Details
            </h2>

            {selectedPlace ? (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedPlace.name}</h3>
                  <p className="text-slate-600 mb-2">{selectedPlace.formatted_address}</p>
                  
                  {selectedPlace.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedPlace.rating}/5</span>
                    </div>
                  )}
                  
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {getPlaceTypeDisplay(selectedPlace.types)}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPlace.types.slice(0, 6).map((type) => (
                      <span key={type} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                        {type.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => addToQueue(selectedPlace)}
                    disabled={isPlaceAdded(selectedPlace.place_id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isPlaceAdded(selectedPlace.place_id)
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isPlaceAdded(selectedPlace.place_id) ? (
                      <>
                        <Check className="h-4 w-4 inline mr-2" />
                        Added to Queue
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 inline mr-2" />
                        Add to Queue
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">No place selected</p>
                <p>Search and click on a place to see details here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <Check className="h-4 w-4" />
            Google Search with Staging Integration is working! Search → Queue → Add to Staging
          </div>
        </div>
      </div>
    </div>
  )
}
