"use client"

import { useState } from "react"
import Map, { Marker, Popup } from "react-map-gl/mapbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapErrorBoundary } from "@/components/MapErrorBoundary"

interface SimplePin {
  id: string
  name: string
  description: string
  latitude?: number
  longitude?: number
  coordinates?: [number, number] // [longitude, latitude] format
}

interface InteractiveMapProps {
  className?: string
  locations?: SimplePin[]
}

// Helper function to normalize coordinates
function normalizePin(pin: SimplePin): SimplePin & { latitude: number; longitude: number } {
  if (pin.latitude !== undefined && pin.longitude !== undefined) {
    return { ...pin, latitude: pin.latitude, longitude: pin.longitude }
  }
  if (pin.coordinates && pin.coordinates.length === 2) {
    return { ...pin, latitude: pin.coordinates[1], longitude: pin.coordinates[0] }
  }
  throw new Error(`Invalid pin coordinates for ${pin.name}`)
}

export default function InteractiveMap({ className = "", locations }: InteractiveMapProps) {
  const [selectedPin, setSelectedPin] = useState<SimplePin | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 28.9784, // Istanbul center
    latitude: 41.0082,
    zoom: 12
  })

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // Feature flag: use popup fallback to avoid Mapbox Popup crashes
  const usePopupFallback = true

  // Use provided locations or fallback to hardcoded pins, normalize coordinates
  const rawPins = locations && locations.length > 0 ? locations : [
    {
      id: "hagia-sophia-test",
      name: "Hagia Sophia",
      latitude: 41.0082,
      longitude: 28.9784,
      description: "Test pin - Iconic Byzantine architecture and rich history"
    }
  ]

  const pins = rawPins.map(normalizePin)

  console.log('Popup mode:', usePopupFallback ? 'using Dialog fallback' : 'using Mapbox Popup')
  console.log('Rendering pins:', pins.length, pins.map(p => p.name))

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
              3 pins ready: Hagia Sophia, Grand Bazaar, Taksim Square
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <MapErrorBoundary>
      <div className={`w-full h-96 rounded-lg overflow-hidden border ${className}`}>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={() => {
            console.log("Map clicked - closing popup")
            setSelectedPin(null)
          }}
          mapboxAccessToken={mapboxToken}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          {pins.map((pin) => {
            console.log("Rendering pin:", pin.name, "at", pin.latitude, pin.longitude)
            return (
              <Marker 
                key={pin.id}
                latitude={pin.latitude} 
                longitude={pin.longitude}
              >
                <span 
                  className="text-3xl cursor-pointer z-50 hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Clicked pin:', pin.name)
                    console.log("Opening popup for:", pin.name)
                    setSelectedPin(pin)
                  }}
                  style={{ zIndex: 1000 }}
                >
                  📍
                </span>
              </Marker>
            )
          })}

          {/* Mapbox Popup - only render if not using fallback */}
          {!usePopupFallback && selectedPin &&
           typeof selectedPin.latitude === "number" &&
           typeof selectedPin.longitude === "number" &&
           !Number.isNaN(selectedPin.latitude) &&
           !Number.isNaN(selectedPin.longitude) && (
            <Popup
              latitude={selectedPin.latitude}
              longitude={selectedPin.longitude}
              onClose={() => {
                console.log("Closing popup for:", selectedPin.name)
                setSelectedPin(null)
              }}
              closeButton={true}
              closeOnClick={false}
              anchor="bottom"
              offset={[0, -10]}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <h4 className="font-bold text-sm mb-2">
                  {selectedPin.name || "Unknown location"}
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  {selectedPin.description || "No description"}
                </p>
                <a 
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('CTA clicked for:', selectedPin.name)
                  }}
                >
                  Book Now
                </a>
              </div>
            </Popup>
          )}
        </Map>

        {/* Dialog Fallback - Fallback modal used to avoid Mapbox Popup crash. Switch off usePopupFallback once Popup is stable. */}
        {usePopupFallback && selectedPin && (
          <Dialog open={!!selectedPin} onOpenChange={(open) => {
            if (!open) {
              console.log("Closing dialog for:", selectedPin.name)
              setSelectedPin(null)
            }
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedPin.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {selectedPin.description}
                </p>
                <a 
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    className="w-full"
                    onClick={() => {
                      console.log('CTA clicked for:', selectedPin.name)
                    }}
                  >
                    Book Now
                  </Button>
                </a>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MapErrorBoundary>
  )
}
