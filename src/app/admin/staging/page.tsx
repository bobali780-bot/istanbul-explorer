"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Filter,
  RefreshCw,
  Heart,
  RotateCcw,
  Star,
  Clock,
  Image,
  MapPin,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Wand2,
  Plus,
  AlertTriangle,
  FileText,
  Camera,
  History,
  X,
  Users,
  Building,
  Info,
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import NextImage from 'next/image'
import { processFirecrawlContent, formatContentForPreview } from '@/lib/contentProcessor'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface StagingItem {
  id: string
  title: string
  category: string
  primary_image?: string
  images?: string[]
  image_count?: number
  thumbnail_index?: number
  thumbnail_reason?: string
  raw_content?: any
  confidence_score?: number
  source_urls?: string[]
  status: string
  created_at: string
  updated_at?: string
  scraping_job_id: number
  uses_placeholder?: boolean
  validation_errors?: {
    hasVenueReference: boolean
    hasIstanbulReference: boolean
    hasRequiredFields: boolean
    categoryMatch: boolean
    reasonsForFailure: string[]
  }
  database_error?: string
  item_type: 'success' | 'failed'
  failure_type?: 'Content Validation' | 'Database Save' | 'Processing Error' | null
  placeholder_info?: {
    reason: string
    original_image_count: number
    placeholder_added_at: string
  } | null
  error_details?: {
    step: string
    message: string
    details?: any
  }
  term?: string
}

interface Stats {
  total: number
  successful: number
  failed: number
  pending: number
  approved: number
  rejected: number
  published: number
  using_placeholders: number
  validation_failures: number
  database_failures: number
}

