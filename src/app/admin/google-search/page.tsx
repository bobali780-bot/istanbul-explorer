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

export default function GoogleSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [addedPlaces, setAddedPlaces] = useState<PlaceResult[]>([])
  const [processingPlaces, setProcessingPlaces] = useState<Set<string>>(new Set())
  const debounceRef = useRef<NodeJS.Timeout>()

  // Enhanced search function with multi-search capabilities
  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    try {
      // Define search expansions for common terms - MASSIVELY expanded hotel search!
      const searchExpansions: Record<string, string[]> = {
        'shopping': ['shopping', 'mall', 'market', 'store', 'boutique', 'center'],
        'food': ['restaurant', 'cafe', 'food', 'dining', 'kitchen', 'bistro'],
        'hotel': [
          // Basic hotel terms
          'hotel', 'hotels', 'lodging', 'accommodation', 'resort', 'inn', 'stay',
          // Luxury terms
          'luxury hotel', 'boutique hotel', '5 star hotel', '4 star hotel', 'premium hotel',
          'grand hotel', 'palace hotel', 'deluxe hotel', 'executive hotel', 'suite hotel',
          // Location-specific
          'hotel Sultanahmet', 'hotel Taksim', 'hotel Galata', 'hotel Beyoglu', 
          'hotel Kadikoy', 'hotel Besiktas', 'hotel Sisli', 'hotel Fatih',
          // Types
          'business hotel', 'city hotel', 'historic hotel', 'modern hotel', 'design hotel',
          'spa hotel', 'conference hotel', 'airport hotel', 'waterfront hotel'
        ],
        'activity': ['museum', 'park', 'attraction', 'gallery', 'tour', 'experience'],
        'restaurant': ['restaurant', 'cafe', 'food', 'dining', 'kitchen', 'bistro']
      }

      // Check if query matches any expansion keywords
      const lowerQuery = searchQuery.toLowerCase()
      let searchTerms = [searchQuery] // Default: just search the original query
      
      for (const [keyword, expansions] of Object.entries(searchExpansions)) {
        if (lowerQuery.includes(keyword)) {
          searchTerms = expansions.map(term => `${term} in Istanbul`)
          break
        }
      }

      // If no expansion found but query is generic, expand it
      if (searchTerms.length === 1 && ['place', 'places'].includes(lowerQuery)) {
        searchTerms = ['restaurant in Istanbul', 'hotel in Istanbul', 'attraction in Istanbul', 'shopping in Istanbul']
      }

      console.log(`🔍 Multi-search for "${searchQuery}": searching ${searchTerms.length} terms`)

      // Perform all searches in parallel
      const allResults = await Promise.all(
        searchTerms.map(async (searchTerm) => {
          try {
            const response = await fetch('/api/admin/google-search', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: searchTerm,
                location: "41.0082,28.9784", // Istanbul coordinates
                radius: 50000,
                types: [
                  'tourist_attraction', 'restaurant', 'lodging', 'shopping_mall',
                  // Shopping places
                  'store', 'clothing_store', 'jewelry_store', 'book_store', 'electronics_store',
                  'shoe_store', 'furniture_store', 'home_goods_store', 'department_store',
                  'shopping_center', 'market', 'supermarket',
                  // Activity places  
                  'museum', 'art_gallery', 'park', 'zoo', 'aquarium', 'amusement_park',
                  'church', 'mosque', 'temple', 'synagogue', 'cemetery',
                  // Service places
                  'spa', 'beauty_salon', 'gym', 'library', 'movie_theater', 'casino'
                ]
              })
            })

            if (!response.ok) return []
            const data = await response.json()
            return data.results || []
          } catch (error) {
            console.error(`Search failed for "${searchTerm}":`, error)
            return []
          }
        })
      )

      // Combine and deduplicate results
      const combinedResults: PlaceResult[] = []
      const seenPlaceIds = new Set<string>()

      allResults.flat().forEach(place => {
        if (!seenPlaceIds.has(place.place_id)) {
          seenPlaceIds.add(place.place_id)
          combinedResults.push(place)
        }
      })

      console.log(`✅ Multi-search complete: Found ${combinedResults.length} unique places`)
      setResults(combinedResults)
    } catch (error) {
      console.error('Google Places multi-search error:', error)
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

  const removeFromQueue = (placeId: string) => {
    setAddedPlaces(prev => prev.filter(p => p.place_id !== placeId))
  }

  const isPlaceAdded = (placeId: string) => {
    return addedPlaces.some(p => p.place_id === placeId)
  }

  const isPlaceProcessing = (placeId: string) => {
    return processingPlaces.has(placeId)
  }

  const addDirectlyToStaging = async (place: PlaceResult) => {
    if (isPlaceAdded(place.place_id) || isPlaceProcessing(place.place_id)) return

    // Add to processing set
    setProcessingPlaces(prev => new Set(prev).add(place.place_id))

    try {
      const response = await fetch('/api/admin/google-to-staging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          places: [place]
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add to addedPlaces to show green checkmark
        setAddedPlaces(prev => [...prev, place])
        
        // Show success message
        const message = `✅ ${place.name} added to staging with ${data.details?.google_images_count || 10} images! (${data.details?.unsplash_images_count || 5} more images enhancing...)`
        
        // Create a temporary notification
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm'
        notification.textContent = `✅ ${place.name} added to staging!`
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)
        
      } else {
        alert(`❌ Error adding ${place.name}: ${data.error}`)
      }
    } catch (error) {
      console.error('Error adding place to staging:', error)
      alert(`❌ Failed to add ${place.name} to staging`)
    } finally {
      // Remove from processing set
      setProcessingPlaces(prev => {
        const newSet = new Set(prev)
        newSet.delete(place.place_id)
        return newSet
      })
    }
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
        alert(`✅ Successfully added ${data.total_processed} places to staging! Check your staging area.`)
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
            <h1 className="text-3xl font-bold text-slate-900">Google Places Live Search</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Search for places in Istanbul using Google Places API with real-time suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* Search Controls Section */}
          <div className="space-y-6">
            {/* Search Component */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Live Search
              </h2>
              
              {/* Live Search Input */}
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
                  placeholder="Try: shopping, food, hotel, activity (auto-expands to multiple searches)"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                />
              </div>

              <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 mt-4">
                <p className="font-medium mb-1">🚀 Smart Multi-Search Tips:</p>
                <ul className="space-y-1">
                  <li>• <strong>"shopping"</strong> → searches: mall, market, store, boutique, center</li>
                  <li>• <strong>"food"</strong> → searches: restaurant, cafe, dining, kitchen, bistro</li>
                  <li>• <strong>"hotel"</strong> → searches: hotel, lodging, accommodation, resort, inn</li>
                  <li>• <strong>"activity"</strong> → searches: museum, park, attraction, gallery, tour</li>
                  <li>• Or search specific places: "Blue Mosque", "Galata Tower"</li>
                </ul>
              </div>
            </div>

            {/* Search Queue */}
            {addedPlaces.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Search Queue ({addedPlaces.length})
                </h3>
                
                <div className="space-y-3">
                  {addedPlaces.map((place) => (
                    <div key={place.place_id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900 truncate">{place.name}</h4>
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-slate-600">
                            {getPlaceTypeDisplay(place.types)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{place.formatted_address}</p>
                      </div>
                      <button
                        onClick={() => removeFromQueue(place.place_id)}
                        className="ml-2 p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        ✕
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

          {/* Search Results Column */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-white/50 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search Results
                {results.length > 0 && (
                  <>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {results.length} places found
                    </span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Sorted by Rating
                    </span>
                  </>
                )}
              </h2>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {query.length < 2 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Search className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-500 mb-2">Start searching for places</h3>
                  <p className="text-slate-400">
                    Type in the search box to find hotels, restaurants, activities, and more in Istanbul
                  </p>
                </div>
              ) : results.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-500 mb-2">No places found</h3>
                  <p className="text-slate-400">
                    Try a different search term like "hotel", "restaurant", or "shopping"
                  </p>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Searching places...</h3>
                  <p className="text-slate-500">
                    Finding the best places in Istanbul for you
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {results.map((place) => (
                    <div
                      key={place.place_id}
                      className="p-4 bg-slate-50 rounded-xl border border-transparent hover:border-blue-200 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handlePlaceSelect(place)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">{place.name}</h3>
                              <p className="text-slate-600 text-sm mb-2 line-clamp-2">{place.formatted_address}</p>
                              
                              <div className="flex items-center gap-3 text-sm">
                                {place.rating && (
                                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                                    place.rating >= 4.5 ? 'bg-green-100 text-green-800' :
                                    place.rating >= 4.0 ? 'bg-blue-100 text-blue-800' :
                                    place.rating >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="font-bold">{place.rating}</span>
                                    {place.rating >= 4.5 && <span className="text-xs ml-1">★★★</span>}
                                    {place.rating >= 4.0 && place.rating < 4.5 && <span className="text-xs ml-1">★★</span>}
                                    {place.rating >= 3.5 && place.rating < 4.0 && <span className="text-xs ml-1">★</span>}
                                  </div>
                                )}
                                
                                <span className="bg-white px-3 py-1 rounded-full text-slate-600 border text-xs font-medium">
                                  {getPlaceTypeDisplay(place.types)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addDirectlyToStaging(place)
                            }}
                            disabled={isPlaceProcessing(place.place_id)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                              isPlaceProcessing(place.place_id)
                                ? 'bg-gray-100 cursor-not-allowed'
                                : isPlaceAdded(place.place_id)
                                ? 'bg-green-100 text-green-600 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white hover:scale-110 shadow-lg'
                            }`}
                            title={isPlaceAdded(place.place_id) ? 'Already added to staging' : 'Add to staging'}
                          >
                            {isPlaceProcessing(place.place_id) ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isPlaceAdded(place.place_id) ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Place Details - Hidden for rapid clicking workflow */}
          <div className="hidden bg-white rounded-2xl shadow-xl p-6 border border-white/50">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Place Details
            </h2>

            {selectedPlace ? (
              <div className="space-y-4">
                {/* Place Header */}
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">{selectedPlace.name}</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {getPlaceTypeDisplay(selectedPlace.types)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-slate-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedPlace.formatted_address}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {selectedPlace.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedPlace.rating}/5</span>
                      </div>
                    )}
                    
                    {selectedPlace.price_level && (
                      <span className="text-green-600 font-medium">
                        {'💰'.repeat(selectedPlace.price_level)}
                      </span>
                    )}
                    
                    {selectedPlace.opening_hours && (
                      <span className={`font-medium ${selectedPlace.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPlace.opening_hours.open_now ? '✅ Open' : '❌ Closed'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Place Types */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlace.types.slice(0, 6).map((type) => (
                      <span
                        key={type}
                        className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
                      >
                        {type.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coordinates */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Location</h4>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm font-mono">
                    <div>Lat: {selectedPlace.geometry.location.lat}</div>
                    <div>Lng: {selectedPlace.geometry.location.lng}</div>
                  </div>
                </div>

                {/* Place ID */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Google Place ID</h4>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm font-mono break-all">
                    {selectedPlace.place_id}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToQueue(selectedPlace)}
                      disabled={isPlaceAdded(selectedPlace.place_id)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
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
                    
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Google Maps
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">No place selected</p>
                <p>Search for a place using the live search above to see detailed information here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
