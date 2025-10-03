'use client'

import { useEffect } from 'react'

export function AdSenseScript() {
  useEffect(() => {
    // Inject AdSense script into document head
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4768819231981592'
    script.crossOrigin = 'anonymous'

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${script.src}"]`)
    if (!existingScript) {
      document.head.appendChild(script)
    }
  }, [])

  return null
}
