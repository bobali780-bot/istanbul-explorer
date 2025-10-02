'use client'
import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'

// Mapbox CSS import
import 'mapbox-gl/dist/mapbox-gl.css'

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

interface ActivitiesMapProps {
  activities: Activity[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
}

export function ActivitiesMap({ activities, favorites, onToggleFavorite }: ActivitiesMapProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Filter activities that have valid coordinates
  const activitiesWithCoordinates = activities.filter(activity =>
    activity.coordinates &&
    activity.coordinates.lat &&
    activity.coordinates.lng
  )

  useEffect(() => {
    // Get Mapbox token from environment
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    
    console.log('Mapbox token loaded:', token ? 'Token found' : 'No token')
    setMapboxToken(token)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="relative h-[600px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading interactive map...</p>
          <p className="text-slate-500 text-sm mt-2">Discover activities across Istanbul</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] w-full rounded-3xl overflow-hidden">
      <Map
        initialViewState={{
          longitude: 28.9784,
          latitude: 41.0082,
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
        onClick={() => setSelectedActivity(null)}
      >
        {activitiesWithCoordinates.map((activity) => {
          if (!activity.coordinates) return null

          return (
            <Marker
              key={activity.id}
              longitude={activity.coordinates.lng}
              latitude={activity.coordinates.lat}
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setSelectedActivity(activity)
              }}
            >
              <div
                className="cursor-pointer transform transition-transform hover:scale-110"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                🎯
              </div>
            </Marker>
          )
        })}

        {selectedActivity && selectedActivity.coordinates && (
          <Popup
            longitude={selectedActivity.coordinates.lng}
            latitude={selectedActivity.coordinates.lat}
            onClose={() => setSelectedActivity(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            offset={[0, 15]}
            style={{
              maxWidth: '300px',
              minWidth: '260px',
              zIndex: 1000
            }}
          >
            <div className="p-0 w-full">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
                {selectedActivity.heroImage && (
                  <div className="relative h-20 w-full">
                    <img 
                      src={selectedActivity.heroImage} 
                      alt={selectedActivity.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button 
                        onClick={() => onToggleFavorite(selectedActivity.id)}
                        className="w-5 h-5 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <svg 
                          className={`w-2.5 h-2.5 ${favorites.has(selectedActivity.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => setSelectedActivity(null)}
                        className="w-5 h-5 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <svg className="w-2.5 h-2.5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                <div className="p-2">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 flex-1">{selectedActivity.title}</h3>
                    {selectedActivity.isEditorPick && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold ml-1 flex-shrink-0">
                        Editor&apos;s Pick
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mb-1 line-clamp-1">{selectedActivity.description}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-900">{selectedActivity.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({selectedActivity.reviewCount})</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedActivity.neighborhood || selectedActivity.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-900">
                      {selectedActivity.price || 'Price varies'}
                    </div>
                    <Link
                      href={`/activities/${selectedActivity.slug}`}
                      className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      onClick={() => setSelectedActivity(null)}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
