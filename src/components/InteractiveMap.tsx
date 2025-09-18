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
        {locations.map((pin) => (
          <Marker
            key={pin.id}
            longitude={pin.coordinates[0]}
            latitude={pin.coordinates[1]}
          >
            <div 
              className="w-4 h-4 bg-red-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
              onClick={() => setSelectedPin(pin)}
            />
          </Marker>
        ))}

        {selectedPin && (
          <Popup
            longitude={selectedPin.coordinates[0]}
            latitude={selectedPin.coordinates[1]}
            onClose={() => setSelectedPin(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <Card className="w-64 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-sm">{selectedPin.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {selectedPin.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {selectedPin.description}
                </p>
                {selectedPin.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < selectedPin.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                )}
                {selectedPin.price && (
                  <div className="text-xs text-gray-500 mb-3">
                    {selectedPin.price}
                  </div>
                )}
                {(selectedPin.affiliateUrl || selectedPin.ctaLink) && (
                  <Button 
                    size="sm" 
                    className="w-full text-xs"
                    asChild
                  >
                    <a 
                      href={selectedPin.ctaLink || selectedPin.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedPin.ctaText || 
                       (selectedPin.category === "hotels" ? "Book Now" :
                        selectedPin.category === "activities" ? "Book Tour" :
                        selectedPin.category === "food" ? "Reserve Table" :
                        "Shop Now")}
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
