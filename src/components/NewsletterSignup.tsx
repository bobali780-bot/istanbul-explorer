'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'hero'
  className?: string
}

export default function NewsletterSignup({ variant = 'default', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      })

      const data = await response.json()

      if (data.success) {
        setSubscribed(true)
        setEmail('')
        // Show success message for 5 seconds
        setTimeout(() => {
          setSubscribed(false)
        }, 5000)
      } else {
        setError(data.error || 'Failed to subscribe')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-sm px-4 py-2"
            >
              {loading ? '...' : 'Subscribe'}
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Subscribed!</span>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div className={`text-center ${className}`}>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="flex-1 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-purple-500"
                aria-label="Email address for newsletter subscription"
              />
              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="bg-purple-600 hover:bg-purple-700 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-2 bg-red-600/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-200 flex items-center gap-2">
                  <span className="text-red-400">⚠</span>
                  {error}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-300 mt-3">
              Join 1,000+ travelers getting insider tips. Unsubscribe anytime.
            </p>
          </form>
        ) : (
          <div className="bg-green-600 text-white p-6 rounded-lg max-w-md mx-auto text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✓</span>
            </div>
            <p className="font-semibold text-lg">You're subscribed!</p>
            <p className="text-sm mt-1 opacity-90">You'll receive insider tips every two weeks.</p>
            <p className="text-xs mt-2 opacity-75">This form will reset in a few seconds...</p>
          </div>
        )}
      </div>
    )
  }

  // Default variant - Card format
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-600" />
          <CardTitle>Stay Updated</CardTitle>
        </div>
        <CardDescription>
          Get weekly Istanbul insider tips delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="w-full"
            />
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe to Newsletter'
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </form>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-600">Successfully subscribed!</p>
            <p className="text-sm text-gray-600 mt-1">You'll receive our newsletter soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
