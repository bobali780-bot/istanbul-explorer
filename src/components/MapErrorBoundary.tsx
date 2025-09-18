"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface MapErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class MapErrorBoundary extends React.Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  constructor(props: MapErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MapErrorBoundary caught an error:", error)
    console.error("Error stack:", error.stack)
    console.error("Component stack:", errorInfo.componentStack)
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="w-full h-96 rounded-lg border-2 border-red-300 bg-red-50 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Map Error
            </h3>
            <p className="text-sm text-red-600 mb-4">
              The map encountered an error and couldn&apos;t load properly.
            </p>
            {this.state.error && (
              <details className="text-xs text-red-500 mb-4 text-left">
                <summary className="cursor-pointer font-medium">
                  Error Details
                </summary>
                <div className="mt-2 p-2 bg-red-100 rounded border">
                  <div className="font-mono break-all">
                    {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="mt-2 font-mono text-xs break-all">
                      {this.state.error.stack}
                    </div>
                  )}
                </div>
              </details>
            )}
            <Button 
              onClick={this.handleRetry}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Retry Map
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
