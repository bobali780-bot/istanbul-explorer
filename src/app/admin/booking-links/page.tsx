'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  ExternalLink,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Link as LinkIcon,
  Wand2
} from 'lucide-react'

interface Venue {
  id: number
  name: string
  location?: string
  booking_url?: string
}

export default function ManageBookingLinksPage() {
  const [venues, setVenues] = useState<{
    activities: Venue[]
    hotels: Venue[]
    restaurants: Venue[]
    shopping: Venue[]
  }>({
    activities: [],
    hotels: [],
    restaurants: [],
    shopping: []
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingUrl, setEditingUrl] = useState<{ [key: string]: string }>({})

  // Fetch all venues from all categories
  const fetchVenues = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/booking-links')
      const data = await response.json()

      if (data.success) {
        setVenues(data.data)
      } else {
        setError(data.error || 'Failed to fetch venues')
      }
    } catch (err) {
      setError('Failed to fetch venues')
    } finally {
      setLoading(false)
    }
  }

  // Save booking URL for a specific venue
  const saveBookingUrl = async (category: string, venueId: number, bookingUrl: string) => {
    const saveKey = `${category}-${venueId}`
    setSaving(saveKey)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/booking-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          venueId,
          bookingUrl: bookingUrl.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Booking URL saved successfully`)
        // Update local state
        setVenues(prev => ({
          ...prev,
          [category]: prev[category as keyof typeof prev].map(v =>
            v.id === venueId ? { ...v, booking_url: bookingUrl.trim() } : v
          )
        }))
        // Clear editing state
        delete editingUrl[saveKey]
        setEditingUrl({ ...editingUrl })
      } else {
        setError(data.error || 'Failed to save booking URL')
      }
    } catch (err) {
      setError('Failed to save booking URL')
    } finally {
      setSaving(null)
    }
  }

  // Handle URL input change
  const handleUrlChange = (category: string, venueId: number, url: string) => {
    const key = `${category}-${venueId}`
    setEditingUrl({ ...editingUrl, [key]: url })
  }

  // Auto-generate booking URLs for a category
  const generateBookingUrls = async (category: string) => {
    setGenerating(category)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/generate-booking-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        fetchVenues() // Refresh the list
      } else {
        setError(data.error || 'Failed to generate booking URLs')
      }
    } catch (err) {
      setError('Failed to generate booking URLs')
    } finally {
      setGenerating(null)
    }
  }

  // Generate URLs for all categories
  const generateAllBookingUrls = async () => {
    setGenerating('all')
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/generate-booking-urls')
      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        fetchVenues() // Refresh the list
      } else {
        setError(data.error || 'Failed to generate booking URLs')
      }
    } catch (err) {
      setError('Failed to generate booking URLs')
    } finally {
      setGenerating(null)
    }
  }

  useEffect(() => {
    fetchVenues()
  }, [])

  const renderVenueList = (category: string, categoryVenues: Venue[]) => {
    const venuesWithoutUrls = categoryVenues.filter(v => !v.booking_url).length

    return (
      <div className="space-y-4">
        {venuesWithoutUrls > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="font-semibold text-blue-900">
                {venuesWithoutUrls} venue{venuesWithoutUrls !== 1 ? 's' : ''} without booking URLs
              </p>
              <p className="text-sm text-blue-700">
                Auto-generate search URLs for venues missing booking links
              </p>
            </div>
            <Button
              onClick={() => generateBookingUrls(category)}
              disabled={generating !== null}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generating === category ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Generate for {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          </div>
        )}
        {categoryVenues.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No venues in this category yet</p>
        ) : (
          categoryVenues.map((venue) => {
            const saveKey = `${category}-${venue.id}`
            const currentUrl = editingUrl[saveKey] !== undefined
              ? editingUrl[saveKey]
              : (venue.booking_url || '')
            const hasChanged = editingUrl[saveKey] !== undefined && editingUrl[saveKey] !== (venue.booking_url || '')
            const isSaving = saving === saveKey

            return (
              <Card key={venue.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{venue.name}</h3>
                        {venue.booking_url ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Has Link
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            No Link
                          </Badge>
                        )}
                      </div>
                      {venue.location && (
                        <p className="text-sm text-gray-600 mb-3">{venue.location}</p>
                      )}

                      <div className="flex items-center gap-2">
                        <Input
                          type="url"
                          placeholder="https://www.expedia.co.uk/..."
                          value={currentUrl}
                          onChange={(e) => handleUrlChange(category, venue.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => saveBookingUrl(category, venue.id, currentUrl)}
                          disabled={isSaving || !hasChanged}
                          size="sm"
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        {venue.booking_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(venue.booking_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-gray-700">Loading venues...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <LinkIcon className="h-8 w-8 text-blue-600" />
                Manage Booking Links
              </CardTitle>
              <CardDescription className="mt-2">
                Add or update third-party booking URLs for each venue. Paste specific booking links (e.g., Expedia, Viator, Booking.com)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={generateAllBookingUrls}
                disabled={generating !== null}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {generating === 'all' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Auto-Generate All URLs
              </Button>
              <Button onClick={fetchVenues} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-700">{venues.activities.length}</p>
              <p className="text-sm text-gray-600">Activities</p>
              <p className="text-xs text-gray-500 mt-1">
                {venues.activities.filter(v => v.booking_url).length} with links
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{venues.hotels.length}</p>
              <p className="text-sm text-gray-600">Hotels</p>
              <p className="text-xs text-gray-500 mt-1">
                {venues.hotels.filter(v => v.booking_url).length} with links
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-700">{venues.restaurants.length}</p>
              <p className="text-sm text-gray-600">Restaurants</p>
              <p className="text-xs text-gray-500 mt-1">
                {venues.restaurants.filter(v => v.booking_url).length} with links
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{venues.shopping.length}</p>
              <p className="text-sm text-gray-600">Shopping</p>
              <p className="text-xs text-gray-500 mt-1">
                {venues.shopping.filter(v => v.booking_url).length} with links
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activities">Activities ({venues.activities.length})</TabsTrigger>
          <TabsTrigger value="hotels">Hotels ({venues.hotels.length})</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants ({venues.restaurants.length})</TabsTrigger>
          <TabsTrigger value="shopping">Shopping ({venues.shopping.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-6">
          {renderVenueList('activities', venues.activities)}
        </TabsContent>

        <TabsContent value="hotels" className="mt-6">
          {renderVenueList('hotels', venues.hotels)}
        </TabsContent>

        <TabsContent value="restaurants" className="mt-6">
          {renderVenueList('restaurants', venues.restaurants)}
        </TabsContent>

        <TabsContent value="shopping" className="mt-6">
          {renderVenueList('shopping', venues.shopping)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
