"use client"

import { useState, useCallback } from "react"
import Map, { Marker, Popup } from "react-map-gl/mapbox"
import { MapPin, Star } from "lucide-react"
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
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom
  })

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  const handleMarkerClick = useCallback((location: MapLocation) => {
    setSelectedLocation(location)
  }, [])

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
          </div>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "activities": return "bg-blue-500"
      case "food": return "bg-orange-500"
      case "shopping": return "bg-green-500"
      case "hotels": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "activities": return "🎯"
      case "food": return "🍽️"
      case "shopping": return "🛍️"
      case "hotels": return "🏨"
      default: return "📍"
    }
  }

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden border ${className}`}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.coordinates[0]}
            latitude={location.coordinates[1]}
            onClick={() => handleMarkerClick(location)}
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-full ${getCategoryColor(location.category)} flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition-transform`}>
                {getCategoryIcon(location.category)}
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </Marker>
        ))}

        {selectedLocation && (
          <Popup
            longitude={selectedLocation.coordinates[0]}
            latitude={selectedLocation.coordinates[1]}
            onClose={() => setSelectedLocation(null)}
            closeButton={true}
            closeOnClick={false}
            className="mapbox-popup"
          >
            <Card className="w-64 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-sm">{selectedLocation.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {selectedLocation.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {selectedLocation.description}
                </p>
                {selectedLocation.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < selectedLocation.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                )}
                {selectedLocation.price && (
                  <div className="text-xs text-gray-500 mb-3">
                    {selectedLocation.price}
                  </div>
                )}
                {selectedLocation.affiliateUrl && (
                  <Button 
                    size="sm" 
                    className="w-full text-xs"
                    asChild
                  >
                    <a 
                      href={selectedLocation.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedLocation.category === "hotels" ? "Book Now" :
                       selectedLocation.category === "activities" ? "Book Tour" :
                       selectedLocation.category === "food" ? "Reserve Table" :
                       "Shop Now"}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  )
}
