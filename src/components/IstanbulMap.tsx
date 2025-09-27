'use client'
import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'

// Mapbox CSS import
import 'mapbox-gl/dist/mapbox-gl.css'

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

interface IstanbulMapProps {
  items: MapItem[]
}

const CATEGORY_CONFIG = {
  activities: {
    color: '#2e9b47',
    icon: '🎯',
    label: 'Activity'
  },
  hotels: {
    color: '#f59e0b',
    icon: '🏨',
    label: 'Hotel'
  },
  shopping: {
    color: '#3b82f6',
    icon: '🛍️',
    label: 'Shopping'
  },
  'food-drink': {
    color: '#ef4444',
    icon: '🍽️',
    label: 'Food & Drink'
  }
}

export function IstanbulMap({ items }: IstanbulMapProps) {
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>('')

  useEffect(() => {
    // Get Mapbox token from environment
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('NEXT_PUBLIC_MAPBOX_TOKEN is not set')
      return
    }
    setMapboxToken(token)
  }, [])

  if (!mapboxToken) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Istanbul
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Interactive map coming soon...
          </p>
        </div>
        <div className="h-[500px] rounded-3xl bg-slate-100 shadow-xl flex items-center justify-center">
          <p className="text-slate-500">Mapbox token not configured</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Explore Istanbul
        </h2>
        <p className="mt-2 text-lg text-slate-600">
          Discover the best places to visit, eat, shop, and stay
        </p>
      </div>

      <div className="relative h-[500px] w-full overflow-hidden rounded-3xl shadow-xl">
        <Map
          initialViewState={{
            longitude: 28.9784,
            latitude: 41.0082,
            zoom: 11
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={mapboxToken}
        >
          {items.map((item) => {
            const config = CATEGORY_CONFIG[item.category]
            return (
              <Marker
                key={item.id}
                longitude={item.coordinates.lng}
                latitude={item.coordinates.lat}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  setSelectedItem(item)
                }}
              >
                <div
                  className="cursor-pointer transform transition-transform hover:scale-110"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: config.color,
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}
                >
                  {config.icon}
                </div>
              </Marker>
            )
          })}

          {selectedItem && (
            <Popup
              longitude={selectedItem.coordinates.lng}
              latitude={selectedItem.coordinates.lat}
              onClose={() => setSelectedItem(null)}
              closeButton={true}
              closeOnClick={false}
              anchor="bottom"
              style={{
                maxWidth: '300px'
              }}
            >
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {CATEGORY_CONFIG[selectedItem.category].icon}
                  </span>
                  <span
                    className="px-2 py-1 text-xs font-medium text-white rounded-full"
                    style={{ backgroundColor: CATEGORY_CONFIG[selectedItem.category].color }}
                  >
                    {CATEGORY_CONFIG[selectedItem.category].label}
                  </span>
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-1">
                  {selectedItem.name}
                </h3>
                
                {selectedItem.neighborhood && (
                  <p className="text-sm text-slate-600 mb-2">
                    📍 {selectedItem.neighborhood}
                  </p>
                )}
                
                {selectedItem.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-700">
                      {selectedItem.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                
                <Link
                  href={`/activities/${selectedItem.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                  onClick={() => setSelectedItem(null)}
                >
                  <MapPin className="h-4 w-4" />
                  View Details
                </Link>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {Object.entries(CATEGORY_CONFIG).map(([category, config]) => (
          <div key={category} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-sm text-slate-600">{config.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
