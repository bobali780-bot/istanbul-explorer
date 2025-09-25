"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Globe,
  Image,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Database,
  Eye,
  AlertTriangle,
  Copy,
  ExternalLink,
  FileText
} from "lucide-react"

interface TermResult {
  term: string
  detectedCategory: 'activities' | 'restaurants' | 'hotels' | 'shopping'
  status: 'success' | 'duplicate' | 'failed'
  id?: number
  title?: string
  imagesCount?: number
  confidence?: number
  error?: {
    step: 'search' | 'details' | 'photos' | 'unsplash' | 'dedupe' | 'staging' | 'duplicate' | 'validation'
    message: string
  }
}

interface ScrapingSummary {
  total_terms: number
  processed: number
  successful: number
  failed: number
  duplicates: number
  credits_used: number
}

interface ErrorDetails {
  term: string
  step: string
  message: string
  category?: string
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'activities': return 'Activity'
    case 'restaurants': return 'Restaurant'
    case 'hotels': return 'Hotel'
    case 'shopping': return 'Shopping'
    default: return category
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'activities': return 'border-blue-500 text-blue-700'
    case 'restaurants': return 'border-green-500 text-green-700'
    case 'hotels': return 'border-purple-500 text-purple-700'
    case 'shopping': return 'border-orange-500 text-orange-700'
    default: return 'border-gray-500 text-gray-700'
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'success':
      return {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Success'
      }
    case 'duplicate':
      return {
        icon: Copy,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Duplicate'
      }
    case 'failed':
      return {
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Failed'
      }
    default:
      return {
        icon: AlertTriangle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: status
      }
  }
}

function getStepLabel(step: string): string {
  switch (step) {
    case 'search': return 'Google Places Search'
    case 'details': return 'Venue Details'
    case 'photos': return 'Google Photos'
    case 'unsplash': return 'Unsplash Images'
    case 'dedupe': return 'Image Deduplication'
    case 'staging': return 'Database Save'
    case 'duplicate': return 'Duplicate Check'
    case 'validation': return 'Content Validation'
    default: return step
  }
}

