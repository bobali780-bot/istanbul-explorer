'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
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
  slug: string
  isEditorPick?: boolean
  heroImage?: string
  whyVisit?: string
}

interface InteractiveMapProps {
  activities: Activity[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
}

export function InteractiveMap({ activities, favorites, onToggleFavorite }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)

  // Optimize Mapbox token loading
  useEffect(() => {
    console.log('Current mapboxToken state:', mapboxToken)
    if (mapboxToken) {
      console.log('Token already loaded, skipping fetch')
      return
    }
    
    console.log('Is loading:', !mapboxToken)
    if (!mapboxToken) {
      console.log('Still loading...')
      // Use a fallback token immediately to prevent loading loops
      setMapboxToken('pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return

    // Set Mapbox access token only once
    mapboxgl.accessToken = mapboxToken

    // Set a timeout to handle slow loading
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.warn('Map loading timeout, showing fallback')
        setHasError(true)
        setIsLoaded(true)
      }
    }, 5000) // Reduced to 5 second timeout

    // Initialize map with performance optimizations
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [28.9784, 41.0082], // Istanbul coordinates
      zoom: 12,
      attributionControl: false,
      logoPosition: 'bottom-right',
      // Performance optimizations
      preserveDrawingBuffer: false,
      antialias: false,
      optimizeForTerrain: false
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Simplified geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: false // Reduced accuracy for better performance
        },
        trackUserLocation: false,
        showUserHeading: false
      }),
      'top-right'
    )

    map.current.on('load', () => {
      setIsLoaded(true)
    })

    map.current.on('error', (e) => {
      console.error('Map error:', e)
      setHasError(true)
      setIsLoaded(true)
    })

    return () => {
      clearTimeout(timeout)
      if (map.current) {
        map.current.remove()
      }
    }
  }, [mapboxToken])

  useEffect(() => {
    if (!map.current || !isLoaded || !activities.length) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
    existingMarkers.forEach(marker => marker.remove())

    // Add markers for each activity
    activities.forEach((activity, index) => {
      // Generate random coordinates around Istanbul for demo purposes
      // In a real app, you'd have actual coordinates from your database
      const lat = 41.0082 + (Math.random() - 0.5) * 0.1
      const lng = 28.9784 + (Math.random() - 0.5) * 0.1

      // Create marker element
      const markerElement = document.createElement('div')
      markerElement.className = 'activity-marker'
      markerElement.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border: 4px solid white;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.3s ease;
        position: relative;
      `

      // Add activity icon based on category
      const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
          case 'activities': return '🎯'
          case 'hotels': return '🏨'
          case 'shopping': return '🛍️'
          case 'food-drink': return '🍽️'
          default: return '📍'
        }
      }

      markerElement.innerHTML = getCategoryIcon(activity.category)

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)'
        markerElement.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'
      })

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)'
        markerElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
      })

      // Create popup content
      const popupContent = document.createElement('div')
      popupContent.className = 'activity-popup'
      popupContent.style.cssText = `
        max-width: 300px;
        padding: 0;
      `

      popupContent.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          ${activity.heroImage ? `
            <div class="relative h-32 w-full">
              <img src="${activity.heroImage}" alt="${activity.title}" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute top-3 right-3">
                <button class="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <svg class="w-4 h-4 ${favorites.has(activity.id) ? 'text-red-500 fill-current' : 'text-gray-600'}" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            </div>
          ` : ''}
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-lg text-gray-900 line-clamp-2">${activity.title}</h3>
              ${activity.isEditorPick ? `
                <span class="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0">
                  Editor's Pick
                </span>
              ` : ''}
            </div>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">${activity.description}</p>
            <div class="flex items-center gap-4 mb-3">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-sm font-semibold text-gray-900">${activity.rating.toFixed(1)}</span>
                <span class="text-sm text-gray-500">(${activity.reviewCount})</span>
              </div>
              <div class="text-sm text-gray-600">
                ${activity.neighborhood || activity.location}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold text-gray-900">
                ${activity.price || 'Price varies'}
              </div>
              <button class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                View Details
              </button>
            </div>
          </div>
        </div>
      `

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setDOMContent(popupContent)

      // Add marker to map
      new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current)
    })
  }, [activities, isLoaded, favorites])

  return (
    <div className="relative h-[600px] w-full rounded-3xl overflow-hidden">
      {!hasError && <div ref={mapContainer} className="w-full h-full" />}
      
      {/* Loading overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading interactive map...</p>
            <p className="text-slate-500 text-sm mt-2">Discover activities across Istanbul</p>
          </div>
        </div>
      )}
      
      {/* Fallback if map fails to load */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Interactive Map</h3>
            <p className="text-slate-600 mb-4">Map temporarily unavailable</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              {activities.slice(0, 3).map((activity, index) => (
                <div key={activity.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🎯</span>
                    <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{activity.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{activity.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs font-semibold">{activity.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">({activity.reviewCount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}