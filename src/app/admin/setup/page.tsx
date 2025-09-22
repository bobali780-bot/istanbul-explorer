"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Database } from "lucide-react"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const setupDatabase = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/admin/setup-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Setup failed')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard Setup</h1>
        <p className="mt-2 text-gray-600">
          Initialize the database schema for the content scraping and review system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema Setup
          </CardTitle>
          <CardDescription>
            Creates staging tables, content sources, and scraping job tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p><strong>This will create:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>staging_queue - Universal staging for all content categories</li>
              <li>duplicate_detection - Prevent duplicate content</li>
              <li>content_sources - Approved scraping sources by category</li>
              <li>scraping_jobs - Job tracking and progress monitoring</li>
              <li>ai_enhancement_log - Copyright-safe AI enhancement tracking</li>
            </ul>
          </div>

          <Button
            onClick={setupDatabase}
            disabled={loading}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up database...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Initialize Database Schema
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Setup Completed Successfully
            </CardTitle>
            <CardDescription>
              Database schema has been created and tested
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.summary?.total_statements || 0}
                </div>
                <div className="text-sm text-blue-600">Total Operations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {result.summary?.successful || 0}
                </div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {result.summary?.failed || 0}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {/* Test Results */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800">Database Test</div>
              <div className="text-sm text-green-600 mt-1">
                {result.test_insert}
              </div>
            </div>

            {/* Detailed Results */}
            {result.details && result.details.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Execution Details:</h3>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {result.details.map((detail: any, index: number) => (
                    <div key={index} className={`text-xs p-2 rounded ${
                      detail.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className="font-medium">Statement {detail.statement}:</span>
                      {detail.success ? ' ✓ Success' : ` ✗ ${detail.error}`}
                      <div className="mt-1 text-gray-500 font-mono">
                        {detail.sql}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <strong>✅ Phase 1 Complete!</strong> Database schema is ready.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Next:</strong> Test Phase 2 - Firecrawl integration with real Istanbul data
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}