export default function StagingPage() {
  const [stagingData, setStagingData] = useState<StagingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<StagingItem | null>(null)
  const [processing, setProcessing] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<Stats>({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    using_placeholders: 0,
    validation_failures: 0,
    database_failures: 0
  })
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [refillDialogOpen, setRefillDialogOpen] = useState(false)
  const [refillTarget, setRefillTarget] = useState<{ id: string; title: string; currentCount: number } | null>(null)
  const [refillTargetCount, setRefillTargetCount] = useState(15)
  const [jobsSheetOpen, setJobsSheetOpen] = useState(false)
  const [recentJobs, setRecentJobs] = useState<any[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)
  const [favourites, setFavourites] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-favourites')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    }
    return new Set()
  })
  const [reScrapeDialogOpen, setReScrapeDialogOpen] = useState(false)
  const [reScrapeTarget, setReScrapeTarget] = useState<{ id: string; title: string } | null>(null)
  const [reScrapeInstructions, setReScrapeInstructions] = useState('')
  const [aiUnderstanding, setAiUnderstanding] = useState<string>('')
  const [structuredIntent, setStructuredIntent] = useState<any>(null)
  const [showAiConfirmation, setShowAiConfirmation] = useState(false)
  const [showVersions, setShowVersions] = useState<{ [key: string]: boolean }>({})
  const [versions, setVersions] = useState<{ [key: string]: any[] }>({})
  const [localVersions, setLocalVersions] = useState<{ [key: string]: any[] }>({})

  const loadStagingData = useCallback(async () => {
    setLoading(true)
    try {
      const url = filterStatus !== 'all' 
        ? `/api/admin/staging/enhanced?status=${filterStatus}`
        : '/api/admin/staging/enhanced'
      const response = await fetch(url)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to load staging data')
      }

      setStagingData(result.items || [])
      setStats(result.stats || {
        total: 0,
        successful: 0,
        failed: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        published: 0,
        using_placeholders: 0,
        validation_failures: 0,
        database_failures: 0
      })
    } catch (error) {
      console.error('Error loading staging data:', error)
      setStagingData([])
      setError(`Failed to load staging data: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  useEffect(() => {
    loadStagingData()
  }, [loadStagingData])

  // Reload data when filter changes
  useEffect(() => {
    loadStagingData()
  }, [filterStatus, loadStagingData])

  // Debug logging for selectedItem
  useEffect(() => {
    if (selectedItem) {
      console.log('🐛 DEBUG selectedItem:', selectedItem)
      console.log('🐛 DEBUG selectedItem.images:', selectedItem.images)
      console.log('🐛 DEBUG selectedItem.images type:', typeof selectedItem.images)
      console.log('🐛 DEBUG selectedItem.images length:', selectedItem.images?.length)
      console.log('🐛 DEBUG selectedItem.primary_image:', selectedItem.primary_image)
    }
  }, [selectedItem])

  const handleApprove = async () => {
    if (!selectedItem) return

    try {
      setProcessing(prev => new Set(prev).add(selectedItem.id))

      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          items: [selectedItem.id]
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage('Item approved successfully!')
        setError(null)
        setTimeout(() => setSuccessMessage(null), 3000)
        await loadStagingData()
        setSelectedItem(null)
      } else {
        throw new Error(data.message || 'Failed to approve item')
      }
    } catch (error) {
      console.error('Error approving item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Error approving item: ${errorMessage}`)
      setSuccessMessage(null)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(selectedItem.id)
        return newSet
      })
    }
  }

  const handleReject = async () => {
    if (!selectedItem) return

    try {
      setProcessing(prev => new Set(prev).add(selectedItem.id))

      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          items: [selectedItem.id]
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage('Item rejected successfully!')
        setError(null)
        setTimeout(() => setSuccessMessage(null), 3000)
        await loadStagingData()
        setSelectedItem(null)
      } else {
        throw new Error(data.message || 'Failed to reject item')
      }
    } catch (error) {
      console.error('Error rejecting item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Error rejecting item: ${errorMessage}`)
      setSuccessMessage(null)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(selectedItem.id)
        return newSet
      })
    }
  }

  const handleThumbnailOverride = async (itemId: string, imageIndex: number, newThumbnailUrl: string) => {
    try {
      setProcessing(prev => new Set(prev).add(itemId))

      // Validate the image URL before updating
      try {
        new URL(newThumbnailUrl)
      } catch {
        throw new Error('Invalid image URL')
      }

      // Use the new universal update-field endpoint with fallback for missing columns
      const response = await fetch('/api/admin/staging/update-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(itemId),
          field: 'primary_image',
          value: newThumbnailUrl,
          // Don't try to update missing columns
          skipMissingColumns: true
        }),
      })

      const data = await response.json()

      if (data.success && data.updatedItem) {
        // Update the selected item if it's currently open
        if (selectedItem && selectedItem.id === itemId) {
          setSelectedItem({
            ...selectedItem,
            primary_image: data.updatedItem.primary_image,
            thumbnail_index: data.updatedItem.thumbnail_index,
            thumbnail_reason: data.updatedItem.thumbnail_reason
          })
        }

        // Update the staging data to reflect the change immediately
        setStagingData(prev => prev.map(item =>
          item.id === itemId
            ? { ...item, primary_image: data.updatedItem.primary_image }
            : item
        ))

        setSuccessMessage('Thumbnail updated successfully!')
        setError(null)
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        throw new Error(data.error || data.message || 'Failed to update thumbnail')
      }
    } catch (error) {
      console.error('Error updating thumbnail:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Error updating thumbnail: ${errorMessage}`)
      setSuccessMessage(null)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRetryValidation = async (item: StagingItem) => {
    if (!item.term) {
      setError('Cannot retry: original search term not available')
      setTimeout(() => setError(null), 5000)
      return
    }

    try {
      setProcessing(prev => new Set(prev).add(item.id))
      setSuccessMessage(`Retrying validation for "${item.term}"...`)

      // Call the scraping endpoint again with the original search term
      const response = await fetch('/api/admin/scrape-hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerms: [item.term],
          category: item.category,
          imagesPerItem: 15
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage(`Successfully retried "${item.term}". Refreshing data...`)
        setTimeout(() => {
          loadStagingData()
          setSuccessMessage(null)
        }, 2000)
      } else {
        throw new Error(result.error || 'Retry failed')
      }
    } catch (error) {
      console.error('Error retrying validation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Retry failed: ${errorMessage}`)
      setSuccessMessage(null)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }
  }

  const loadRecentJobs = async () => {
    try {
      const response = await fetch('/api/admin/scraping-jobs')
      const data = await response.json()
      if (data.success) {
        setRecentJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error loading recent jobs:', error)
    }
  }

  // Direct approve/reject functions for tile buttons
  const handleDirectApprove = async (itemId: string) => {
    try {
      setProcessing(prev => new Set(prev).add(itemId))

      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          items: [itemId]
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage('Item approved successfully!')
        setError(null)
        setTimeout(() => setSuccessMessage(null), 3000)
        await loadStagingData()
      } else {
        throw new Error(data.message || 'Failed to approve item')
      }
    } catch (error) {
      console.error('Error approving item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Error approving item: ${errorMessage}`)
      setSuccessMessage(null)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleDirectReject = async (itemId: string) => {
    try {
      setProcessing(prev => new Set(prev).add(itemId))

      const response = await fetch('/api/admin/staging-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          items: [itemId]
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage('Item rejected successfully!')
        setError(null)
        setTimeout(() => setSuccessMessage(null), 3000)
        await loadStagingData()
      } else {
        throw new Error(data.message || 'Failed to reject item')
      }
    } catch (error) {
      console.error('Error rejecting item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Error rejecting item: ${errorMessage}`)
      setSuccessMessage(null)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveImage = async (itemId: string, imageUrl: string) => {
    try {
      setProcessing(prev => new Set(prev).add(itemId))

      const response = await fetch('/api/admin/staging/remove-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tileId: itemId,
          imageUrl: imageUrl
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(`Image removed successfully. ${data.data.imagesRemaining} images remaining.`)
        setTimeout(() => setSuccessMessage(null), 3000)
        await loadStagingData()
        
        // If this was the selected item, update it
        if (selectedItem && selectedItem.id === itemId) {
          const updatedItem = stagingData.find(item => item.id === itemId)
          if (updatedItem) {
            setSelectedItem(updatedItem)
          }
        }
      } else {
        throw new Error(data.error || 'Failed to remove image')
      }
    } catch (error) {
      console.error('Error removing image:', error)
      setError(`Failed to remove image: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }


  // Favourites functions
  const toggleFavourite = (itemId: string) => {
    setFavourites(prev => {
      const newFavourites = new Set(prev)
      if (newFavourites.has(itemId)) {
        newFavourites.delete(itemId)
      } else {
        newFavourites.add(itemId)
      }
      // Persist to localStorage
      localStorage.setItem('admin-favourites', JSON.stringify(Array.from(newFavourites)))
      return newFavourites
    })
  }

  const isFavourite = (itemId: string) => {
    return favourites.has(itemId)
  }

  // Animated Heart Component
  const AnimatedHeart = ({ isFav, className = "" }: { isFav: boolean; className?: string }) => {
    return (
      <motion.div
        className={className}
        initial={false}
        animate={{
          scale: isFav ? 1.1 : 1,
          rotate: isFav ? 0 : 0
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart 
          className={`h-4 w-4 transition-colors duration-300 ${
            isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`} 
        />
      </motion.div>
    )
  }

  // Re-scrape functions
  const handleReScrape = (item: any) => {
    setReScrapeTarget({ id: item.id, title: item.title })
    setReScrapeInstructions('')
    setAiUnderstanding('')
    setShowAiConfirmation(false)
    setReScrapeDialogOpen(true)
  }

  const getAiUnderstanding = async () => {
    if (!reScrapeInstructions.trim()) return

    try {
      // Call AI API to parse the user's instructions
      const response = await fetch('/api/ai/parse-instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructions: reScrapeInstructions.trim(),
          itemTitle: reScrapeTarget?.title || 'this item'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAiUnderstanding(data.understanding)
        setStructuredIntent(data.structuredIntent)
        setShowAiConfirmation(true)
      } else {
        throw new Error(data.message || 'Failed to get AI understanding')
      }
    } catch (error) {
      console.error('Error getting AI understanding:', error)
      setError('Failed to get AI understanding. Please try again.')
      setTimeout(() => setError(null), 5000)
    }
  }

  const executeReScrape = async () => {
    if (!reScrapeTarget || !reScrapeInstructions.trim() || !structuredIntent) return

    try {
      setProcessing(prev => new Set(prev).add(reScrapeTarget.id))

      const response = await fetch('/api/admin/rescrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tileId: reScrapeTarget.id,
          structuredIntent: structuredIntent,
          instructions: reScrapeInstructions.trim()
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Create a local version record
        const newVersion = {
          id: `local-${Date.now()}`,
          version_number: (localVersions[reScrapeTarget.id]?.length || 0) + 1,
          changes_summary: data.changesSummary,
          status: 'approved',
          created_at: new Date().toISOString()
        }
        
        setLocalVersions(prev => ({
          ...prev,
          [reScrapeTarget.id]: [...(prev[reScrapeTarget.id] || []), newVersion]
        }))

        setSuccessMessage(`✅ Re-scraped "${reScrapeTarget.title}" successfully! ${data.changesSummary}`)
        setError(null)
        setTimeout(() => setSuccessMessage(null), 3000)
        await loadStagingData()
        setReScrapeDialogOpen(false)
        setReScrapeTarget(null)
        setReScrapeInstructions('')
        setAiUnderstanding('')
        setStructuredIntent(null)
        setShowAiConfirmation(false)
      } else {
        throw new Error(data.message || 'Failed to re-scrape item')
      }
    } catch (error) {
      console.error('Error re-scraping item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Error re-scraping item: ${errorMessage}`)
      setSuccessMessage(null)
      setTimeout(() => setError(null), 5000)
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev)
        if (reScrapeTarget) {
          newSet.delete(reScrapeTarget.id)
        }
        return newSet
      })
    }
  }

  // Version management functions
  const loadVersions = async (tileId: string) => {
    // Use local versions instead of database
    setVersions(prev => ({
      ...prev,
      [tileId]: localVersions[tileId] || []
    }))
  }

  const toggleVersions = (tileId: string) => {
    setShowVersions(prev => ({
      ...prev,
      [tileId]: !prev[tileId]
    }))
    
    if (!versions[tileId]) {
      loadVersions(tileId)
    }
  }

  const approveVersion = async (versionId: string) => {
    try {
      const response = await fetch('/api/admin/versions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId, status: 'approved' })
      })
      
      const data = await response.json()
      if (data.success) {
        setSuccessMessage('Version approved successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
        await loadStagingData()
      }
    } catch (error) {
      console.error('Error approving version:', error)
      setError('Failed to approve version')
      setTimeout(() => setError(null), 5000)
    }
  }

  // Filter staging data (client-side filtering for category and search only)
  const filteredData = stagingData.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFavourites = filterStatus !== 'favourites' || isFavourite(item.id)

    return matchesCategory && matchesSearch && matchesFavourites
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading staging data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {filterStatus === 'pending' && 'Staging Review'}
            {filterStatus === 'approved' && 'Approved Items'}
            {filterStatus === 'rejected' && 'Rejected Items'}
            {filterStatus === 'all' && 'All Items'}
            {filterStatus === 'favourites' && 'Favourite Items'}
          </h1>
          <p className="mt-2 text-gray-600">
            {filterStatus === 'pending' && 'Review and approve scraped content before publishing'}
            {filterStatus === 'approved' && 'Items that have been approved and are ready for publishing'}
            {filterStatus === 'rejected' && 'Items that have been rejected and need revision'}
            {filterStatus === 'all' && 'View all items across all statuses'}
            {filterStatus === 'favourites' && 'Your favourite items for testing and reference'}
          </p>
          
          {/* Folder Navigation */}
          <div className="mt-4 flex gap-2">
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Pending Review ({stats.pending})
            </Button>
            <Button
              variant={filterStatus === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('approved')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approved ({stats.approved})
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('rejected')}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Rejected ({stats.rejected})
            </Button>
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All
            </Button>
            <Button
              variant={filterStatus === 'favourites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('favourites')}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Favourites ({favourites.size})
            </Button>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <Alert className="mt-4 max-w-md border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="mt-4 max-w-md border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex gap-2">
          <Sheet open={jobsSheetOpen} onOpenChange={setJobsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" onClick={loadRecentJobs}>
                <FileText className="h-4 w-4 mr-2" />
                Job History
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[800px]">
              <SheetHeader>
                <SheetTitle>Recent Scraping Jobs</SheetTitle>
                <SheetDescription>
                  View recent hybrid scraping job results and statistics
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto">
                {recentJobs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No scraping jobs found</p>
                ) : (
                  recentJobs.map((job, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Job #{job.id}</h3>
                          <p className="text-sm text-gray-600">{job.search_terms?.join(', ')}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(job.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      {job.results && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Results: </span>
                          {job.results.length} items processed
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            onClick={loadStagingData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
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
                <p className="text-sm text-gray-600">Using Placeholders</p>
                <p className="text-2xl font-bold text-orange-600">{stats.using_placeholders}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validation Failures</p>
                <p className="text-2xl font-bold text-red-600">{stats.validation_failures}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
              </div>
              <Sparkles className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Database Failures</p>
                <p className="text-2xl font-bold text-purple-600">{stats.database_failures}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="activities">Activities</option>
            <option value="hotels">Hotels</option>
            <option value="restaurants">Restaurants</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </select>
        </div>

        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        <div className="ml-auto text-sm text-gray-500">
          Showing {filteredData.length} of {stagingData.length} items
        </div>
      </div>

      {/* Content Grid */}
      {filteredData.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Eye className="h-12 w-12 text-gray-300" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">No staging items</h3>
              <p className="text-gray-500">
                {stagingData.length === 0
                  ? "Run a hybrid scrape to populate the staging queue"
                  : "No items match your current filters"
                }
              </p>
            </div>
            {stagingData.length === 0 && (
              <Button
                onClick={() => window.location.href = '/admin/hybrid-scraping'}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Scraping
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="space-y-0">
            <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 ${
              item.item_type === 'failed' ? 'border-red-200 bg-red-50' :
              item.uses_placeholder ? 'border-orange-200 bg-orange-50' :
              'border-gray-200'
            }`}>
              <div 
                className="relative h-64 overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHoveredTile(item.id)}
                onMouseLeave={() => setHoveredTile(null)}
                onClick={() => setSelectedItem(item)}
              >
                {item.item_type === 'success' ? (
                  <>
                    {/* Full Coverage Background Image */}
                  <img
                      src={item.primary_image || '/api/placeholder/400/300'}
                    alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                        console.error(`❌ Card thumbnail failed to load for "${item.title}":`, item.primary_image);
                        console.error(`❌ Available images:`, item.images);
                      e.currentTarget.style.display = 'none';
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500';
                      fallbackDiv.textContent = 'Image failed';
                      e.currentTarget.parentNode?.appendChild(fallbackDiv);
                    }}
                    onLoad={() => {
                        console.log(`✅ Card thumbnail loaded for "${item.title}":`, item.primary_image);
                      }}
                    />
                    
                    {/* Professional Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      <Badge className="bg-white/90 text-gray-800 border-white/50">{item.category}</Badge>
                      {/* Version indicator for rescraped items */}
                      {(item.raw_content?.rescrape_count || 0) > 0 && (
                        <Badge variant="secondary" className="bg-blue-500/90 text-white border-blue-400/50">
                          V{(item.raw_content?.rescrape_count || 0) + 1}
                  </Badge>
                      )}
                    </div>

                    <div className="absolute top-12 right-3 flex gap-2 z-10">
                  {/* Status Badge for successful items */}
                  {item.item_type === 'success' && (
                        <Badge className={
                          item.status === 'approved' ? 'bg-green-500/90 text-white border-green-400/50' :
                          item.status === 'rejected' ? 'bg-red-500/90 text-white border-red-400/50' :
                          item.status === 'published' ? 'bg-blue-500/90 text-white border-blue-400/50' :
                          'bg-gray-500/90 text-white border-gray-400/50'
                    }>
                      {item.status || 'pending'}
                    </Badge>
                  )}
                </div>

                    {/* Bottom Warning Badges */}
                    <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                  {item.uses_placeholder && (
                        <Badge className="bg-orange-500/90 text-white border-orange-400/50">
                          ⚠️ Placeholder
                    </Badge>
                  )}
              </div>


                    {/* Title Overlay - Professional Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="text-white text-lg font-semibold mb-1 drop-shadow-lg">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-white/90 text-sm">
                      <div className="flex items-center">
                        <Image className="h-4 w-4 mr-1" />
                        {item.images?.length || 0} images
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                          {item.raw_content?.rating || 'N/A'}
                      </div>
                    </div>
                      </div>

                    {/* Hover Overlay with Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <Button
                        size="sm"
                          variant="secondary"
                          className="bg-white/95 hover:bg-white text-gray-800 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                        {filterStatus === 'pending' && (
                      <Button
                        size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDirectApprove(item.id);
                        }}
                        disabled={processing.has(item.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons - Always visible in top-right corner */}
                    <div className="absolute top-3 right-3 flex gap-1 z-20">
                      {/* Heart icon for favourites */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavourite(item.id)
                        }}
                        className="p-1 hover:bg-red-500/20 bg-black/20 text-white hover:text-red-400"
                      >
                        <AnimatedHeart 
                          isFav={isFavourite(item.id)}
                          className="h-4 w-4"
                        />
                      </Button>

                      {/* Re-scrape button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReScrape(item)
                        }}
                        disabled={processing.has(item.id)}
                        className="p-1 hover:bg-blue-500/20 bg-black/20 text-white hover:text-blue-400"
                      >
                        {processing.has(item.id) ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Versions button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleVersions(item.id)
                        }}
                        className="p-1 hover:bg-purple-500/20 bg-black/20 text-white hover:text-purple-400"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Failed to Process</p>
                    </div>
                  </div>
                  )}
                </div>

            </Card>

            </div>
          ))}
        </div>
      )}

      {/* Enhanced Preview Modal with Tabs */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div>                  <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedItem.category}</Badge>
                    <Badge variant="outline">ID: {selectedItem.id}</Badge>
                    {selectedItem.confidence_score && (
                      <Badge variant={selectedItem.confidence_score >= 80 ? "default" : "secondary"}>
                        {selectedItem.confidence_score}% confidence
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Tabbed Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="tile-preview" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 px-6 pt-4 flex-shrink-0">
                  <TabsTrigger value="tile-preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Tile Preview
                  </TabsTrigger>
                  <TabsTrigger value="detail-preview" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Detail Page Preview
                  </TabsTrigger>
                  <TabsTrigger value="admin-tools" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Images & Tools
                  </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                  {/* Tile Preview Tab */}
                  <TabsContent value="tile-preview" className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-900">
                        <Eye className="h-5 w-5 mr-2" />
                        Live Site Tile Preview
                      </h3>
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
                        {/* Card Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={selectedItem.primary_image}
                            alt={selectedItem.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              console.error(`❌ Preview image failed to load:`, selectedItem.primary_image);
                              e.currentTarget.style.display = 'none';
                              const fallbackDiv = document.createElement('div');
                              fallbackDiv.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500';
                              fallbackDiv.textContent = 'Preview failed';
                              e.currentTarget.parentNode?.appendChild(fallbackDiv);
                            }}
                            onLoad={() => {
                              console.log(`✅ Preview image loaded:`, selectedItem.primary_image);
                            }}
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white text-gray-800 shadow-sm">
                              {selectedItem.category}
                            </Badge>
                          </div>
                          {selectedItem.raw_content.rating > 0 && (
                            <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm flex items-center">
                              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {selectedItem.raw_content.rating}
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                            {selectedItem.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {selectedItem.raw_content.description || 'Discover this amazing destination in Istanbul...'}
                          </p>

                          {/* Metadata */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              Istanbul
                            </div>
                            {selectedItem.raw_content.price_range && (
                              <div className="font-medium text-green-600">
                                {selectedItem.raw_content.price_range}
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                            Learn More
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>

                        {/* Image Count Indicator */}
                        <div className="px-4 pb-3">
                          <div className="flex items-center justify-center text-xs text-gray-500">
                            <Camera className="h-3 w-3 mr-1" />
                            {selectedItem.images?.length || 0} photos available
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Detail Page Preview Tab - Matches Live Venue Page Template */}
                  <TabsContent value="detail-preview" className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-green-900">
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Live Venue Page Preview
                        <Badge variant="outline" className="ml-2 text-xs">Exact User Experience</Badge>
                      </h3>

                      {/* Simulated Live Venue Page - Exact Template Match */}
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
                        {/* Hero Section - Matches Live Template */}
                        <section className="relative">
                          {/* Image Gallery Simulation */}
                          <div className="relative h-96 mb-8 overflow-hidden rounded-lg">
                            <img
                              src={selectedItem.primary_image}
                              alt={selectedItem.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.error(`❌ Hero image failed to load:`, selectedItem.primary_image);
                                e.currentTarget.style.display = 'none';
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-gray-500';
                                fallbackDiv.textContent = 'Hero image failed';
                                e.currentTarget.parentNode?.appendChild(fallbackDiv);
                              }}
                              onLoad={() => {
                                console.log(`✅ Hero image loaded:`, selectedItem.primary_image);
                              }}
                            />
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-black bg-opacity-70 text-white text-xs">
                                <Camera className="h-3 w-3 mr-1" />
                                {selectedItem.images?.length || 0} photos
                              </Badge>
                            </div>
                          </div>

                          {/* Venue Info - Matches Live Template */}
                          <div className="px-8 mb-8">
                            <div className="space-y-6">
                              <div className="flex flex-wrap items-center gap-4">
                                <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
                                  #{selectedItem.id}
                                </Badge>
                                {selectedItem.raw_content.rating > 0 && (
                                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-lg">{selectedItem.raw_content.rating}</span>
                                    {selectedItem.raw_content.review_count && (
                                      <span className="text-sm text-gray-600">
                                        ({selectedItem.raw_content.review_count.toLocaleString()} reviews)
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                                {selectedItem.title}
                              </h1>

                              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
                                {selectedItem.raw_content.description || `Discover this amazing ${selectedItem.category.slice(0, -1)} in Istanbul, offering unique experiences and unforgettable memories for travelers from around the world.`}
                              </p>

                              <div className="flex flex-wrap items-center gap-6 text-lg">
                                {selectedItem.raw_content.duration && (
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-5 h-5" />
                                    <span>{selectedItem.raw_content.duration}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="w-5 h-5" />
                                  <span>{selectedItem.raw_content.location || 'Istanbul, Turkey'}</span>
                                </div>
                                {selectedItem.raw_content.price_range && (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-lg font-semibold px-4 py-2">
                                      {selectedItem.raw_content.price_range}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Main Content - Matches Live Template */}
                        <section className="py-8">
                          <div className="px-8">
                            <div className="grid lg:grid-cols-3 gap-12">
                              {/* Main Content */}
                              <div className="lg:col-span-2 space-y-12">
                                {/* Description */}
                                <div>
                                  <h2 className="text-3xl font-bold mb-6 text-gray-900">About This Experience</h2>
                                  <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
                                    {selectedItem.raw_content?.firecrawl_enriched && selectedItem.raw_content?.content ? (
                                      <div>
                                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                          <p className="text-sm text-green-700">
                                            ✅ <strong>Enhanced with Firecrawl:</strong> Content processed from official sources into user-friendly format.
                                          </p>
                                  </div>
                                        {(() => {
                                          const processed = processFirecrawlContent(selectedItem.raw_content.content, selectedItem.title);
                                          const formatted = formatContentForPreview(processed, selectedItem.title);
                                          return (
                                            <div className="whitespace-pre-line text-sm leading-relaxed">
                                              {formatted}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    ) : selectedItem.raw_content?.enhanced_description ? (
                                      <div>
                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                          <p className="text-sm text-blue-700">
                                            ✅ <strong>Enhanced with AI:</strong> Premium description generated by GPT-4 for luxury travel experience.
                                          </p>
                                        </div>
                                        <div className="whitespace-pre-line text-sm leading-relaxed">
                                          {selectedItem.raw_content.enhanced_description}
                                        </div>
                                      </div>
                                    ) : selectedItem.raw_content?.description && selectedItem.raw_content.description !== `Experience ${selectedItem.title} in Istanbul, Turkey.` ? (
                                      <div>
                                        <p>{selectedItem.raw_content.description}</p>
                                        {selectedItem.raw_content?.firecrawl_enriched && (
                                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-sm text-green-700">
                                              ✅ <strong>Enhanced with Firecrawl:</strong> Description enriched from official sources.
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                          <p className="text-orange-800">
                                            <strong>⚠️ No Premium Description Available</strong>
                                          </p>
                                          <p className="text-sm text-orange-700 mt-2">
                                            This venue needs AI enhancement or manual description for a premium experience.
                                          </p>
                                          <Button 
                                            size="sm" 
                                            className="mt-3 bg-blue-600 hover:bg-blue-700"
                                            onClick={async () => {
                                              try {
                                                const response = await fetch('/api/ai/enhance-description', {
                                                  method: 'POST',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({
                                                    title: selectedItem.title,
                                                    category: selectedItem.category,
                                                    address: selectedItem.raw_content?.address,
                                                    rating: selectedItem.raw_content?.rating,
                                                    reviewCount: selectedItem.raw_content?.review_count,
                                                    venueType: selectedItem.raw_content?.types?.[0]
                                                  })
                                                });
                                                
                                                const data = await response.json();
                                                if (data.success) {
                                                  // Update the staging item with enhanced description
                                                  const updateResponse = await fetch('/api/admin/staging/update-field', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                      itemId: selectedItem.id,
                                                      field: 'raw_content.enhanced_description',
                                                      value: data.data.enhanced_description
                                                    })
                                                  });
                                                  
                                                  if (updateResponse.ok) {
                                                    setSuccessMessage('✅ Premium description generated successfully!');
                                                    setTimeout(() => setSuccessMessage(null), 3000);
                                                    await loadStagingData();
                                                  }
                                                } else {
                                                  // Handle API errors
                                                  const errorMessage = data.code === 'MISSING_API_KEY' 
                                                    ? 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.'
                                                    : data.error || 'Failed to generate premium description';
                                                  setError(errorMessage);
                                                  setTimeout(() => setError(null), 5000);
                                                }
                                              } catch (error) {
                                                console.error('Error enhancing description:', error);
                                                setError('Failed to generate premium description');
                                                setTimeout(() => setError(null), 3000);
                                              }
                                            }}
                                          >
                                            <Wand2 className="h-4 w-4 mr-2" />
                                            Generate Premium Description
                                          </Button>
                                        </div>
                                        <p className="text-gray-500 italic">
                                          Basic info: {selectedItem.title} is a {selectedItem.category.slice(0, -1)} located at {selectedItem.raw_content?.address || 'Istanbul, Turkey'}.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* What to Expect */}
                                {selectedItem.raw_content.highlights && selectedItem.raw_content.highlights.length > 0 && (
                                  <div>
                                    <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                                      <div className="w-6 h-6 text-blue-600">ℹ️</div>
                                      What to Expect
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                       {selectedItem.raw_content.highlights.map((highlight: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3">
                                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                          <p className="text-gray-600">{highlight}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Why Visit */}
                                {selectedItem.raw_content.why_visit && selectedItem.raw_content.why_visit.length > 0 && (
                                  <div>
                                    <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                                      <Heart className="h-6 w-6 text-red-500" />
                                      Why Visit
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                      {selectedItem.raw_content.why_visit.map((reason: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3">
                                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                          <p className="text-gray-600">{reason}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Accessibility & Facilities */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                  {/* Accessibility */}
                                  <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                                      <Users className="h-5 w-5 text-green-600" />
                                      Accessibility
                                    </h3>
                                    <div className="space-y-3">
                                      {selectedItem.raw_content.accessibility && (
                                        <>
                                          {selectedItem.raw_content.accessibility.wheelchair_accessible && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Wheelchair accessible</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.accessibility.stroller_friendly && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Stroller friendly</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.accessibility.kid_friendly && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Kid friendly</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.accessibility.senior_friendly && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Senior friendly</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.accessibility.accessibility_notes && (
                                            <p className="text-sm text-gray-600 mt-2">{selectedItem.raw_content.accessibility.accessibility_notes}</p>
                                          )}
                                        </>
                                      )}
                                      {(!selectedItem.raw_content.accessibility || Object.values(selectedItem.raw_content.accessibility).every(v => !v)) && (
                                        <p className="text-sm text-gray-500 italic">Accessibility information not available</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Facilities */}
                                  <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                                      <Building className="h-5 w-5 text-blue-600" />
                                      Facilities
                                    </h3>
                                    <div className="space-y-3">
                                      {selectedItem.raw_content.facilities && (
                                        <>
                                          {selectedItem.raw_content.facilities.toilets && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Toilets available</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.facilities.cafe_restaurant && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Café/Restaurant</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.facilities.gift_shop && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Gift shop</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.facilities.parking && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Parking available</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.facilities.wifi && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Free WiFi</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.facilities.audio_guide && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Audio guide available</span>
                                            </div>
                                          )}
                                          {selectedItem.raw_content.facilities.guided_tours && (
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="text-sm text-gray-600">Guided tours available</span>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {(!selectedItem.raw_content.facilities || Object.values(selectedItem.raw_content.facilities).every(v => !v)) && (
                                        <p className="text-sm text-gray-500 italic">Facility information not available</p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Practical Information */}
                                {selectedItem.raw_content.practical_info && Object.values(selectedItem.raw_content.practical_info).some(v => v) && (
                                  <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                                      <Info className="h-5 w-5 text-purple-600" />
                                      Practical Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                      {selectedItem.raw_content.practical_info.dress_code && (
                                        <div>
                                          <h4 className="font-semibold text-gray-800 mb-2">Dress Code</h4>
                                          <p className="text-sm text-gray-600">{selectedItem.raw_content.practical_info.dress_code}</p>
                                        </div>
                                      )}
                                      {selectedItem.raw_content.practical_info.photography_policy && (
                                        <div>
                                          <h4 className="font-semibold text-gray-800 mb-2">Photography Policy</h4>
                                          <p className="text-sm text-gray-600">{selectedItem.raw_content.practical_info.photography_policy}</p>
                                        </div>
                                      )}
                                      {selectedItem.raw_content.practical_info.entry_requirements && (
                                        <div>
                                          <h4 className="font-semibold text-gray-800 mb-2">Entry Requirements</h4>
                                          <p className="text-sm text-gray-600">{selectedItem.raw_content.practical_info.entry_requirements}</p>
                                        </div>
                                      )}
                                      {selectedItem.raw_content.practical_info.safety_notes && (
                                        <div>
                                          <h4 className="font-semibold text-gray-800 mb-2">Safety Notes</h4>
                                          <p className="text-sm text-gray-600">{selectedItem.raw_content.practical_info.safety_notes}</p>
                                        </div>
                                      )}
                                      {selectedItem.raw_content.practical_info.etiquette_tips && (
                                        <div>
                                          <h4 className="font-semibold text-gray-800 mb-2">Etiquette Tips</h4>
                                          <p className="text-sm text-gray-600">{selectedItem.raw_content.practical_info.etiquette_tips}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Photo Gallery - ENHANCED FOR VISIBILITY */}
                                <div style={{backgroundColor: '#f0f9ff', padding: '20px', border: '2px solid #0ea5e9', borderRadius: '8px', marginTop: '40px'}}>
                                  <h3 className="text-2xl font-bold mb-6 text-blue-900">📸 Photo Gallery ({selectedItem.images?.length || 0} images)</h3>
                                  {!selectedItem.images || (selectedItem.images?.length || 0) === 0 ? (
                                    <div className="text-gray-500 text-center py-8">
                                      No images available for this item
                                    </div>
                                  ) : (
                                    <div className="text-green-600 mb-4 font-semibold">
                                      ✅ Found {selectedItem.images?.length || 0} images - Gallery should appear below:
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(selectedItem.images || []).map((image, index) => {
                                      // Debug logging for gallery images
                                      console.log(`🖼️ Preview gallery image ${index + 1}:`, image, `(isPrimary: ${image === selectedItem.primary_image})`);
                                      return (
                                        <div key={index} className="relative group">
                                        <img
                                          src={image}
                                          alt={`${selectedItem.title} preview gallery ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                                          onError={(e) => {
                                            console.error(`❌ Preview gallery image ${index + 1} failed:`, image);
                                            e.currentTarget.style.display = 'none';
                                            const fallbackDiv = document.createElement('div');
                                            fallbackDiv.className = 'w-full h-32 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-lg';
                                            fallbackDiv.textContent = `Preview image ${index + 1} failed`;
                                            e.currentTarget.parentNode?.appendChild(fallbackDiv);
                                          }}
                                          onLoad={() => {
                                            console.log(`✅ Preview gallery image ${index + 1} loaded:`, image);
                                          }}
                                          onClick={() => {
                                            console.log(`🔍 Opening lightbox from preview gallery image ${index + 1}:`, image);
                                            setLightboxImageIndex(index)
                                            setLightboxOpen(true)
                                          }}
                                        />
                                          {/* Primary Image Badge */}
                                          {image === selectedItem.primary_image && (
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                              Primary
                                      </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Sidebar - Matches Live Template */}
                              <div className="lg:col-span-1">
                                <div className="sticky top-8 space-y-6">
                                  {/* Booking Card */}
                                  <Card className="shadow-lg border-2">
                                    <CardHeader className="text-center">
                                      <CardTitle className="text-2xl text-gray-900">Book This Experience</CardTitle>
                                      <CardDescription>
                                        Skip the lines and secure your spot today
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                      <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                          {selectedItem.raw_content.price_range || 'From €25'}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                          Per person • Instant confirmation
                                        </p>
                                      </div>

                                      <Button
                                        size="lg"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                                      >
                                        Book Now
                                        <ExternalLink className="w-5 h-5 ml-2" />
                                      </Button>

                                      <div className="text-center">
                                        <p className="text-xs text-gray-500">
                                          Free cancellation available • No hidden fees
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Details Card */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Experience Details
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600">Duration</span>
                                          <span className="font-semibold">{selectedItem.raw_content.duration || "2-3 hours"}</span>
                                        </div>
                                        <div className="border-t"></div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600">Location</span>
                                          <span className="font-semibold text-right">{selectedItem.raw_content.location || "Istanbul, Turkey"}</span>
                                        </div>
                                        <div className="border-t"></div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600">Type</span>
                                          <span className="font-semibold">{selectedItem.category}</span>
                                        </div>
                                        {selectedItem.raw_content.opening_hours && (
                                          <>
                                            <div className="border-t"></div>
                                            <div className="flex justify-between items-center">
                                              <span className="text-gray-600">Hours</span>
                                              <span className="font-semibold text-right">{selectedItem.raw_content.opening_hours}</span>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Rating Card */}
                                  {selectedItem.raw_content.rating > 0 && (
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="text-center space-y-2">
                                          <div className="flex items-center justify-center gap-2">
                                            <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                                            <span className="text-3xl font-bold">{selectedItem.raw_content.rating}</span>
                                          </div>
                                          <p className="text-gray-600">
                                            Based on {selectedItem.raw_content.review_count?.toLocaleString() || '1,000+'} reviews
                                          </p>
                                          <div className="text-sm text-gray-500">
                                            Excellent rating on booking platforms
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Admin Tools Tab */}
                  <TabsContent value="admin-tools" className="space-y-6">
                    {/* Placeholder Warning Banner */}
                    {selectedItem.uses_placeholder && selectedItem.placeholder_info && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2 flex items-center text-red-900">
                              <AlertTriangle className="h-5 w-5 mr-2" />
                              ⚠️ Using Placeholder Image - Action Required
                            </h3>
                            <p className="text-red-800 mb-3">
                              This item is using a placeholder image because: <strong>{selectedItem.placeholder_info.reason}</strong>
                            </p>
                            <div className="text-sm text-red-700 space-y-1">
                              <p>• Original image count: {selectedItem.placeholder_info.original_image_count}</p>
                              <p>• Placeholder added: {new Date(selectedItem.placeholder_info.placeholder_added_at).toLocaleString()}</p>
                              <p>• <strong>Do not approve this item until a real thumbnail is uploaded</strong></p>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                // This would open a file upload dialog - for now show a placeholder message
                                alert('File upload functionality would go here. For now, please manually update the primary_image field.')
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Upload Real Thumbnail
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DEBUG: Log selectedItem data - moved to useEffect for proper React rendering */}

                    {/* Image Management */}
                    {selectedItem.images && (selectedItem.images?.length || 0) > 0 ? (
                      <div className="bg-orange-50 rounded-lg border-2 border-orange-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-900">
                          <Camera className="h-5 w-5 mr-2" />
                          Image Management ({selectedItem.images?.length || 0} images)
                        </h3>
                        
                        {/* Debug: Show image URLs */}
                        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
                          <details>
                            <summary className="cursor-pointer font-medium">🔍 Debug: Image URLs</summary>
                            <div className="mt-2 space-y-1">
                              <div><strong>Primary:</strong> {selectedItem.primary_image}</div>
                              {selectedItem.images?.slice(0, 3).map((url, idx) => (
                                <div key={idx}><strong>Image {idx + 1}:</strong> {url}</div>
                              ))}
                              {selectedItem.images?.length > 3 && (
                                <div className="text-gray-500">... and {selectedItem.images.length - 3} more</div>
                              )}
                            </div>
                          </details>
                        </div>

                        {/* Current Thumbnail */}
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            Current Thumbnail
                            {selectedItem.thumbnail_reason && (
                              <span className="text-sm font-normal text-gray-600 ml-2">
                                • {selectedItem.thumbnail_reason}
                              </span>
                            )}
                          </h4>
                          <div className="relative w-full max-w-xs h-48 rounded overflow-hidden">
                            {/* TEMPORARY: Plain <img> tag instead of NextImage for testing */}
                            <img
                              src={selectedItem.primary_image}
                              alt={`${selectedItem.title} thumbnail`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.error('❌ Primary thumbnail plain img failed to load:', selectedItem.primary_image);
                                e.currentTarget.style.display = 'none';
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500';
                                fallbackDiv.textContent = 'Primary thumbnail failed';
                                e.currentTarget.parentNode?.appendChild(fallbackDiv);
                              }}
                              onLoad={() => {
                                console.log('✅ Primary thumbnail plain img loaded successfully:', selectedItem.primary_image);
                              }}
                            />
                          </div>
                        </div>

                        {/* All Images Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {(selectedItem.images || []).map((image, index) => (
                            <div key={index} className="relative group">
                              <div
                                className={`relative w-full h-32 rounded transition-all cursor-pointer border-2 ${
                                  image === selectedItem.primary_image
                                    ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-300'
                                    : 'border-gray-200 hover:ring-2 hover:ring-gray-300'
                                }`}
                                onClick={() => {
                                  setLightboxImageIndex(index)
                                  setLightboxOpen(true)
                                }}
                              >
                                <img
                                  src={image}
                                  alt={`${selectedItem.title} image ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    console.error(`❌ Gallery image ${index + 1} FAILED:`, image);
                                    console.error('Error details:', e);
                                    e.currentTarget.style.display = 'none';
                                    const fallbackDiv = document.createElement('div');
                                    fallbackDiv.className = 'w-full h-full bg-red-100 flex items-center justify-center text-xs text-red-600 rounded border-2 border-red-300';
                                    fallbackDiv.textContent = `❌ Image ${index + 1} failed to load`;
                                    e.currentTarget.parentNode?.appendChild(fallbackDiv);
                                  }}
                                  onLoad={(e) => {
                                    console.log(`✅ Gallery image ${index + 1} LOADED:`, image);
                                    console.log('Image element:', e.currentTarget);
                                  }}
                                />
                                
                                {/* Remove Image Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveImage(selectedItem.id, image)
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove this image"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                
                                {/* Primary Image Badge */}
                                {image === selectedItem.primary_image && (
                                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    Primary
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                                <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              {image !== selectedItem.primary_image && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleThumbnailOverride(selectedItem.id, index, image)
                                  }}
                                  disabled={processing.has(selectedItem.id)}
                                  className="absolute inset-x-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 z-10"
                                >
                                  {processing.has(selectedItem.id) ? 'Updating...' : 'Set as Thumbnail'}
                                </Button>
                              )}
                              {image === selectedItem.primary_image && (
                                <div className="absolute inset-x-1 bottom-1 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                                  Current Thumbnail
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* View All Images Button */}
                        <div className="mt-4 text-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setLightboxImageIndex(0)
                              setLightboxOpen(true)
                            }}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View All {selectedItem.images?.length || 0} Images
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 mb-6">
                        <div className="text-center">
                          <Camera className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Images Available</h3>
                          <p className="text-gray-500">This item doesn&apos;t have any images to display.</p>
                        </div>
                      </div>
                    )}

                    {/* Raw Data and Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Item Details</h3>
                            <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                              <div><strong>ID:</strong> {selectedItem.id}</div>
                              <div><strong>Category:</strong> {selectedItem.category}</div>
                              <div><strong>Status:</strong> {selectedItem.status || 'pending'}</div>
                              <div><strong>Confidence:</strong> {selectedItem.confidence_score}%</div>
                              <div><strong>Images:</strong> {selectedItem.images?.length || 0}</div>
                              <div><strong>Created:</strong> {selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleDateString() : 'Unknown'}</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Sources</h3>
                            <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-auto">
                              {selectedItem.source_urls && selectedItem.source_urls.length > 0 ? (
                                selectedItem.source_urls.map((url, index) => (
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
                                ))
                              ) : (
                                <span className="text-gray-500">No sources available</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons - Only show for pending items */}
                        {filterStatus === 'pending' && (
                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            onClick={handleApprove}
                            disabled={processing.has(selectedItem.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {processing.has(selectedItem.id) ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Item
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={handleReject}
                            disabled={processing.has(selectedItem.id)}
                            variant="destructive"
                            className="flex-1"
                          >
                            {processing.has(selectedItem.id) ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Item
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedItem(null)}>
                            Close Preview
                          </Button>
                        </div>
                        )}
                        
                        {/* Close button for non-pending items */}
                        {filterStatus !== 'pending' && (
                          <div className="flex justify-end pt-4 border-t">
                            <Button variant="outline" onClick={() => setSelectedItem(null)}>
                              Close Preview
                            </Button>
                          </div>
                        )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {selectedItem && lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                <XCircle className="h-6 w-6" />
              </Button>

              {/* Navigation Buttons */}
              {(selectedItem.images?.length || 0) > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLightboxImageIndex(prev =>
                      prev === 0 ? (selectedItem.images?.length || 1) - 1 : prev - 1
                    )}
                    className="absolute left-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  >
                    <ArrowRight className="h-6 w-6 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLightboxImageIndex(prev =>
                      prev === (selectedItem.images?.length || 1) - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Main Image - TEMPORARY: Using plain <img> for testing */}
              <div className="relative max-w-full max-h-[80vh] w-full h-[80vh] flex items-center justify-center">
                {/* Debug logging moved to console outside JSX */}
                {(() => {
                  console.log('🔍 Lightbox displaying image:', {
                    index: lightboxImageIndex,
                    url: selectedItem.images?.[lightboxImageIndex],
                    totalImages: selectedItem.images?.length || 0
                  })
                  return null
                })()}
                <img
                  src={selectedItem.images?.[lightboxImageIndex] || ''}
                  alt={`${selectedItem.title} image ${lightboxImageIndex + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    console.error('❌ Lightbox plain img failed to load:', {
                      index: lightboxImageIndex,
                      url: selectedItem.images?.[lightboxImageIndex]
                    });
                    e.currentTarget.style.display = 'none';
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'max-w-full max-h-[80vh] bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg p-8';
                    fallbackDiv.textContent = `Failed to load image ${lightboxImageIndex + 1}`;
                    e.currentTarget.parentNode?.appendChild(fallbackDiv);
                  }}
                  onLoad={() => {
                    console.log('✅ Lightbox plain img loaded successfully:', {
                      index: lightboxImageIndex,
                      url: selectedItem.images?.[lightboxImageIndex]
                    });
                  }}
                />

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{selectedItem.title}</h4>
                    <p className="text-sm opacity-90">
                      Image {lightboxImageIndex + 1} of {selectedItem.images?.length || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedItem.images?.[lightboxImageIndex] === selectedItem.primary_image ? (
                      <Badge className="bg-blue-600">Current Thumbnail</Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          handleThumbnailOverride(selectedItem.id, lightboxImageIndex, selectedItem.images?.[lightboxImageIndex] || '')
                          setLightboxOpen(false)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Set as Thumbnail
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {(selectedItem.images?.length || 0) > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 p-2 rounded-lg">
                <div className="flex gap-2 max-w-md overflow-x-auto">
                  {(selectedItem.images || []).map((image, index) => {
                    console.log(`🖼️ Lightbox thumbnail ${index + 1}:`, image, `(isPrimary: ${image === selectedItem.primary_image})`);
                    return (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-12 h-12 object-cover rounded cursor-pointer transition-all ${
                          index === lightboxImageIndex
                            ? 'ring-2 ring-blue-400 opacity-100'
                            : 'opacity-60 hover:opacity-80'
                        }`}
                        onClick={() => {
                          console.log(`🔍 Switching to lightbox image ${index + 1}:`, image);
                          setLightboxImageIndex(index);
                        }}
                        onError={(e) => {
                          console.error(`❌ Lightbox thumbnail ${index + 1} failed:`, image);
                          e.currentTarget.src = '/api/placeholder/48/48';
                        }}
                        onLoad={() => {
                          console.log(`✅ Lightbox thumbnail ${index + 1} loaded:`, image);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Re-scrape Dialog */}
      <Dialog open={reScrapeDialogOpen} onOpenChange={setReScrapeDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Re-scrape Item</DialogTitle>
            <DialogDescription>
              Provide instructions for re-scraping &quot;{reScrapeTarget?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!showAiConfirmation ? (
              <>
                <div>
                  <label htmlFor="reScrapeInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions for AI
                  </label>
                  <textarea
                    id="reScrapeInstructions"
                    value={reScrapeInstructions}
                    onChange={(e) => setReScrapeInstructions(e.target.value)}
                    placeholder="Describe what to rescrape (e.g. Add 15 more images, update description, improve tags, full rescrape)"
                    className="w-full px-6 py-4 border-2 border-gray-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 resize-none text-base leading-relaxed bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                    rows={8}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReScrapeDialogOpen(false)
                      setReScrapeTarget(null)
                      setReScrapeInstructions('')
                      setAiUnderstanding('')
                      setShowAiConfirmation(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={getAiUnderstanding}
                    disabled={!reScrapeInstructions.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Get AI Understanding
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-2">AI Understanding</h4>
                      <p className="text-blue-800 whitespace-pre-line text-sm">{aiUnderstanding}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAiConfirmation(false)
                      setAiUnderstanding('')
                    }}
                  >
                    Let me clarify
                  </Button>
                  <Button
                    onClick={executeReScrape}
                    disabled={reScrapeTarget ? processing.has(reScrapeTarget.id) : false}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {reScrapeTarget && processing.has(reScrapeTarget.id) ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Re-scraping...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm & Re-scrape
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}