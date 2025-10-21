'use client'

import { useEffect } from 'react'

export function AdSenseScript() {
  useEffect(() => {
    // ⚡ Performance Optimization: Defer AdSense loading until browser is idle
    // This prevents blocking the main thread during initial page load
    const loadAdSense = () => {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4768819231981592'
      script.crossOrigin = 'anonymous'

      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${script.src}"]`)
      if (!existingScript) {
        document.head.appendChild(script)
      }
    }

    // Load AdSense when browser is idle or after 3 seconds (fallback)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAdSense, { timeout: 3000 })
    } else {
      setTimeout(loadAdSense, 3000)
    }
  }, [])

  return null
}
