"use client"

import { useState } from "react"
import Map, { Marker, Popup } from "react-map-gl/mapbox"

interface SimplePin {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
}

interface InteractiveMapProps {
  className?: string
}

export default function InteractiveMap({ className = "" }: InteractiveMapProps) {
  const [selectedPin, setSelectedPin] = useState<SimplePin | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 28.9784, // Istanbul center
    latitude: 41.0082,
    zoom: 12
  })

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // Temporarily using just one hardcoded safe pin for debugging
  const pins = [
    {
      id: "hagia-sophia-test",
      name: "Hagia Sophia",
      latitude: 41.0082,
      longitude: 28.9784,
      description: "Test pin - Iconic Byzantine architecture and rich history"
    }
  ]

  console.log('Rendering 1 hardcoded test pin:', pins.map(p => p.name))

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
              <div 
                className="text-3xl cursor-pointer z-50 hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Clicked pin:', pin.name)
                  console.log("Pin object:", pin)
                  console.log("Pin latitude:", pin.latitude, "type:", typeof pin.latitude)
                  console.log("Pin longitude:", pin.longitude, "type:", typeof pin.longitude)
                  console.log("Opening popup for:", pin.name)
                  setSelectedPin(pin)
                }}
                style={{ zIndex: 1000 }}
              >
                📍
              </div>
            </Marker>
          )
        })}

        {(() => {
          console.log("Checking popup render conditions...")
          console.log("selectedPin:", selectedPin)
          
          if (!selectedPin) {
            console.log("No selectedPin - not rendering popup")
            return null
          }
          
          if (typeof selectedPin.latitude !== "number" || typeof selectedPin.longitude !== "number") {
            console.log("Invalid coordinate types - not rendering popup")
            console.log("latitude type:", typeof selectedPin.latitude, "value:", selectedPin.latitude)
            console.log("longitude type:", typeof selectedPin.longitude, "value:", selectedPin.longitude)
            return null
          }
          
          if (isNaN(selectedPin.latitude) || isNaN(selectedPin.longitude)) {
            console.log("NaN coordinates - not rendering popup")
            return null
          }
          
          console.log("All conditions met - rendering popup for:", selectedPin.name)
          return (
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
          )
        })()}
      </Map>
    </div>
  )
}
