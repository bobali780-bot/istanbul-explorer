"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  X
} from "lucide-react"

export default function ImportActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [bulkTerms, setBulkTerms] = useState('')
  const [csvData, setCsvData] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSingleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    setProgress(0)

    try {
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerms: searchTerm.trim(),
          jobType: 'single_search'
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Scraping failed')
      }

      setResults(data)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkImport = async () => {
    const terms = bulkTerms
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (terms.length === 0) {
      setError('Please enter at least one search term')
      return
    }

    setLoading(true)
    setError('')
    setProgress(0)

    try {
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerms: terms,
          jobType: 'bulk_import'
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Bulk import failed')
      }

      setResults(data)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCsvImport = async () => {
    if (!csvData.trim()) {
      setError('Please paste CSV data')
      return
    }

    // Parse CSV data (simple implementation)
    const lines = csvData.split('\n').map(line => line.trim()).filter(line => line)
    const terms = lines.map(line => {
      // Assume first column is the activity name
      const columns = line.split(',')
      return columns[0].replace(/"/g, '').trim()
    }).filter(term => term.length > 0)

    if (terms.length === 0) {
      setError('No valid data found in CSV')
      return
    }

    setLoading(true)
    setError('')
    setProgress(0)

    try {
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerms: terms,
          jobType: 'csv_upload'
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'CSV import failed')
      }

      setResults(data)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSearchTerm('')
    setBulkTerms('')
    setCsvData('')
    setResults(null)
    setError('')
    setProgress(0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Activities</h1>
        <p className="mt-2 text-gray-600">
          Search for activities using Firecrawl to scrape rich content from multiple sources
        </p>
      </div>

      {/* Import Tabs */}
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Single Search
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            CSV Upload
          </TabsTrigger>
        </TabsList>

        {/* Single Search */}
        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search for Activity</CardTitle>
              <CardDescription>
                Enter an activity name to search and scrape content from multiple travel sites
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Blue Mosque Istanbul"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSingleSearch()}
                  disabled={loading}
                />
                <Button
                  onClick={handleSingleSearch}
                  disabled={loading || !searchTerm.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                <p><strong>What this does:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Searches TripAdvisor, Lonely Planet, GetYourGuide, and more</li>
                  <li>Extracts titles, descriptions, images, ratings, and reviews</li>
                  <li>Saves results to staging area for your review</li>
                  <li>Typically finds 10-15 high-quality images per activity</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Import */}
        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import Activities</CardTitle>
              <CardDescription>
                Enter multiple activity names, one per line, to import in batch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter activity names, one per line:&#10;&#10;Hagia Sophia Istanbul&#10;Blue Mosque Istanbul&#10;Topkapi Palace Istanbul&#10;Grand Bazaar Istanbul"
                value={bulkTerms}
                onChange={(e) => setBulkTerms(e.target.value)}
                rows={8}
                disabled={loading}
              />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {bulkTerms.split('\n').filter(line => line.trim()).length} activities to import
                </span>
                <Button
                  onClick={handleBulkImport}
                  disabled={loading || !bulkTerms.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Import All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CSV Upload */}
        <TabsContent value="csv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CSV Data Import</CardTitle>
              <CardDescription>
                Paste CSV data with activity names in the first column
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your CSV data here:&#10;&#10;Activity Name,Category,Location&#10;Hagia Sophia,Historical,Sultanahmet&#10;Blue Mosque,Religious,Sultanahmet"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows={8}
                disabled={loading}
              />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  First column will be used as activity names
                </span>
                <Button
                  onClick={handleCsvImport}
                  disabled={loading || !csvData.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Import CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Scraping in progress...</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500">
                This may take a few minutes depending on the number of activities
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Import Completed
                </CardTitle>
                <CardDescription>
                  Activities have been imported to the staging area for review
                </CardDescription>
              </div>
              <Button onClick={resetForm} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {results.summary?.total_terms || 0}
                </div>
                <div className="text-sm text-blue-600">Total Searched</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {results.summary?.successful || 0}
                </div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {results.summary?.failed || 0}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {results.results?.reduce((total: number, r: any) => total + r.images_count, 0) || 0}
                </div>
                <div className="text-sm text-purple-600">Images Found</div>
              </div>
            </div>

            {/* Results List */}
            {results.results && results.results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Imported Activities:</h3>
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{result.name}</span>
                      <div className="text-sm text-gray-500">
                        {result.images_count} images, {result.reviews_count} reviews
                      </div>
                    </div>
                    <Badge variant={result.confidence_score >= 80 ? 'default' : 'secondary'}>
                      {result.confidence_score}% confidence
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Errors */}
            {results.summary?.errors && results.summary.errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-red-900">Errors:</h3>
                <div className="space-y-1">
                  {results.summary.errors.map((error: string, index: number) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <strong>Next steps:</strong> Go to the staging area to review, edit, and approve these activities before publishing.
              </p>
              <Button asChild>
                <a href="/admin/activities/staging">
                  Review in Staging Area
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}