export default function HybridScrapingPage() {
  const [searchTerms, setSearchTerms] = useState('Blue Mosque\nHagia Sophia\nGalata Tower')
  const [category, setCategory] = useState('auto')
  const [imagesPerItem, setImagesPerItem] = useState(12)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TermResult[]>([])
  const [summary, setSummary] = useState<ScrapingSummary | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [errorDetails, setErrorDetails] = useState<ErrorDetails[]>([])

  const handleStartScraping = async () => {
    if (!searchTerms.trim()) {
      alert('Please enter at least one search term')
      return
    }

    setIsRunning(true)
    setResults([])
    setSummary(null)
    setProgress(0)

    try {
      const termsArray = searchTerms
        .split('\n')
        .map(term => term.trim())
        .filter(term => term.length > 0)

      console.log('Starting hybrid scraping for:', termsArray)

      const response = await fetch('/api/admin/scrape-hybrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchTerms: termsArray,
          category: category === 'auto' ? undefined : category,
          imagesPerItem
        })
      })

      const data = await response.json()
      console.log('Scraping response:', data)

      if (data.success) {
        setResults(data.results || [])
        setSummary(data.summary)
        setJobId(data.job_id)
        setProgress(100)

        // Extract error details from results
        const errors: ErrorDetails[] = data.results
          ?.filter((result: TermResult) => result.error)
          .map((result: TermResult) => ({
            term: result.term,
            step: result.error!.step,
            message: result.error!.message,
            category: result.detectedCategory
          })) || []
        setErrorDetails(errors)
      } else {
        throw new Error(data.error || 'Scraping failed')
      }

    } catch (error) {
      console.error('Scraping error:', error)
      alert(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hybrid Content Scraping</h1>
        <p className="mt-2 text-gray-600">
          API-first scraping with Firecrawl enrichment for high-quality, relevant content
        </p>
      </div>

      {/* Strategy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Hybrid Scraping Strategy
          </CardTitle>
          <CardDescription>
            This system uses multiple data sources to ensure accurate, relevant content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Database className="h-8 w-8 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold">1. Structured APIs</h3>
                <p className="text-sm text-gray-600">
                  Google Places, TripAdvisor APIs for core data (title, ratings, location, photos)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-8 w-8 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">2. Firecrawl Enrichment</h3>
                <p className="text-sm text-gray-600">
                  Official website scraping for highlights, tips, and additional images
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Image className="h-8 w-8 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold">3. Image Fallbacks</h3>
                <p className="text-sm text-gray-600">
                  Unsplash/Pexels APIs ensure 10-15 high-quality images per activity
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scraping Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Scraping Configuration</CardTitle>
          <CardDescription>
            Configure your hybrid scraping job with validated sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Terms (one per line)
            </label>
            <textarea
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              rows={6}
              className="w-full p-3 border rounded-md resize-none"
              placeholder="Blue Mosque&#10;Hagia Sophia&#10;Galata Tower&#10;Topkapi Palace&#10;Grand Bazaar"
            />
            <p className="text-xs text-gray-500 mt-1">
              ✅ Use specific attraction names for best results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="auto">Auto (detect from content)</option>
                <option value="activities">Activities & Attractions</option>
                <option value="restaurants">Restaurants & Dining</option>
                <option value="hotels">Hotels & Accommodation</option>
                <option value="shopping">Shopping & Markets</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Images Per Item</label>
              <Input
                type="number"
                value={imagesPerItem}
                onChange={(e) => setImagesPerItem(Math.max(1, Math.min(30, parseInt(e.target.value) || 15)))}
                min={1}
                max={30}
                className="w-full"
                placeholder="15"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: 1, Maximum: 30, Recommended: 15
              </p>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleStartScraping}
                disabled={isRunning}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Start Hybrid Scraping
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Hybrid scraping in progress...</p>
                <p className="text-xs text-gray-500">
                  Fetching structured data → Enriching with Firecrawl → Adding stock images
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Scraping Results
              {jobId && <Badge variant="secondary">Job #{jobId}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.total_terms}</div>
                <div className="text-sm text-gray-600">Total Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.successful}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.duplicates || 0}</div>
                <div className="text-sm text-gray-600">Duplicates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{summary.credits_used}</div>
                <div className="text-sm text-gray-600">Credits Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((summary.successful / summary.total_terms) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>

            {errorDetails.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Issues encountered:</strong> {errorDetails.length} error{errorDetails.length !== 1 ? 's' : ''}
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[600px]">
                        <SheetHeader>
                          <SheetTitle>Error Details</SheetTitle>
                          <SheetDescription>
                            Detailed breakdown of issues encountered during scraping
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                          {errorDetails.map((error, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{error.term}</h4>
                                    {error.category && (
                                      <Badge variant="outline" className={getCategoryColor(error.category)}>
                                        {getCategoryLabel(error.category)}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {getStepLabel(error.step)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2">{error.message}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scraped Content ({results.length})</CardTitle>
            <CardDescription>
              Content is now in staging for review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => {
                const statusBadge = getStatusBadge(result.status)
                const StatusIcon = statusBadge.icon

                return (
                  <div key={`${result.term}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{result.title || result.term}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCategoryColor(result.detectedCategory)}`}
                          >
                            {getCategoryLabel(result.detectedCategory)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          {result.confidence !== undefined && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {result.confidence}% confidence
                            </span>
                          )}
                          {result.imagesCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Image className="h-3 w-3" />
                              {result.imagesCount} images
                              {result.imagesCount < imagesPerItem && (
                                <span className="text-orange-600">
                                  (needs {imagesPerItem - result.imagesCount} more)
                                </span>
                              )}
                            </span>
                          )}
                          {result.error && (
                            <span className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              {getStepLabel(result.error.step)}
                            </span>
                          )}
                        </div>
                        {result.error && (
                          <p className="text-xs text-red-600 mt-1 max-w-md truncate">
                            {result.error.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${statusBadge.color} flex items-center gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </Badge>
                      {result.id && (
                        <Badge variant="secondary" className="text-xs">
                          ID #{result.id}
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Next Steps</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Content has been added to staging. Go to{' '}
                    <a href="/admin/staging" className="underline hover:no-underline">
                      Staging Review
                    </a>{' '}
                    to preview, approve, and publish them to your live site.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {results.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quick Actions:</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href="/admin/staging">
                    <Eye className="h-4 w-4 mr-2" />
                    Review in Staging
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setResults([])
                  setSummary(null)
                  setJobId(null)
                  setErrorDetails([])
                }}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}