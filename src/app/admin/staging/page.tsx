"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Filter,
  RefreshCw,
  Star,
  Clock,
  Image,
  MapPin,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Wand2
} from "lucide-react"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface StagingItem {
  id: string
  title: string
  category: string
  primary_image: string
  images: string[]
  image_count: number
  raw_content: {
    description: string
    content: string
    price_range: string
    duration: string
    rating: number
    review_count: number
    highlights: string[]
    scraped_sources: string[]
  }
  confidence_score: number
  source_urls: string[]
  scraping_job_id: string
  has_description: boolean
  has_price: boolean
  has_location: boolean
  has_rating: boolean
  status: string
  created_at: string
  reviewed_at?: string
  reviewer_notes?: string
}

interface StagingStats {
  total: number
  pending: number
  approved: number
  rejected: number
  avg_confidence: number
}

export default function StagingReviewPage() {
  const [items, setItems] = useState<StagingItem[]>([])
  const [stats, setStats] = useState<StagingStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    avg_confidence: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<StagingItem | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [processing, setProcessing] = useState<Set<string>>(new Set())

  const loadStagingData = async () => {
    setLoading(true)
    try {
      // Load staging items
      let query = supabase
        .from('staging_queue')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory)
      }

      if (searchTerm.trim()) {
        query = query.ilike('title', `%${searchTerm}%`)
      }

      const { data: stagingData, error: stagingError } = await query

      if (stagingError) throw stagingError

      setItems(stagingData || [])

      // Calculate stats
      const totalItems = stagingData?.length || 0
      const pending = stagingData?.filter(item => item.status === 'pending').length || 0
      const approved = stagingData?.filter(item => item.status === 'approved').length || 0
      const rejected = stagingData?.filter(item => item.status === 'rejected').length || 0
      const avgConfidence = totalItems > 0
        ? stagingData?.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / totalItems
        : 0

      setStats({
        total: totalItems,
        pending,
        approved,
        rejected,
        avg_confidence: Math.round(avgConfidence)
      })

    } catch (error) {
      console.error('Error loading staging data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStagingData()
  }, [filterStatus, filterCategory, searchTerm])

  const handleApprove = async (itemId: string, notes?: string) => {
    setProcessing(prev => new Set(prev).add(itemId))
    try {
      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          item_ids: [itemId],
          notes
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      await loadStagingData()
    } catch (error) {
      console.error('Error approving item:', error)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleReject = async (itemId: string, notes?: string) => {
    setProcessing(prev => new Set(prev).add(itemId))
    try {
      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          item_ids: [itemId],
          notes: notes || 'Content rejected during review'
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      await loadStagingData()
    } catch (error) {
      console.error('Error rejecting item:', error)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleBulkAction = async (action: 'approve' | 'reject', itemIds: string[]) => {
    try {
      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action === 'approve' ? 'bulk_approve' : 'bulk_reject',
          item_ids: itemIds,
          notes: `Bulk ${action}d from staging review`
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      await loadStagingData()
    } catch (error) {
      console.error(`Error bulk ${action}ing items:`, error)
    }
  }

  const handlePublishToMain = async (itemIds: string[]) => {
    try {
      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          item_ids: itemIds
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      alert(`Published ${data.published_items?.length || 0} items to main database`)
      await loadStagingData()
    } catch (error) {
      console.error('Error publishing items:', error)
      alert('Error publishing items. Check console for details.')
    }
  }

  const handleAIEnhancement = async (itemIds: string[], type: string, audience: string = 'tourists', style: string = 'engaging') => {
    try {
      const response = await fetch('/api/admin/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staging_ids: itemIds,
          enhancement_type: type,
          target_audience: audience,
          style: style
        })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      alert(`Enhanced ${data.enhanced_items?.length || 0} items with AI`)
      await loadStagingData()
    } catch (error) {
      console.error('Error enhancing items:', error)
      alert('Error enhancing items. Check console for details.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading staging data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staging Review</h1>
          <p className="mt-2 text-gray-600">Review and approve scraped content before publishing</p>
        </div>
        <Button
          onClick={loadStagingData}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className={`text-2xl font-bold ${getConfidenceColor(stats.avg_confidence)}`}>
                  {stats.avg_confidence}%
                </p>
              </div>
              <Star className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              <option value="activities">Activities</option>
              <option value="restaurants">Restaurants</option>
              <option value="hotels">Hotels</option>
            </select>

            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staging items found</h3>
            <p className="text-gray-600">Run the production scraper to generate content for review.</p>
            <Button className="mt-4" asChild>
              <a href="/admin/production-scraping">Go to Production Scraping</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                {item.primary_image ? (
                  <img
                    src={item.primary_image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/400/200'
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Badge variant="secondary">
                    {item.category}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3">
                  <Badge
                    variant="secondary"
                    className={`${getConfidenceColor(item.confidence_score)} bg-white`}
                  >
                    {item.confidence_score}% confidence
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {item.raw_content.description || 'No description available'}
                </p>

                {/* Quality Indicators */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.has_description && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Description
                    </Badge>
                  )}
                  {item.has_price && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      Price
                    </Badge>
                  )}
                  {item.has_rating && (
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      Rating
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-gray-600">
                    {item.image_count} images
                  </Badge>
                </div>

                {/* Metadata */}
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  {item.raw_content.price_range && (
                    <div>Price: {item.raw_content.price_range}</div>
                  )}
                  {item.raw_content.duration && (
                    <div>Duration: {item.raw_content.duration}</div>
                  )}
                  {item.raw_content.rating > 0 && (
                    <div>Rating: {item.raw_content.rating}/5 ({item.raw_content.review_count} reviews)</div>
                  )}
                  <div>Sources: {item.source_urls.length}</div>
                  {(item.raw_content as any).api_sources && (
                    <div>APIs: {(item.raw_content as any).api_sources.join(', ')}</div>
                  )}
                  {(item.raw_content as any).firecrawl_enriched && (
                    <div className="text-purple-600">✨ Firecrawl Enhanced</div>
                  )}
                  <div>Created: {new Date(item.created_at).toLocaleDateString()}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedItem(item)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>

                  {item.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        disabled={processing.has(item.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(item.id)}
                        disabled={processing.has(item.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {(items.filter(item => item.status === 'pending').length > 0 || items.filter(item => item.status === 'approved').length > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Pending Items Actions */}
              {items.filter(item => item.status === 'pending').length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Bulk Actions for {items.filter(item => item.status === 'pending').length} pending items:
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction('approve', items.filter(item => item.status === 'pending').map(item => item.id))}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve All Pending
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBulkAction('reject', items.filter(item => item.status === 'pending').map(item => item.id))}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject All Pending
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Enhancement Actions */}
              {items.filter(item => item.status === 'pending' || item.status === 'approved').length > 0 && (
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm font-medium">
                    AI Enhancement for {items.filter(item => item.status === 'pending' || item.status === 'approved').length} items:
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAIEnhancement(
                        items.filter(item => item.status === 'pending' || item.status === 'approved').map(item => item.id),
                        'description'
                      )}
                      variant="outline"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance Descriptions
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAIEnhancement(
                        items.filter(item => item.status === 'pending' || item.status === 'approved').map(item => item.id),
                        'full'
                      )}
                      variant="outline"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Full AI Enhancement
                    </Button>
                  </div>
                </div>
              )}

              {/* Approved Items Actions */}
              {items.filter(item => item.status === 'approved').length > 0 && (
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm font-medium">
                    Publish {items.filter(item => item.status === 'approved').length} approved items to main database:
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handlePublishToMain(items.filter(item => item.status === 'approved').map(item => item.id))}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Publish All Approved
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              {/* Image Gallery */}
              {selectedItem.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Images ({selectedItem.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedItem.images.slice(0, 6).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedItem.title} ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/200/128'
                        }}
                      />
                    ))}
                  </div>
                  {selectedItem.images.length > 6 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{selectedItem.images.length - 6} more images
                    </p>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedItem.raw_content.description}</p>
                </div>

                {selectedItem.raw_content.highlights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Highlights</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedItem.raw_content.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Category:</strong> {selectedItem.category}</div>
                      {selectedItem.raw_content.price_range && (
                        <div><strong>Price:</strong> {selectedItem.raw_content.price_range}</div>
                      )}
                      {selectedItem.raw_content.duration && (
                        <div><strong>Duration:</strong> {selectedItem.raw_content.duration}</div>
                      )}
                      {selectedItem.raw_content.rating > 0 && (
                        <div><strong>Rating:</strong> {selectedItem.raw_content.rating}/5 ({selectedItem.raw_content.review_count} reviews)</div>
                      )}
                      <div><strong>Confidence Score:</strong> {selectedItem.confidence_score}%</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sources</h3>
                    <div className="space-y-1 text-sm">
                      {selectedItem.source_urls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 truncate"
                        >
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          {new URL(url).hostname}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedItem.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        handleApprove(selectedItem.id)
                        setSelectedItem(null)
                      }}
                      disabled={processing.has(selectedItem.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Item
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedItem.id)
                        setSelectedItem(null)
                      }}
                      disabled={processing.has(selectedItem.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Item
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedItem(null)}>
                      Close Preview
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}