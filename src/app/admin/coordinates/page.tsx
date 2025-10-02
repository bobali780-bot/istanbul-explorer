'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Download, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react'

interface Place {
  id: number
  name: string
  category: string
  location: string
  coordinates: { lat: number; lng: number } | null
  hasCoordinates: boolean
}

interface CoordinateStats {
  total: number
  withCoordinates: number
  missing: number
  percentage: number
}

export default function CoordinatesAdminPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPlace, setCurrentPlace] = useState<string>('')
  const [stats, setStats] = useState<CoordinateStats>({ total: 0, withCoordinates: 0, missing: 0, percentage: 0 })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch all places from all categories
  const fetchAllPlaces = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const categories = ['activities', 'shopping', 'hotels', 'food-drink']
      const allPlaces: Place[] = []
      
      for (const category of categories) {
        try {
          const response = await fetch(`/api/categories/${category}`)
          if (!response.ok) {
            console.log(`Category ${category} not available yet, skipping...`)
            continue
          }
          
          const data = await response.json()
          const categoryPlaces = data.activities.map((place: any) => ({
            id: place.id,
            name: place.title,
            category: category,
            location: place.location,
            coordinates: place.coordinates,
            hasCoordinates: place.coordinates && place.coordinates.lat && place.coordinates.lng
          }))
          
          allPlaces.push(...categoryPlaces)
          console.log(`Loaded ${categoryPlaces.length} places from ${category}`)
        } catch (err) {
          console.log(`Error loading ${category}:`, err)
          // Continue with other categories
        }
      }
      
      setPlaces(allPlaces)
      calculateStats(allPlaces)
      console.log(`Total places loaded: ${allPlaces.length}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch places')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (places: Place[]) => {
    const total = places.length
    const withCoordinates = places.filter(p => p.hasCoordinates).length
    const missing = total - withCoordinates
    const percentage = total > 0 ? Math.round((withCoordinates / total) * 100) : 0
    
    setStats({ total, withCoordinates, missing, percentage })
  }

  // Get coordinates for a single place using Google Places API
  const getPlaceCoordinates = async (place: Place): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch('/api/coordinates/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: place.name,
          location: place.location,
          category: place.category
        })
      })
      
      if (!response.ok) throw new Error('Failed to get coordinates')
      
      const data = await response.json()
      return data.coordinates
    } catch (err) {
      console.error(`Failed to get coordinates for ${place.name}:`, err)
      return null
    }
  }

  // Update coordinates for a single place
  const updatePlaceCoordinates = async (placeId: number, category: string, coordinates: { lat: number; lng: number }) => {
    try {
      const response = await fetch('/api/coordinates/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: placeId,
          category: category,
          coordinates: coordinates
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Failed to update coordinates for place ${placeId}:`, errorData)
        
        // If it's a 404, the place doesn't exist in the database
        if (response.status === 404) {
          console.log(`Place ${placeId} not found in database, skipping...`)
          return false
        }
        
        throw new Error(`Failed to update coordinates: ${errorData.error || 'Unknown error'}`)
      }
      
      return true
    } catch (err) {
      console.error(`Failed to update coordinates for place ${placeId}:`, err)
      return false
    }
  }

  // Bulk update all missing coordinates
  const updateAllMissingCoordinates = async () => {
    setUpdating(true)
    setProgress(0)
    setError(null)
    setSuccess(null)
    
    // Only process places from categories that exist in the database
    const availableCategories = ['activities'] // Add more as they become available
    const missingPlaces = places.filter(p => 
      !p.hasCoordinates && availableCategories.includes(p.category)
    )
    
    console.log(`Processing ${missingPlaces.length} missing places from available categories: ${availableCategories.join(', ')}`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < missingPlaces.length; i++) {
      const place = missingPlaces[i]
      setCurrentPlace(place.name)
      setProgress(Math.round(((i + 1) / missingPlaces.length) * 100))
      
      try {
        const coordinates = await getPlaceCoordinates(place)
        if (coordinates) {
          const updated = await updatePlaceCoordinates(place.id, place.category, coordinates)
          if (updated) {
            successCount++
            // Update local state
            setPlaces(prev => prev.map(p => 
              p.id === place.id ? { ...p, coordinates, hasCoordinates: true } : p
            ))
          } else {
            errorCount++
          }
        } else {
          errorCount++
        }
      } catch (err) {
        errorCount++
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setUpdating(false)
    setCurrentPlace('')
    setProgress(0)
    
    if (successCount > 0) {
      setSuccess(`Successfully updated ${successCount} places with coordinates!`)
      fetchAllPlaces() // Refresh data
    }
    
    if (errorCount > 0) {
      setError(`Failed to update ${errorCount} places. Check console for details.`)
    }
  }

  // Update all places (including those with existing coordinates)
  const updateAllCoordinates = async () => {
    setUpdating(true)
    setProgress(0)
    setError(null)
    setSuccess(null)
    
    // Only process places from categories that exist in the database
    const availableCategories = ['activities'] // Add more as they become available
    const availablePlaces = places.filter(p => availableCategories.includes(p.category))
    
    console.log(`Processing ${availablePlaces.length} places from available categories: ${availableCategories.join(', ')}`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < availablePlaces.length; i++) {
      const place = availablePlaces[i]
      setCurrentPlace(place.name)
      setProgress(Math.round(((i + 1) / availablePlaces.length) * 100))
      
      try {
        console.log(`Processing place: ${place.name} (ID: ${place.id}, Category: ${place.category})`)
        const coordinates = await getPlaceCoordinates(place)
        if (coordinates) {
          console.log(`Got coordinates for ${place.name}:`, coordinates)
          const updated = await updatePlaceCoordinates(place.id, place.category, coordinates)
          if (updated) {
            successCount++
            console.log(`Successfully updated ${place.name}`)
            // Update local state
            setPlaces(prev => prev.map(p => 
              p.id === place.id ? { ...p, coordinates, hasCoordinates: true } : p
            ))
          } else {
            errorCount++
            console.log(`Failed to update ${place.name}`)
          }
        } else {
          errorCount++
          console.log(`No coordinates found for ${place.name}`)
        }
      } catch (err) {
        errorCount++
        console.error(`Error processing ${place.name}:`, err)
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setUpdating(false)
    setCurrentPlace('')
    setProgress(0)
    
    if (successCount > 0) {
      setSuccess(`Successfully updated ${successCount} places with coordinates!`)
      fetchAllPlaces() // Refresh data
    }
    
    if (errorCount > 0) {
      setError(`Failed to update ${errorCount} places. Check console for details.`)
    }
  }

  useEffect(() => {
    fetchAllPlaces()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading places...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coordinate Management</h1>
        <p className="text-gray-600">Manage coordinates for all places using Google Places API</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Places</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Coordinates</p>
                <p className="text-2xl font-bold text-green-600">{stats.withCoordinates}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Missing</p>
                <p className="text-2xl font-bold text-red-600">{stats.missing}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Coverage</p>
                <p className="text-2xl font-bold">{stats.percentage}%</p>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{stats.percentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {updating && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Updating coordinates...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentPlace && (
                <p className="text-sm text-gray-600">Processing: {currentPlace}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          onClick={updateAllMissingCoordinates}
          disabled={updating || stats.missing === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Update Missing Only ({stats.missing})
        </Button>

        <Button 
          onClick={updateAllCoordinates}
          disabled={updating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Update All Places ({stats.total})
        </Button>
        
        <div className="text-sm text-gray-600 mt-2">
          <p><strong>Note:</strong> Currently only processing places from the 'activities' category.</p>
          <p>Other categories (shopping, hotels, food-drink) will be available once their data is added to the database.</p>
        </div>

        <Button 
          onClick={fetchAllPlaces}
          disabled={updating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Places List */}
      <Card>
        <CardHeader>
          <CardTitle>All Places</CardTitle>
          <CardDescription>
            {stats.total} places across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {places.map((place) => (
              <div key={`${place.category}-${place.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{place.name}</h3>
                    <Badge variant="outline">{place.category}</Badge>
                    {place.hasCoordinates ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Has Coordinates
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Missing
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{place.location}</p>
                  {place.coordinates && (
                    <p className="text-xs text-gray-500 mt-1">
                      {place.coordinates.lat.toFixed(6)}, {place.coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
