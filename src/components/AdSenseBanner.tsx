"use client"

import { useEffect, useRef } from "react"

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdSenseBannerProps {
  slot?: string
  format?: string
  responsive?: boolean
  className?: string
}

export default function AdSenseBanner({ 
  slot = "3572195600", 
  format = "auto", 
  responsive = true,
  className = ""
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const adLoaded = useRef(false)

  useEffect(() => {
    // Only load the ad once
    if (adLoaded.current) return

    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
          adLoaded.current = true
          console.log("AdSense Banner Loaded:", { slot, format, responsive })
        }
      } catch (error) {
        console.error('AdSense ad failed to load:', error)
      }
    }

    // Load ad after a short delay to ensure AdSense script is ready
    const timer = setTimeout(loadAd, 100)
    
    return () => clearTimeout(timer)
  }, [slot, format, responsive])

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4768819231981592"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}
