"use client"

import { useState } from "react"
import Map, { Marker, Popup } from "react-map-gl/mapbox"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MapLocation {
  id: string
  name: string
  description: string
  coordinates: [number, number]
  category: "activities" | "food" | "shopping" | "hotels"
  price?: string
  rating?: number
  affiliateUrl?: string
  affiliateType?: "booking" | "viator" | "tripadvisor" | "shop"
  ctaText?: string
  ctaLink?: string
}

interface InteractiveMapProps {
  locations: MapLocation[]
  center?: [number, number]
  zoom?: number
  className?: string
}

export default function InteractiveMap({ 
  locations, 
  center = [28.9784, 41.0082], // Istanbul center
  zoom = 12,
  className = ""
}: InteractiveMapProps) {
  const [selectedPin, setSelectedPin] = useState<MapLocation | null>(null)
  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom
  })

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // Debug: Log the locations data
  console.log('InteractiveMap received locations:', locations)
  console.log('Number of locations:', locations?.length || 0)

  // Hardcoded test pins with known Istanbul coordinates to ensure visibility
  const testPins = [
    {
      id: "hagia-sophia-test",
      name: "Hagia Sophia",
      description: "Iconic Byzantine architecture and rich history",
      coordinates: [28.9784, 41.0082] as [number, number],
      category: "activities" as const,
      price: "$$$",
      rating: 5,
      ctaText: "Book Tour",
      ctaLink: "https://www.viator.com/hagia-sophia"
    },
    {
      id: "grand-bazaar-test", 
      name: "Grand Bazaar",
      description: "World's oldest covered market with 4,000 shops",
      coordinates: [28.9680, 41.0107] as [number, number],
      category: "shopping" as const,
      price: "$$",
      rating: 5,
      ctaText: "Shop Now",
      ctaLink: "https://www.amazon.com/grand-bazaar"
    },
    {
      id: "taksim-square-test",
      name: "Taksim Square",
      description: "Historic square and cultural center of Istanbul",
      coordinates: [28.9850, 41.0369] as [number, number],
      category: "activities" as const,
      price: "$$",
      rating: 4,
      ctaText: "Explore",
      ctaLink: "https://www.tripadvisor.com/taksim-square"
    }
  ]

  // Always include test pins along with provided locations
  const pinsToRender = [...(locations || []), ...testPins]
  console.log('Using pins:', pinsToRender.length, 'pins')
  console.log(`Rendering ${pinsToRender.length} pins for ${locations?.[0]?.category || 'unknown'} category`)

  // Show fallback if Mapbox token is missing
  if (!mapboxToken) {
    return (
      <div className={`w-full h-96 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-500 mb-4">
            <div className="text-lg font-medium mb-2">Mapbox Token Missing</div>
            <div className="text-sm text-gray-400">
              Please add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Get your free token at: <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
            </div>
            <div className="text-xs text-gray-400 mt-4">
              Pins would appear here: {pinsToRender.length} locations ready
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden border ${className}`}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={() => setSelectedPin(null)}
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {pinsToRender.map((location) => {
          console.log("Rendering pin:", location.name, "at coordinates:", location.coordinates)
          return (
            <Marker 
              key={location.id}
              latitude={location.coordinates[1]} 
              longitude={location.coordinates[0]}
            >
              <div 
                className="text-3xl cursor-pointer z-50 hover:scale-110 transition-transform"
                onClick={() => {
                  console.log('Clicked pin:', location.name, 'opening popup')
                  setSelectedPin(location)
                }}
                style={{ zIndex: 1000 }}
              >
                📍
              </div>
            </Marker>
          )
        })}

        {selectedPin && selectedPin.coordinates && selectedPin.coordinates.length === 2 && (
          <Popup
            longitude={selectedPin.coordinates[0]}
            latitude={selectedPin.coordinates[1]}
            onClose={() => setSelectedPin(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -10]}
          >
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <div className="mb-2">
                <h4 className="font-bold text-sm">{selectedPin.name || 'Location'}</h4>
                <Badge variant="outline" className="text-xs">
                  {selectedPin.category || 'location'}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                {selectedPin.description || 'No description available'}
              </p>
              {selectedPin.price && (
                <div className="text-xs text-gray-500 mb-3">
                  {selectedPin.price}
                </div>
              )}
              <a 
                href={selectedPin.ctaLink || selectedPin.affiliateUrl || 'https://example.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors"
                onClick={() => {
                  console.log('CTA clicked for:', selectedPin.name, 'opening:', selectedPin.ctaLink || selectedPin.affiliateUrl || 'https://example.com')
                }}
              >
                {selectedPin.ctaText || 
                 (selectedPin.category === "hotels" ? "Book Now" :
                  selectedPin.category === "activities" ? "Book Tour" :
                  selectedPin.category === "food" ? "Reserve Table" :
                  "Explore")}
              </a>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
