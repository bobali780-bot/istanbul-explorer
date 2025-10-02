'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Search, 
  ExternalLink, 
  Globe,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

interface Activity {
  id: number
  name: string
  location: string
  booking_url?: string
  booking_platform?: string
  booking_status: string
  google_place_id?: string
  official_website?: string
  booking_notes?: string
}

interface BookingSuggestion {
  platform: string
  url: string
  description: string
}

export default function AdminBookingPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [discovering, setDiscovering] = useState<number | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [bookingSuggestions, setBookingSuggestions] = useState<BookingSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch all activities with booking status
  const fetchActivities = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/booking/update')
      const data = await response.json()
      
      if (data.success) {
        setActivities(data.data)
      } else {
        setError(data.error || 'Failed to fetch activities')
      }
    } catch (err) {
      setError('Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }

  // Discover booking links for an activity
  const discoverBookingLinks = async (activity: Activity) => {
    setDiscovering(activity.id)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/booking/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: activity.id,
          activityName: activity.name,
          location: activity.location
        })
      })

      const data = await response.json()

      if (data.success) {
        setBookingSuggestions(data.data.booking_suggestions)
        setSelectedActivity({
          ...activity,
          google_place_id: data.data.google_place_id,
          official_website: data.data.official_website
        })
        setSuccess(`Found ${data.data.booking_suggestions.length} booking suggestions for ${activity.name}`)
      } else {
        setError(data.error || 'Failed to discover booking links')
      }
    } catch (err) {
      setError('Failed to discover booking links')
    } finally {
      setDiscovering(null)
    }
  }

  // Update booking information
  const updateBookingInfo = async (activityId: number, bookingData: any) => {
    setUpdating(activityId)
    setError(null)

    try {
      const response = await fetch('/api/booking/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          ...bookingData
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Booking information updated successfully')
        setSelectedActivity(null)
        setBookingSuggestions([])
        fetchActivities() // Refresh the list
      } else {
        setError(data.error || 'Failed to update booking information')
      }
    } catch (err) {
      setError('Failed to update booking information')
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      found: { color: 'bg-blue-100 text-blue-800', icon: Search },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      not_found: { color: 'bg-red-100 text-red-800', icon: XCircle },
      rejected: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-gray-700">Loading activities...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Booking Link Management</CardTitle>
          <CardDescription>
            Discover and manage booking links for all activities using Google Places API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total Activities: {activities.length} | 
              Pending: {activities.filter(a => a.booking_status === 'pending').length} | 
              Found: {activities.filter(a => a.booking_status === 'found').length} | 
              Approved: {activities.filter(a => a.booking_status === 'approved').length}
            </div>
            <Button onClick={fetchActivities} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Activities ({activities.length})</CardTitle>
          <CardDescription>
            Click 'Discover' to find booking links for each activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.location}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activity.booking_status)}
                    {activity.booking_platform && (
                      <Badge variant="outline" className="text-xs">
                        {activity.booking_platform}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activity.booking_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(activity.booking_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Link
                    </Button>
                  )}
                  <Button
                    onClick={() => discoverBookingLinks(activity)}
                    disabled={discovering === activity.id}
                    size="sm"
                  >
                    {discovering === activity.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Search className="h-4 w-4 mr-1" />
                    )}
                    Discover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Suggestions Modal */}
      {selectedActivity && bookingSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Suggestions for {selectedActivity.name}</CardTitle>
            <CardDescription>
              These are search URLs that will help users find booking options for this activity on each platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold capitalize">{suggestion.platform}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                    <Button
                      onClick={() => updateBookingInfo(selectedActivity.id, {
                        booking_url: suggestion.url,
                        booking_platform: suggestion.platform,
                        booking_status: 'approved',
                        google_place_id: selectedActivity.google_place_id,
                        official_website: selectedActivity.official_website
                      })}
                      disabled={updating === selectedActivity.id}
                      size="sm"
                    >
                      {updating === selectedActivity.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Use Search Link'
                      )}
                    </Button>
                  </div>
                  <a 
                    href={suggestion.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    {suggestion.url}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}